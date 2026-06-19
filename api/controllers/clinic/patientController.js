const User = require('../../models/User');
const Patient = require('../../models/Patient');
const MedicalRecord = require('../../models/MedicalRecord');
const Prescription = require('../../models/Prescription');
const Appointment = require('../../models/Appointment');
const asyncHandler = require('../../utils/asyncHandler');
const ApiError = require('../../utils/ApiError');
const ApiResponse = require('../../utils/ApiResponse');

/**
 * @desc    Get all patients for the clinic with dynamic visit counts
 * @route   GET /api/clinic/patients
 * @access  Private (Clinic Admin only)
 */
exports.getPatients = asyncHandler(async (req, res) => {
  const clinicId = req.user.clinicId;
  const { page = 1, limit = 10, search } = req.query;

  // Find all unique patient IDs from clinic's appointments and created patients
  const appointments = await Appointment.find({ clinicId }).distinct(
    'patientId',
  );
  const createdPatients = await Patient.find({
    createdBy: req.user._id,
  }).distinct('userId');

  const patientIds = [
    ...new Set([
      ...appointments,
      ...createdPatients.map((id) => id.toString()),
    ]),
  ];

  let filter = {
    _id: { $in: patientIds },
    roles: 'patient',
  };

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { phone: { $regex: search, $options: 'i' } },
    ];
  }

  const patients = await User.find(filter)
    .select('name email phone createdAt photo')
    .sort({ createdAt: -1 })
    .limit(parseInt(limit))
    .skip((parseInt(page) - 1) * parseInt(limit));

  const total = await User.countDocuments(filter);

  const enrichedPatients = await Promise.all(
    patients.map(async (patient) => {
      const patientProfile = await Patient.findOne({ userId: patient._id });

      // Dynamic visit count: strictly completed appointments in this clinic
      const totalVisits = await Appointment.countDocuments({
        clinicId,
        patientId: patient._id,
        status: 'completed',
      });

      return {
        ...patient.toObject(),
        patientProfile,
        totalVisits,
      };
    }),
  );

  res.status(200).json(
    new ApiResponse(
      200,
      {
        patients: enrichedPatients,
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / parseInt(limit)),
        },
      },
      'Patients fetched successfully',
    ),
  );
});

/**
 * @desc    Get detailed patient profile for clinic admin
 * @route   GET /api/clinic/patients/:id
 * @access  Private (Clinic Admin only)
 */
exports.getPatientProfile = asyncHandler(async (req, res) => {
  const patientId = req.params.id;
  const clinicId = req.user.clinicId;

  const patient = await User.findOne({
    _id: patientId,
    roles: 'patient',
  }).select('name email phone createdAt');

  if (!patient) {
    throw new ApiError(404, 'Patient not found');
  }

  const patientProfile = await Patient.findOne({ userId: patientId });

  // Get clinic-specific appointments and prescriptions
  const appointments = await Appointment.find({ clinicId, patientId })
    .populate('doctorId', 'name')
    .sort({ dateTime: -1 });

  const prescriptions = await Prescription.find({ clinicId, patientId })
    .populate('doctorId', 'name')
    .sort({ createdAt: -1 });

  // Get medical records
  const medicalRecords = await MedicalRecord.find({ patientId })
    .populate('doctorId', 'name')
    .sort({ visitDate: -1 });

  res.status(200).json(
    new ApiResponse(
      200,
      {
        patient: {
          ...patient.toObject(),
          profile: patientProfile,
        },
        appointments,
        prescriptions,
        medicalRecords,
        stats: {
          totalVisits: appointments.filter((a) => a.status === 'completed')
            .length,
          totalPrescriptions: prescriptions.length,
        },
      },
      'Patient profile fetched successfully',
    ),
  );
});

/**
 * @desc    Search patients within clinic records
 * @route   GET /api/clinic/patients/search
 * @access  Private (Clinic Admin only)
 */
exports.searchPatients = asyncHandler(async (req, res) => {
  const rawQuery = String(req.query.q || req.query.query || '').trim();
  const clinicId = req.user.clinicId;

  if (rawQuery.length < 2) {
    return res
      .status(200)
      .json(new ApiResponse(200, [], 'Search results fetched successfully'));
  }

  const appointments = await Appointment.find({ clinicId }).distinct(
    'patientId',
  );
  const createdPatients = await Patient.find({
    createdBy: req.user._id,
  }).distinct('userId');

  const patientIds = [
    ...new Set([
      ...appointments,
      ...createdPatients.map((id) => id.toString()),
    ]),
  ];

  const patients = await User.find({
    _id: { $in: patientIds },
    roles: 'patient',
    $or: [
      { name: { $regex: rawQuery, $options: 'i' } },
      { email: { $regex: rawQuery, $options: 'i' } },
      { phone: { $regex: rawQuery, $options: 'i' } },
    ],
  }).select('name email phone');

  const enrichedPatients = await Promise.all(
    patients.map(async (patient) => {
      const totalVisits = await Appointment.countDocuments({
        clinicId,
        patientId: patient._id,
        status: 'completed',
      });
      const profile = await Patient.findOne({ userId: patient._id });
      return {
        ...patient.toObject(),
        totalVisits,
        gender: profile?.gender,
        profilePhoto: profile?.profilePhoto,
      };
    }),
  );

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        enrichedPatients,
        'Search results fetched successfully',
      ),
    );
});

/**
 * @desc    Create a new patient record in the clinic
 * @route   POST /api/clinic/patients
 * @access  Private (Clinic Admin only)
 */
exports.createPatient = asyncHandler(async (req, res) => {
  const { name, email, phone, gender, dob, address } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(400, 'User with this email already exists');
  }

  // Create base user
  const user = await User.create({
    name,
    email,
    phone,
    password: Math.random().toString(36).slice(-8) + 'P!',
    roles: ['patient'],
    isVerified: true,
  });

  // Create patient profile
  const profile = await Patient.create({
    userId: user._id,
    name,
    email,
    gender: gender || 'other',
    dob,
    address,
    contact: phone,
    createdBy: req.user._id,
  });

  res
    .status(201)
    .json(
      new ApiResponse(201, { user, profile }, 'Patient created successfully'),
    );
});

/**
 * @desc    Delete a medical record
 * @route   DELETE /api/clinic/patients/records/:id
 * @access  Private (Clinic Admin only)
 */
exports.deleteRecord = asyncHandler(async (req, res) => {
  const record = await MedicalRecord.findByIdAndDelete(req.params.id);
  if (!record) {
    throw new ApiError(404, 'Record not found');
  }
  res
    .status(200)
    .json(new ApiResponse(200, null, 'Record deleted successfully'));
});
