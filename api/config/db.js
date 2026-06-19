const mongoose = require('mongoose');

// Stale indexes to drop on startup (schema renames, dropped fields, etc.)
const STALE_INDEXES = [
  { collection: 'clinics', index: 'ownerId_1' },
  { collection: 'clinics', index: 'userId_1' },
];

const dropStaleIndexes = async () => {
  for (const { collection, index } of STALE_INDEXES) {
    try {
      await mongoose.connection.collection(collection).dropIndex(index);
      console.log(`Dropped stale index: ${collection}.${index}`);
    } catch (err) {
      // Index doesn't exist — nothing to do
      if (err.code !== 27) {
        console.warn(
          `Could not drop index ${collection}.${index}:`,
          err.message,
        );
      }
    }
  }
};

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is not defined');
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');

    await dropStaleIndexes();
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
