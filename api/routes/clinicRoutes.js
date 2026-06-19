const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const Clinic = require('../models/Clinic');

const analyticsController = require('../controllers/clinic/analyticsController');
const doctorController = require('../controllers/clinic/doctorController');
const appointmentController = require('../controllers/clinic/appointmentController');
const settingsController = require('../controllers/clinic/settingsController');
const staffController = require('../controllers/clinic/staffController');
const patientController = require('../controllers/clinic/patientController');

const attachClinicId = async (req, res, next) => {
  try {
    const clinic = await Clinic.findOne({ adminId: req.user._id });
    if (clinic) {
      req.user.clinicId = clinic._id;
    }
    next();
  } catch (error) {
    next(error);
  }
};

router.use(protect);
router.use(authorize('clinic_admin'));
router.use(attachClinicId);

router.get('/analytics/overview', analyticsController.getOverview);
router.get('/analytics/patient-flow', analyticsController.getPatientFlow);
router.get('/analytics/revenue', analyticsController.getRevenue);
router.get('/analytics/revenue-history', analyticsController.getRevenueHistory);

router.get('/doctors', doctorController.getDoctors);
router.get('/doctors/search', doctorController.searchDoctorByEmail);
router.post('/doctors', doctorController.addDoctor);
router.delete('/doctors/:id', doctorController.removeDoctor);
router.get('/doctors/:id/stats', doctorController.getDoctorStats);

router.get('/appointments', appointmentController.getAppointments);
router.get('/appointments/:id', appointmentController.getAppointmentById);
router.delete('/appointments/:id', appointmentController.deleteAppointment);
router.get('/prescriptions', appointmentController.getPrescriptions);
router.delete('/prescriptions/:id', appointmentController.deletePrescription);

router.get('/settings', settingsController.getSettings);
router.put('/settings', settingsController.updateSettings);

router.get('/staff', staffController.getStaff);
router.post('/staff', staffController.createStaff);
router.put('/staff/:id', staffController.updateStaff);
router.delete('/staff/:id', staffController.deleteStaff);

router.get('/patients', patientController.getPatients);
router.post('/patients', patientController.createPatient);
router.get('/patients/search', patientController.searchPatients);
router.get('/patients/:id', patientController.getPatientProfile);
router.delete('/patients/records/:id', patientController.deleteRecord);

module.exports = router;
