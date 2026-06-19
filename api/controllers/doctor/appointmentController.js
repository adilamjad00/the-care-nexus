const Appointment = require('../../models/Appointment');
const User = require('../../models/User');
const Doctor = require('../../models/Doctor');
const Clinic = require('../../models/Clinic');
const Prescription = require('../../models/Prescription');
const { updateRevenue } = require('../../utils/revenue');
const { createNotification } = require('../../utils/notification');
const asyncHandler = require('../../utils/asyncHandler');
const ApiError = require('../../utils/ApiError');
const ApiResponse = require('../../utils/ApiResponse');

const resolvePrescriptionTotalCost = (payload = {}) => {
  const consultationFee = Number(payload.consultationFee || 0);
  const medicineCost = Number(payload.medicineCost || 0);
  const explicitTotal = Number(payload.totalCost || 0);
  return explicitTotal > 0 ? explicitTotal : consultationFee + medicineCost;
};

const createPrescriptionForCompletedAppointment = async ({
  appointment,
  doctorId,
  prescriptionData = {},
  req,
}) => {
  if (!appointment || appointment.prescriptionId) {
    return null;
  }

  const payload =
    prescriptionData.prescription ||
    prescriptionData.prescriptionData ||
    prescriptionData;
  if (!payload || !payload.diagnosis) {
    return null;
  }

  const doctor = await Doctor.findOne({ userId: doctorId });
  const patientUser = await User.findById(appointment.patientId).select('name');
  const doctorFullName = doctor?.fullName || req.user?.name || 'your doctor';
  const patientFullName = patientUser?.name || 'the patient';
  const consultationFee = Number(
    payload.consultationFee || doctor?.consultationFee || 0,
  );
  const medicineCost = Number(payload.medicineCost || 0);
  const resolvedTotalCost =
    Number(payload.totalCost || 0) > 0
      ? Number(payload.totalCost)
      : consultationFee + medicineCost;

  const prescription = await Prescription.create({
    doctorId,
    patientId: appointment.patientId,
    appointmentId: appointment._id,
    clinicId: doctor?.clinicId || appointment.clinicId || null,
    diagnosis: payload.diagnosis,
    medicines: payload.medicines || [],
    notes: payload.notes || '',
    consultationFee,
    medicineCost,
    totalCost: resolvedTotalCost,
    followUpDate: payload.followUpDate || null,
    createdBy: doctorId,
    status: 'finalized',
    rawTranscript: payload.rawTranscript || '',
    audioUrl: payload.audioUrl || '',
  });

  // Debug logging to help trace prescription creation path from appointments
  try {
    console.debug('Auto-created prescription from appointment:', {
      appointmentId: appointment._id?.toString(),
      prescriptionId: prescription._id?.toString(),
      doctorIdProvided: doctorId?.toString(),
      prescriptionDoctorId: prescription.doctorId?.toString(),
    });
  } catch (e) {
    console.warn(
      'Failed to log auto-created prescription debug info',
      e?.message || e,
    );
  }

  appointment.prescriptionId = prescription._id;
  await appointment.save();

  if (resolvedTotalCost > 0) {
    await updateRevenue(
      doctorId,
      resolvedTotalCost,
      doctor?.clinicId || appointment.clinicId,
      appointment.patientId,
      {
        source: 'appointment_completed',
        appointmentId: appointment._id,
        prescriptionId: prescription._id,
        consultationFee,
        medicineCost,
        occurredAt: appointment.completedAt || new Date(),
      },
    );
  }

  const io = req.app.get('io');
  const clinic =
    doctor?.clinicId || appointment.clinicId
      ? await Clinic.findById(doctor?.clinicId || appointment.clinicId).select(
          'adminId',
        )
      : null;

  await createNotification(io, {
    recipient: appointment.patientId,
    title: 'New Prescription Available',
    message: `Dr. ${doctorFullName} created a prescription for you`,
    type: 'success',
    link: '/dashboard/patient/records',
    portal: 'patient',
  });

  await createNotification(io, {
    recipient: doctorId,
    title: 'Prescription Created',
    message: `You created a prescription for patient "${patientFullName}"`,
    type: 'success',
    link: '/dashboard/doctor/prescriptions',
    portal: 'doctor',
  });

  if (resolvedTotalCost > 0) {
    const doctorShare = resolvedTotalCost * 0.8;
    const clinicShare = resolvedTotalCost * 0.2;

    await createNotification(io, {
      recipient: doctorId,
      title: 'Revenue Earned',
      message: `Appointment with ${patientFullName} completed. You earned PKR ${doctorShare.toFixed(2)} (80% share).`,
      type: 'success',
      link: '/dashboard/doctor/appointments',
      portal: 'doctor',
    });

    if (clinic?.adminId) {
      await createNotification(io, {
        recipient: clinic.adminId,
        title: 'Clinic Revenue Earned',
        message: `Appointment between Dr. ${doctorFullName} and ${patientFullName} completed. Clinic earned PKR ${clinicShare.toFixed(2)} (20% share).`,
        type: 'success',
        link: '/dashboard/clinic_admin/appointments',
        portal: 'clinic_admin',
      });
    }
  }

  if (clinic?.adminId) {
    await createNotification(io, {
      recipient: clinic.adminId,
      title: 'Prescription Created',
      message: `Dr. ${doctorFullName} created a prescription for patient "${patientFullName}"`,
      type: 'success',
      link: '/dashboard/clinic_admin/appointments',
      portal: 'clinic_admin',
    });
  }

  return prescription;
};

/**
 * @desc    Create a new appointment
 * @route   POST /api/doctor/appointments
 * @access  Private (Doctor only)
 */
exports.createAppointment = asyncHandler(async (req, res) => {
  const { patientId, dateTime, duration, type, reason, notes } = req.body;
  const doctorId = req.user._id;

  // Validate required fields
  if (!patientId || !dateTime) {
    throw new ApiError(400, 'Patient and date/time are required');
  }

  // Get doctor's clinic
  const doctor = await Doctor.findOne({ userId: doctorId });
  if (!doctor) {
    throw new ApiError(404, 'Doctor profile not found');
  }

  // Verify patient exists
  const patient = await User.findById(patientId);
  if (!patient || !patient.roles.includes('patient')) {
    throw new ApiError(404, 'Patient not found');
  }

  // Check for scheduling conflicts
  const appointmentDate = new Date(dateTime);
  const appointmentEndTime = new Date(
    appointmentDate.getTime() + (duration || 15) * 60000,
  );

  const conflictingAppointment = await Appointment.findOne({
    doctorId,
    status: { $in: ['pending', 'confirmed', 'in-progress'] },
    $or: [
      {
        dateTime: {
          $gte: appointmentDate,
          $lt: appointmentEndTime,
        },
      },
      {
        $and: [
          { dateTime: { $lte: appointmentDate } },
          {
            $expr: {
              $gte: [
                { $add: ['$dateTime', { $multiply: ['$duration', 60000] }] },
                appointmentDate,
              ],
            },
          },
        ],
      },
    ],
  });

  if (conflictingAppointment) {
    throw new ApiError(409, 'Time slot is already booked');
  }

  // Create appointment
  const appointment = await Appointment.create({
    doctorId,
    patientId,
    clinicId: doctor.clinicId || null,
    dateTime: appointmentDate,
    duration: duration || 15,
    type: type || 'consultation',
    reason: reason || 'General consultation',
    notes,
    status: 'confirmed',
  });

  const populatedAppointment = await Appointment.findById(appointment._id)
    .populate('patientId', 'name email phone photo')
    .populate('clinicId', 'name address');

  res
    .status(201)
    .json(
      new ApiResponse(
        201,
        populatedAppointment,
        'Appointment created successfully',
      ),
    );
});

/**
 * @desc    Get all appointments for the logged-in doctor
 * @route   GET /api/doctor/appointments
 * @access  Private (Doctor only)
 */
exports.getAppointments = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status, date, upcoming } = req.query;
  const doctorId = req.user._id;

  const filter = { doctorId };

  if (status) filter.status = status;

  if (date) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    filter.dateTime = { $gte: startOfDay, $lte: endOfDay };
  } else if (upcoming === 'true') {
    filter.dateTime = { $gte: new Date() };
    filter.status = { $in: ['pending', 'confirmed'] };
  }

  const appointments = await Appointment.find(filter)
    .populate('patientId', 'name email phone photo')
    .populate('clinicId', 'name address')
    .sort({ dateTime: -1 })
    .limit(parseInt(limit))
    .skip((parseInt(page) - 1) * parseInt(limit));

  const total = await Appointment.countDocuments(filter);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        appointments,
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / parseInt(limit)),
        },
      },
      'Appointments fetched successfully',
    ),
  );
});

/**
 * @desc    Get today's appointment queue
 * @route   GET /api/doctor/appointments/today
 * @access  Private (Doctor only)
 */
exports.getTodayQueue = asyncHandler(async (req, res) => {
  const doctorId = req.user._id;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const endOfDay = new Date(today);
  endOfDay.setHours(23, 59, 59, 999);

  const appointments = await Appointment.find({
    doctorId,
    dateTime: { $gte: today, $lte: endOfDay },
  })
    .populate('patientId', 'name email phone photo')
    .populate('clinicId', 'name')
    .sort({ dateTime: -1 });

  const stats = {
    total: appointments.length,
    pending: appointments.filter((a) => a.status === 'pending').length,
    confirmed: appointments.filter((a) => a.status === 'confirmed').length,
    inProgress: appointments.filter((a) => a.status === 'in-progress').length,
    completed: appointments.filter((a) => a.status === 'completed').length,
    cancelled: appointments.filter((a) => a.status === 'cancelled').length,
  };

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { appointments, stats },
        "Today's queue fetched successfully",
      ),
    );
});

/**
 * @desc    Get a single appointment by ID
 * @route   GET /api/doctor/appointments/:id
 * @access  Private (Doctor only)
 */
exports.getAppointmentById = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id)
    .populate('patientId', 'name email phone photo')
    .populate('doctorId', 'name email photo')
    .populate('clinicId', 'name address phone');

  if (!appointment) {
    throw new ApiError(404, 'Appointment not found');
  }

  // Verify doctor owns this appointment
  if (appointment.doctorId._id.toString() !== req.user._id.toString()) {
    throw new ApiError(
      403,
      'You do not have permission to view this appointment',
    );
  }

  // Get doctor profile for specialization
  const doctorProfile = await Doctor.findOne({
    userId: appointment.doctorId._id,
  });

  // Get patient profile for blood group and contact
  const Patient = require('../../models/Patient');
  const patientProfile = await Patient.findOne({
    userId: appointment.patientId._id,
  });

  // Get prescription if any
  const Prescription = require('../../models/Prescription');
  const prescription = await Prescription.findOne({
    appointmentId: appointment._id,
  });

  const doctorFee = doctorProfile?.consultationFee || 0;
  const prescriptionFee = prescription
    ? prescription.consultationFee || doctorFee
    : doctorFee;
  const prescriptionMedCost = prescription ? prescription.medicineCost || 0 : 0;
  const prescriptionTotal = prescription
    ? prescription.totalCost || prescriptionFee + prescriptionMedCost
    : doctorFee;

  const result = {
    ...appointment.toObject(),
    totalFee: prescriptionTotal,
    clinicRevenue: prescriptionTotal * 0.2,
    patient: {
      name: appointment.patientId?.name,
      email: appointment.patientId?.email,
      photo: appointment.patientId?.photo,
      contact: patientProfile?.contact || appointment.patientId?.phone,
      bloodGroup: patientProfile?.bloodGroup,
    },
    doctor: {
      name: appointment.doctorId?.name,
      photo: appointment.doctorId?.photo,
      specialization: doctorProfile?.specialization,
      consultationFee: doctorFee,
    },
    prescription: prescription
      ? {
          _id: prescription._id,
          diagnosis: prescription.diagnosis,
          medicines: prescription.medicines,
          consultationFee: prescription.consultationFee || doctorFee,
          medicineCost: prescription.medicineCost || 0,
          totalCost: prescription.totalCost || prescriptionTotal,
          notes: prescription.notes,
          followUpDate: prescription.followUpDate,
        }
      : {
          consultationFee: doctorFee,
          medicineCost: 0,
          totalCost: doctorFee,
        },
  };

  res
    .status(200)
    .json(new ApiResponse(200, result, 'Appointment fetched successfully'));
});

/**
 * @desc    Update appointment status (accept/reject/complete)
 * @route   PUT /api/doctor/appointments/:id
 * @access  Private (Doctor only)
 */
exports.updateAppointmentStatus = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id);

  if (!appointment) {
    throw new ApiError(404, 'Appointment not found');
  }

  // Verify doctor owns this appointment
  if (appointment.doctorId.toString() !== req.user._id.toString()) {
    throw new ApiError(
      403,
      'You do not have permission to update this appointment',
    );
  }

  const { status, notes, cancellationReason } = req.body;

  if (status) {
    appointment.status = status;

    if (status === 'cancelled') {
      appointment.cancelledBy = req.user._id;
      appointment.cancelledAt = new Date();
      if (cancellationReason) {
        appointment.cancellationReason = cancellationReason;
      }
    }

    if (status === 'completed') {
      appointment.completedAt = new Date();
    }
  }

  if (notes !== undefined) {
    appointment.notes = notes;
  }

  await appointment.save();

  if (appointment.status === 'completed') {
    await createPrescriptionForCompletedAppointment({
      appointment,
      doctorId: req.user._id,
      prescriptionData: req.body,
      req,
    });
  }

  const updatedAppointment = await Appointment.findById(appointment._id)
    .populate('patientId', 'name email phone')
    .populate('clinicId', 'name');

  // Send notification to patient when doctor updates status (approved/confirmed/cancelled/completed)
  try {
    const io = req.app.get('io');
    const patientId =
      updatedAppointment.patientId?._id || updatedAppointment.patientId;
    const doctorUser = await User.findById(req.user._id);
    const doctorName = doctorUser?.name || 'Doctor';
    const apptDate = new Date(updatedAppointment.dateTime);
    const formattedDate = apptDate.toLocaleString('en-US', {
      dateStyle: 'full',
      timeStyle: 'short',
    });

    let title = 'Appointment Update';
    let message = `${doctorName} updated your appointment status to ${updatedAppointment.status}.`;
    if (['confirmed', 'accepted'].includes(updatedAppointment.status)) {
      title = 'Appointment Confirmed';
      message = `Your appointment with ${doctorName} is ${updatedAppointment.status} for ${formattedDate}.`;
    } else if (updatedAppointment.status === 'cancelled') {
      title = 'Appointment Cancelled';
      message = `Your appointment with ${doctorName} on ${formattedDate} has been cancelled.`;
    } else if (updatedAppointment.status === 'completed') {
      title = 'Appointment Completed';
      message = `Your appointment with ${doctorName} on ${formattedDate} is marked completed.`;
    }

    if (patientId) {
      await createNotification(io, {
        recipient: patientId,
        title,
        message,
        type: 'info',
        link: '/dashboard/patient/appointments',
        portal: 'patient',
      });
    }
  } catch (e) {
    console.error(
      'Failed to send appointment update notification to patient',
      e,
    );
  }

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedAppointment,
        'Appointment updated successfully',
      ),
    );
});

/**
 * @desc    Start an appointment (mark as in-progress)
 * @route   PUT /api/doctor/appointments/:id/start
 * @access  Private (Doctor only)
 */
exports.startAppointment = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id);

  if (!appointment) {
    throw new ApiError(404, 'Appointment not found');
  }

  if (appointment.doctorId.toString() !== req.user._id.toString()) {
    throw new ApiError(
      403,
      'You do not have permission to start this appointment',
    );
  }

  if (appointment.status !== 'pending' && appointment.status !== 'confirmed') {
    throw new ApiError(
      400,
      'Appointment cannot be started from current status',
    );
  }

  appointment.status = 'in-progress';
  await appointment.save();

  const updatedAppointment = await Appointment.findById(appointment._id)
    .populate('patientId', 'name email phone')
    .populate('clinicId', 'name');

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedAppointment,
        'Appointment started successfully',
      ),
    );
});

/**
 * @desc    Complete an appointment
 * @route   PUT /api/doctor/appointments/:id/complete
 * @access  Private (Doctor only)
 */
exports.completeAppointment = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id);

  if (!appointment) {
    throw new ApiError(404, 'Appointment not found');
  }

  if (appointment.doctorId.toString() !== req.user._id.toString()) {
    throw new ApiError(
      403,
      'You do not have permission to complete this appointment',
    );
  }

  appointment.status = 'completed';
  appointment.completedAt = new Date();

  if (req.body.notes) {
    appointment.notes = req.body.notes;
  }

  await appointment.save();

  await createPrescriptionForCompletedAppointment({
    appointment,
    doctorId: req.user._id,
    prescriptionData: req.body,
    req,
  });

  const updatedAppointment = await Appointment.findById(appointment._id)
    .populate('patientId', 'name email phone')
    .populate('clinicId', 'name');

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedAppointment,
        'Appointment completed successfully',
      ),
    );
});

/**
 * @desc    Delete an appointment
 * @route   DELETE /api/doctor/appointments/:id
 * @access  Private (Doctor only)
 */
exports.deleteAppointment = asyncHandler(async (req, res) => {
  const doctorId = req.user._id;
  const { id } = req.params;

  const appointment = await Appointment.findOne({ _id: id, doctorId });
  if (!appointment) {
    throw new ApiError(404, 'Appointment not found');
  }

  await Appointment.findByIdAndDelete(id);

  res
    .status(200)
    .json(new ApiResponse(200, null, 'Appointment deleted successfully'));
});
