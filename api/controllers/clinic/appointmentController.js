const Appointment = require('../../models/Appointment');
const Clinic = require('../../models/Clinic');
const asyncHandler = require('../../utils/asyncHandler');
const ApiError = require('../../utils/ApiError');
const ApiResponse = require('../../utils/ApiResponse');

exports.getAppointments = asyncHandler(async (req, res) => {
  const userClinic = await Clinic.findOne({ adminId: req.user._id });
  if (!userClinic) {
    throw new ApiError(404, 'Clinic not found for this user');
  }
  const clinicId = userClinic._id;
  const { doctorId, status, from, to, patientId } = req.query;
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 100);

  const filter = {
    clinicId: clinicId,
  };

  if (doctorId) filter.doctorId = doctorId;
  if (patientId) filter.patientId = patientId;
  if (status) filter.status = status;

  if (from || to) {
    filter.dateTime = {};
    if (from) filter.dateTime.$gte = new Date(from);
    if (to) filter.dateTime.$lte = new Date(to);
  }

  const appointments = await Appointment.find(filter)
    .populate('patientId', 'name email phone photo')
    .populate({
      path: 'doctorId',
      select: 'name email photo',
      populate: { path: 'doctorProfile', select: 'specialization fullName' },
    })
    .populate('clinicId', 'name address')
    .sort({ dateTime: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  const total = await Appointment.countDocuments(filter);

  res.status(200).json(
    new ApiResponse(200, {
      appointments,
      pagination: {
        total,
        page,
        pages: Math.max(Math.ceil(total / limit), 1),
        limit,
      },
    }),
  );
});

exports.getAppointmentById = asyncHandler(async (req, res) => {
  const userClinic = await Clinic.findOne({ adminId: req.user._id });
  if (!userClinic) {
    throw new ApiError(404, 'Clinic not found for this user');
  }

  const { id } = req.params;

  const appointment = await Appointment.findOne({
    _id: id,
    clinicId: userClinic._id,
  })
    .populate('patientId', 'name email phone photo')
    .populate({
      path: 'doctorId',
      select: 'name email photo',
      populate: { path: 'doctorProfile', select: 'specialization fullName' },
    })
    .populate('clinicId', 'name address');

  if (!appointment) {
    throw new ApiError(404, 'Appointment not found for this clinic');
  }

  // Get prescription, patient profile, etc.
  const Prescription = require('../../models/Prescription');
  const PatientProfile = require('../../models/Patient');

  const prescription = await Prescription.findOne({
    appointmentId: appointment._id,
  });
  const patientProfile = await PatientProfile.findOne({
    userId: appointment.patientId._id,
  });

  // Calculate revenue fields for the frontend
  let totalFee = 0;
  let clinicRevenue = 0;

  if (prescription) {
    totalFee = prescription.totalCost || prescription.consultationFee || 0;
    clinicRevenue = totalFee * 0.2;
  } else if (appointment.status === 'completed') {
    // Fallback if no prescription but completed - use doctor's consultation fee
    const doctor = await require('../../models/Doctor').findOne({
      userId: appointment.doctorId._id,
    });
    totalFee = doctor?.consultationFee || 0;
    clinicRevenue = totalFee * 0.2;
  }

  const result = {
    ...appointment.toObject(),
    totalFee,
    clinicRevenue,
    doctor: {
      name: appointment.doctorId?.name,
      fullName:
        appointment.doctorId?.doctorProfile?.fullName ||
        appointment.doctorId?.name,
      specialization: appointment.doctorId?.doctorProfile?.specialization,
      photo: appointment.doctorId?.photo,
    },
    patient: {
      name: appointment.patientId?.name,
      email: appointment.patientId?.email,
      photo: appointment.patientId?.photo,
      contact: patientProfile?.contact || appointment.patientId?.phone,
      bloodGroup: patientProfile?.bloodGroup,
      dob: patientProfile?.dob,
    },
    prescription: prescription
      ? {
          _id: prescription._id,
          diagnosis: prescription.diagnosis,
          medicines: prescription.medicines,
          consultationFee: prescription.consultationFee,
          medicineCost: prescription.medicineCost,
          totalCost: prescription.totalCost,
          notes: prescription.notes,
          followUpDate: prescription.followUpDate,
        }
      : null,
  };

  res
    .status(200)
    .json(new ApiResponse(200, result, 'Appointment fetched successfully'));
});

exports.getPrescriptions = asyncHandler(async (req, res) => {
  const userClinic = await Clinic.findOne({ adminId: req.user._id });
  if (!userClinic) throw new ApiError(404, 'Clinic not found');

  const { doctorId, from, to } = req.query;
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 100);
  const query = { clinicId: userClinic._id };

  if (doctorId) query.doctorId = doctorId;
  if (from || to) {
    query.createdAt = {};
    if (from) query.createdAt.$gte = new Date(from);
    if (to) query.createdAt.$lte = new Date(to);
  }

  const Prescription = require('../../models/Prescription');
  const prescriptions = await Prescription.find(query)
    .populate('patientId', 'name email')
    .populate('doctorId', 'name')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  const total = await Prescription.countDocuments(query);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        prescriptions,
        pagination: {
          total,
          page,
          pages: Math.max(Math.ceil(total / limit), 1),
          limit,
        },
      },
      'Prescriptions fetched successfully',
    ),
  );
});

exports.deleteAppointment = asyncHandler(async (req, res) => {
  const userClinic = await Clinic.findOne({ adminId: req.user._id });
  if (!userClinic) throw new ApiError(404, 'Clinic not found');

  const { id } = req.params;
  const appointment = await Appointment.findOne({
    _id: id,
    clinicId: userClinic._id,
  });

  if (!appointment) {
    throw new ApiError(
      404,
      'Appointment not found or not belonging to this clinic',
    );
  }

  await Appointment.findByIdAndDelete(id);

  res
    .status(200)
    .json(new ApiResponse(200, null, 'Appointment deleted successfully'));
});

exports.deletePrescription = asyncHandler(async (req, res) => {
  const userClinic = await Clinic.findOne({ adminId: req.user._id });
  if (!userClinic) throw new ApiError(404, 'Clinic not found');

  const { id } = req.params;
  const Prescription = require('../../models/Prescription');
  const prescription = await Prescription.findOne({
    _id: id,
    clinicId: userClinic._id,
  });

  if (!prescription) {
    throw new ApiError(
      404,
      'Prescription not found or not belonging to this clinic',
    );
  }

  await Prescription.findByIdAndDelete(id);

  res
    .status(200)
    .json(new ApiResponse(200, null, 'Prescription deleted successfully'));
});
