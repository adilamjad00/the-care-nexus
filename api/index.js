const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const path = require('path');
const connectDB = require('./config/db');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');

const isServerless = !!process.env.VERCEL;

// Kick off DB connection. On Vercel this is cached across warm invocations.
connectDB().catch((err) => {
  console.error('Initial DB connect failed:', err.message);
});

const app = express();

// Ensure DB is connected before handling any request on serverless cold starts.
if (isServerless) {
  app.use(async (req, res, next) => {
    try {
      await connectDB();
      next();
    } catch (err) {
      next(err);
    }
  });
}

app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  }),
);

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api', routes);
app.use('/api/chat', require('./routes/chat'));

app.get('/', (req, res) => {
  res.send('The Care Nexus API is running');
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Local-only: mount Socket.io + cron jobs + start HTTP server.
// These don't work on Vercel serverless and would prevent the deploy from booting.
if (!isServerless) {
  const http = require('http');
  const { Server } = require('socket.io');
  const cron = require('node-cron');
  const Notification = require('./models/Notification');
  require('./jobs/automationJobs');

  const server = http.createServer(app);

  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  const { setIO } = require('./config/socket');
  setIO(io);
  app.set('io', io);

  const onlineUsers = new Map();
  io.onlineUsers = onlineUsers;
  app.set('onlineUsers', onlineUsers);

  io.on('connection', (socket) => {
    socket.on('join', (data) => {
      const userId = typeof data === 'string' ? data : data?.userId;
      if (!userId) return;
      socket.join(userId);
      onlineUsers.set(userId, socket.id);
      io.emit('user_status', { userId, status: 'online' });
      console.log(`User ${userId} joined their room`);
    });

    socket.on('disconnect', () => {
      let disconnectedUserId = null;
      for (const [userId, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          disconnectedUserId = userId;
          break;
        }
      }
      if (disconnectedUserId) {
        onlineUsers.delete(disconnectedUserId);
        io.emit('user_status', {
          userId: disconnectedUserId,
          status: 'offline',
        });
      }
      console.log('Client disconnected');
    });
  });

  require('./socket/chatSocket')(io);

  cron.schedule('0 0 * * *', async () => {
    console.log('Running notification cleanup job...');
    const tenDaysAgo = new Date();
    tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);

    try {
      const result = await Notification.deleteMany({
        createdAt: { $lt: tenDaysAgo },
      });
      console.log(`Removed ${result.deletedCount} old notifications`);
    } catch (error) {
      console.error('Cleanup job error:', error);
    }
  });

  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
