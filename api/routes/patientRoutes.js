const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// Import controllers
const dashboardController = require('../controllers/patient/dashboardController');
const recordsController = require('../controllers/patient/recordsController');
const appointmentsController = require('../controllers/patient/appointmentsController');
const familyController = require('../controllers/patient/familyController');
const profileController = require('../controllers/patient/profileController');
const reviewController = require('../controllers/patient/reviewController');
const connectionController = require('../controllers/patient/connectionController');

// All routes require authentication and patient role
router.use(protect);
router.use(authorize('patient'));

// ========== Connection Routes ==========
router.get('/connections/requests', connectionController.getConnectionRequests);
router.put(
  '/connections/requests/:id',
  connectionController.handleConnectionRequest,
);

// ========== Review Routes ==========
router.post('/reviews', reviewController.submitReview);
router.put('/reviews/:id', reviewController.updateReview);

// ========== Dashboard Routes ==========
router.get('/dashboard', dashboardController.getDashboard);
router.get('/spent-history', dashboardController.getSpentHistory);

// ========== Medical Records Routes ==========
router.get('/records', recordsController.getRecords);
router.post('/records/upload', recordsController.uploadRecord);
router.get('/records/:id', recordsController.getRecordDetail);
router.delete('/records/:id', recordsController.deleteRecord);

// ========== Appointments Routes ==========
router.get('/appointments', appointmentsController.getAppointments);
router.post('/appointments', appointmentsController.bookAppointment);
router.post('/appointments/reserve-slot', appointmentsController.reserveSlot);
router.get(
  '/appointments/available-slots',
  appointmentsController.getAvailableSlots,
);
router.put(
  '/appointments/:id/cancel',
  appointmentsController.cancelAppointment,
);
router.delete('/appointments/:id', appointmentsController.deleteAppointment);
router.put('/appointments/:id/rate', appointmentsController.rateAppointment);
router.get('/clinics', appointmentsController.getClinics);
router.get('/doctors', appointmentsController.getDoctors);

// ========== Family Routes ==========
router.get('/family', familyController.getFamilyMembers);
router.post('/family', familyController.addFamilyMember);
router.put('/family/:memberId', familyController.editFamilyMember);
router.delete('/family/:memberId', familyController.deleteFamilyMember);
router.get('/family/:memberId/records', familyController.getFamilyRecords);
router.post('/family/:memberId/records', familyController.addFamilyRecord);
router.delete(
  '/family/:memberId/records/:recordId',
  familyController.deleteFamilyRecord,
);

// ========== Profile Routes ==========
router.get('/profile', profileController.getProfile);
router.put('/profile', profileController.updateProfile);
router.put('/profile/password', profileController.updatePassword);

module.exports = router;
