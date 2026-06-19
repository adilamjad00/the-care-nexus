const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// Import controllers
const geminiController = require('../controllers/ai/geminiController');
const groqController = require('../controllers/ai/groqController');
const parsePrescriptionController = require('../controllers/ai/parsePrescription');

// All routes require authentication
router.use(protect);

// ========== Gemini Chat Routes ==========
router.post('/gemini/chat', authorize('patient'), geminiController.chat);
router.post(
  '/gemini/health-advice',
  authorize('patient'),
  geminiController.getHealthAdvice,
);

// ========== Groq Chat Routes ==========
router.post('/groq/chat', authorize('patient'), groqController.chat);
router.post(
  '/groq/health-advice',
  authorize('patient'),
  groqController.getHealthAdvice,
);

// ========== Doctor Clinical AI Chat ==========
router.post('/doctor/chat', authorize('doctor'), groqController.doctorChat);

// ========== Clinic Operations AI Chat ==========
router.post(
  '/clinic/chat',
  authorize('clinic_admin'),
  groqController.clinicChat,
);

// ========== Prescription AI Routes (Doctor only) ==========
router.post(
  '/prescriptions/parse',
  authorize('doctor'),
  parsePrescriptionController.parseTranscript,
);
router.post(
  '/prescription/parse',
  authorize('doctor'),
  parsePrescriptionController.parseTranscript,
);
router.post(
  '/gemini/parse-prescription',
  authorize('doctor'),
  parsePrescriptionController.parseTranscript,
);
router.post('/chat/transcribe', authorize('doctor'), (req, res) => {
  res
    .status(410)
    .json({
      success: false,
      message:
        'This endpoint has been removed. Use /api/ai/prescriptions/parse.',
    });
});

module.exports = router;
