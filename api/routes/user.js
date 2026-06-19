const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const User = require('../models/User');

router.get('/language', protect, async (req, res) => {
  const user = await User.findById(req.user.id).select('language');
  res.json({ success: true, data: { language: user.language || 'en' } });
});

router.put('/language', protect, async (req, res) => {
  const { language } = req.body;
  if (!['en', 'ur'].includes(language)) {
    return res
      .status(400)
      .json({ success: false, message: 'Invalid language. Must be en or ur.' });
  }
  await User.findByIdAndUpdate(req.user.id, { language });
  res.json({ success: true, data: { language } });
});

module.exports = router;
