const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const doctorRoutes = require('./doctorRoutes');
const aiRoutes = require('./aiRoutes');
const clinicRoutes = require('./clinicRoutes');
const patientRoutes = require('./patientRoutes');
const notificationRoutes = require('./notificationRoutes');
const publicRoutes = require('./publicRoutes');
const userRoutes = require('./user');

router.use('/auth', authRoutes);
router.use('/doctor', doctorRoutes);
router.use('/ai', aiRoutes);
router.use('/clinic', clinicRoutes);
router.use('/patient', patientRoutes);
router.use('/notifications', notificationRoutes);
router.use('/public', publicRoutes);
router.use('/user', userRoutes);

router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
