const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getConversations,
  getMessages,
  startOrGetConversation,
  markRead,
  deleteMessage,
  deleteConversation,
} = require('../controllers/chatController');
const multer = require('multer');
const cloudinary = require('../config/cloudinary');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

router.get('/conversations', protect, getConversations);
router.get('/conversations/:conversationId/messages', protect, getMessages);
router.post('/conversations', protect, startOrGetConversation);
router.put('/conversations/:conversationId/read', protect, markRead);
router.delete('/conversations/:conversationId', protect, deleteConversation);
router.delete('/messages/:messageId', protect, deleteMessage);

router.post(
  '/conversations/:conversationId/upload',
  protect,
  upload.single('file'),
  async (req, res) => {
    if (!req.file)
      return res
        .status(400)
        .json({ success: false, message: 'No file uploaded' });

    const stream = cloudinary.uploader.upload_stream(
      { folder: 'carenexus/chat', resource_type: 'auto' },
      (error, result) => {
        if (error)
          return res
            .status(500)
            .json({ success: false, message: 'Upload failed' });
        res.json({
          success: true,
          data: { fileUrl: result.secure_url, fileName: req.file.originalname },
        });
      },
    );
    stream.end(req.file.buffer);
  },
);

module.exports = router;
