const Appointment = require('../../models/Appointment');
const Patient = require('../../models/Patient');
const Doctor = require('../../models/Doctor');
const Clinic = require('../../models/Clinic');
const User = require('../../models/User');
const asyncHandler = require('../../utils/asyncHandler');
const ApiError = require('../../utils/ApiError');
const ApiResponse = require('../../utils/ApiResponse');
const { createNotification } = require('../../utils/notification');
const { sendEmail } = require('../../services/emailService');
/**
 * @route GET /api/patient/appointments?view=upcoming|past|all
 * @access Private (Patient only)
 */
exports.getAppointments = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { view = 'all' } = req.query;

  const now = new Date();
  let match = { patientId: userId };

  if (view === 'upcoming') {
    match.dateTime = { $gte: now };
    match.status = { $nin: ['cancelled', 'completed'] };
  } else if (view === 'past') {
    match.dateTime = { $lt: now };
  }

  const appointments = await Appointment.aggregate([
    { $match: match },
    {
      $lookup: {
        from: 'reviews',
        localField: '_id',
        foreignField: 'appointmentId',
        as: 'review',
      },
    },
    {
      $addFields: {
        reviewId: { $arrayElemAt: ['$review._id', 0] },
        reviewEditCount: {
          $ifNull: [{ $arrayElemAt: ['$review.editCount', 0] }, 0],
        },
      },
    },
    { $project: { review: 0 } },
    { $sort: { dateTime: -1 } },
  ]);

  // Populate clinic and prescription
  const populated = await Appointment.populate(appointments, [
    { path: 'clinicId', select: 'name address phone' },
    { path: 'prescriptionId' },
  ]);

  // Collect all doctorId values (may be ObjectIds from old or new appointments)
  const allDoctorIds = [
    ...new Set(populated.map((a) => a?.doctorId?.toString()).filter(Boolean)),
  ];

  // Fetch User + Doctor profiles in parallel for ALL doctorIds
  const [doctorUsers, doctorProfiles] = await Promise.all([
    User.find({ _id: { $in: allDoctorIds } }).select('name email photo'),
    Doctor.find({ userId: { $in: allDoctorIds } }).select(
      'userId fullName specialization location consultationFee averageRating',
    ),
  ]);

  const userById = new Map(doctorUsers.map((u) => [u._id.toString(), u]));
  const profileByUserId = new Map(
    doctorProfiles.map((d) => [d.userId?.toString(), d]),
  );

  const withDoctorInfo = populated.map((a) => {
    const dId = a?.doctorId?.toString();
    const userDoc = dId ? userById.get(dId) : null;
    const profileDoc = dId ? profileByUserId.get(dId) : null;

    return {
      ...a,
      doctorId: userDoc
        ? {
            _id: userDoc._id,
            name: userDoc.name,
            email: userDoc.email,
            photo: userDoc.photo,
            doctorProfile: profileDoc
              ? {
                  specialization: profileDoc.specialization,
                  fullName: profileDoc.fullName,
                }
              : null,
          }
        : a.doctorId, // keep as-is (ObjectId) if user not found
      clinicCity: (() => {
        const addr = a?.clinicId?.address || '';
        const parts =
          typeof addr === 'string'
            ? addr
                .split(',')
                .map((p) => p.trim())
                .filter(Boolean)
            : [];
        return (
          profileDoc?.location?.city ||
          (parts.length > 1 ? parts[parts.length - 1] : '') ||
          null
        );
      })(),
    };
  });

  res
    .status(200)
    .json(
      new ApiResponse(200, withDoctorInfo, 'Appointments fetched successfully'),
    );
});

/**
 * @route POST /api/patient/appointments
 * @access Private (Patient only)
 */
exports.bookAppointment = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { doctorId, clinicId, appointmentDate, appointmentTime, reason } =
    req.body;

  let patient = await Patient.findOne({ userId });
  if (!patient) {
    const user = await User.findById(userId);
    if (user && user.roles.includes('patient')) {
      patient = await Patient.create({
        userId: user._id,
        name: user.name,
      });
    } else {
      throw new ApiError(404, 'Patient profile not found');
    }
  }

  let doctor = await Doctor.findById(doctorId);
  let doctorUserId;

  if (doctor) {
    doctorUserId = doctor.userId;
  } else {
    doctor = await Doctor.findOne({ userId: doctorId });
    if (!doctor) throw new ApiError(404, 'Doctor not found');
    doctorUserId = doctorId;
  }

  function parseDateTime(dateStr, timeStr) {
    if (!timeStr || !dateStr) return new Date(NaN);
    let hours = 0,
      minutes = 0;
    const m12 = timeStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    const m24 = timeStr.match(/^(\d{1,2}):(\d{2})$/);
    if (m12) {
      hours = parseInt(m12[1], 10);
      minutes = parseInt(m12[2], 10);
      if (m12[3].toUpperCase() === 'PM' && hours < 12) hours += 12;
      if (m12[3].toUpperCase() === 'AM' && hours === 12) hours = 0;
    } else if (m24) {
      hours = parseInt(m24[1], 10);
      minutes = parseInt(m24[2], 10);
    } else {
      return new Date(NaN);
    }
    // Treat the entered time as PKT (UTC+5) so stored UTC matches what user selected
    const hh = String(hours).padStart(2, '0');
    const mm = String(minutes).padStart(2, '0');
    return new Date(`${dateStr}T${hh}:${mm}:00+05:00`);
  }

  const dateTime = parseDateTime(appointmentDate, appointmentTime);
  if (isNaN(dateTime.getTime())) {
    throw new ApiError(400, 'Invalid appointment date or time format');
  }

  const slotStart = new Date(dateTime.getTime() - 15 * 60000);
  const slotEnd = new Date(dateTime.getTime() + 15 * 60000);
  const tenMinsAgo = new Date(Date.now() - 10 * 60000);

  const existingAppointment = await Appointment.findOne({
    doctorId: doctorUserId,
    dateTime: { $gte: slotStart, $lte: slotEnd },
    $or: [
      { status: { $nin: ['cancelled', 'reserved'] } },
      { status: 'reserved', createdAt: { $gte: tenMinsAgo } },
    ],
  });

  if (
    existingAppointment &&
    existingAppointment.patientId.toString() !== patient.userId.toString()
  ) {
    throw new ApiError(
      409,
      'This slot is no longer available. Please choose another.',
    );
  }

  let appointment = await Appointment.findOne({
    patientId: patient.userId,
    doctorId: doctorUserId,
    dateTime: { $gte: slotStart, $lte: slotEnd },
    status: 'reserved',
  });

  if (appointment) {
    appointment.status = 'pending';
    appointment.clinicId = clinicId || doctor.clinicId || null;
    appointment.reason = reason || 'Not Mentioned';
    await appointment.save();
  } else {
    appointment = await Appointment.create({
      patientId: patient.userId,
      doctorId: doctorUserId,
      clinicId: clinicId || doctor.clinicId || null,
      dateTime,
      reason: reason || 'Not Mentioned',
      status: 'pending',
      type: 'consultation',
    });
  }

  const populatedAppointment = await Appointment.findById(appointment._id)
    .populate({
      path: 'doctorId',
      select: 'name email photo',
      populate: { path: 'doctorProfile', select: 'specialization fullName' },
    })
    .populate('clinicId', 'name address phone');

  // Emails
  try {
    const formattedDate = new Date(dateTime).toLocaleString('en-US', {
      dateStyle: 'full',
      timeStyle: 'short',
    });
    const doctorUser = await User.findById(doctorUserId);

    sendEmail(
      req.user.email,
      `Appointment Confirmed — ${formattedDate}`,
      'appointmentConfirmed',
      {
        patientName: req.user.name,
        doctorName: doctor.fullName || doctorUser?.name || 'Doctor',
        dateTime: formattedDate,
        location:
          (populatedAppointment.clinicId?.name || 'Private Clinic') +
          ', ' +
          (populatedAppointment.clinicId?.address || ''),
        type: appointment.type,
      },
    );

    if (doctorUser) {
      sendEmail(
        doctorUser.email,
        `Appointment Booked — ${req.user.name}`,
        'doctorAppointmentNotice',
        {
          doctorName: doctorUser.name,
          patientName: req.user.name,
          dateTime: formattedDate,
          reason: appointment.reason,
        },
      );
    }
  } catch (e) {}

  // Notify Doctor
  const io = req.app.get('io');
  await createNotification(io, {
    recipient: doctorUserId,
    title: 'New Appointment Request',
    message: `${req.user.name} has booked a consultation for ${appointmentDate} at ${appointmentTime}.`,
    type: 'info',
    link: '/dashboard/doctor/appointments',
    portal: 'doctor',
  });

  const effectiveClinicId = clinicId || doctor.clinicId;
  if (effectiveClinicId) {
    const clinic = await Clinic.findById(effectiveClinicId);
    if (clinic && clinic.adminId) {
      const apptDate = new Date(dateTime);
      const formattedDate = apptDate.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
      });
      await createNotification(io, {
        recipient: clinic.adminId,
        title: 'New Booking at Clinic',
        message: `A new appointment with Dr. ${doctor.fullName || 'Member'} has been scheduled by ${req.user.name} on ${formattedDate} at ${appointmentTime}.`,
        type: 'info',
        link: '/dashboard/clinic_admin/appointments',
        portal: 'clinic_admin',
      });
    }
  }

  res
    .status(201)
    .json(
      new ApiResponse(
        201,
        populatedAppointment,
        'Appointment booked successfully',
      ),
    );
});

/**
 * @route PUT /api/patient/appointments/:id/cancel
 * @access Private (Patient only)
 */
exports.cancelAppointment = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { id } = req.params;

  const appointment = await Appointment.findOne({
    _id: id,
    patientId: userId,
  }).populate('doctorId', 'name email');
  if (!appointment) throw new ApiError(404, 'Appointment not found');

  if (appointment.status !== 'pending') {
    throw new ApiError(400, 'Only pending appointments can be cancelled');
  }

  appointment.status = 'cancelled';
  await appointment.save();

  const populatedAppointment = await Appointment.findById(appointment._id)
    .populate({
      path: 'doctorId',
      select: 'name email photo',
      populate: { path: 'doctorProfile', select: 'specialization fullName' },
    })
    .populate('clinicId', 'name address phone');

  // Email: Appointment Cancelled by Patient
  try {
    if (appointment.doctorId && appointment.doctorId.email) {
      sendEmail(
        appointment.doctorId.email,
        'Appointment Cancelled by Patient',
        'appointmentCancelledByPatient',
        {
          doctorName: appointment.doctorId.name,
          patientName: req.user.name,
          dateTime: new Date(appointment.dateTime).toLocaleString(),
        },
      );
    }
  } catch (e) {}

  const io = req.app.get('io');
  await createNotification(io, {
    recipient: appointment.doctorId._id,
    title: 'Appointment Cancelled',
    message: `${req.user.name} has cancelled their appointment for ${new Date(appointment.dateTime).toLocaleDateString()}.`,
    type: 'warning',
    link: '/dashboard/doctor/appointments',
    portal: 'doctor',
  });

  if (appointment.clinicId) {
    const clinic = await Clinic.findById(appointment.clinicId);
    if (clinic && clinic.adminId) {
      await createNotification(io, {
        recipient: clinic.adminId,
        title: 'Appointment Cancelled',
        message: `An appointment for ${req.user.name} at your clinic has been cancelled.`,
        type: 'warning',
        link: '/dashboard/clinic_admin/appointments',
        portal: 'clinic_admin',
      });
    }
  }

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        populatedAppointment,
        'Appointment cancelled successfully',
      ),
    );
});

/**
 * @desc    Rate an appointment
 * @route   PUT /api/patient/appointments/:id/rate
 */
exports.rateAppointment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { score, comment } = req.body;

  if (!score || score < 1 || score > 5) {
    throw new ApiError(400, 'Score must be between 1 and 5');
  }

  const appointment = await Appointment.findById(id);
  if (!appointment) throw new ApiError(404, 'Appointment not found');

  if (appointment.status !== 'completed') {
    throw new ApiError(400, 'You can only rate completed appointments');
  }

  appointment.patientFeedback = {
    score,
    comment,
    ratedAt: new Date(),
  };

  await appointment.save();

  res
    .status(200)
    .json(new ApiResponse(200, appointment, 'Rating submitted successfully'));
});

/**
 * Get all clinics for booking flow
 * @route GET /api/patient/clinics
 * @access Private (Patient only)
 */
exports.getClinics = asyncHandler(async (req, res) => {
  const clinics = await Clinic.find({}).populate({
    path: 'doctors',
    select: 'userId specialization fullName schedule',
    populate: {
      path: 'userId',
      select: 'name email photo',
    },
  });

  res
    .status(200)
    .json(new ApiResponse(200, clinics, 'Clinics fetched successfully'));
});

/**
 * Get all doctors across all clinics for discovery
 * @route GET /api/patient/doctors
 * @access Private (Patient only)
 */
exports.getDoctors = asyncHandler(async (req, res) => {
  const doctors = await Doctor.find({})
    .populate({
      path: 'userId',
      select: 'name email photo',
    })
    .populate('clinicId', 'name address');

  const allDoctors = await Promise.all(
    doctors.map(async (doc) => {
      const appointmentCount = await Appointment.countDocuments({
        doctorId: doc.userId?._id,
        status: 'completed',
      });

      const ratings = await Appointment.find({
        doctorId: doc.userId?._id,
        status: 'completed',
        'patientFeedback.score': { $exists: true },
      }).select('patientFeedback.score');

      let avgRating = 4.8;
      if (ratings.length > 0) {
        const sum = ratings.reduce(
          (acc, curr) => acc + curr.patientFeedback.score,
          0,
        );
        avgRating = (sum / ratings.length).toFixed(1);
      }

      return {
        _id: doc._id,
        userId: doc.userId?._id,
        name: doc.fullName || doc.userId?.name || 'Doctor',
        email: doc.userId?.email,
        photo: doc.userId?.photo,
        specialization: doc.specialization,
        clinicId: doc.clinicId
          ? {
              _id: doc.clinicId._id,
              name: doc.clinicId.name,
              address: doc.clinicId.address,
            }
          : {
              _id: null,
              name: 'Private Practice',
              address:
                doc.location?.address || doc.location?.city || 'Pakistan',
            },
        location: doc.location,
        appointmentsCount: appointmentCount,
        rating: parseFloat(avgRating),
      };
    }),
  );

  res
    .status(200)
    .json(new ApiResponse(200, allDoctors, 'Doctors fetched successfully'));
});

/**
 * @route GET /api/patient/appointments/available-slots
 * @access Private (Patient only)
 */
exports.getAvailableSlots = asyncHandler(async (req, res) => {
  const { doctorId, date } = req.query;

  if (!doctorId || !date) {
    throw new ApiError(400, 'Doctor ID and date are required');
  }

  let doctor = await Doctor.findById(doctorId);
  let doctorUserId = doctor ? doctor.userId : doctorId;

  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const tenMinsAgo = new Date(Date.now() - 10 * 60000);

  const bookedAppointments = await Appointment.find({
    doctorId: doctorUserId,
    dateTime: { $gte: startOfDay, $lte: endOfDay },
    $or: [
      { status: { $nin: ['cancelled', 'reserved'] } },
      { status: 'reserved', createdAt: { $gte: tenMinsAgo } },
    ],
  }).select('dateTime status patientId');

  const bookedSlotStrings = bookedAppointments.map((app) => {
    const d = new Date(app.dateTime);
    return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
  });

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { bookedSlots: bookedSlotStrings },
        'Available slots fetched',
      ),
    );
});

/**
 * @route POST /api/patient/appointments/reserve-slot
 * @access Private (Patient only)
 */
exports.reserveSlot = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { doctorId, appointmentDate, appointmentTime } = req.body;

  let patient = await Patient.findOne({ userId });
  if (!patient) {
    const user = await User.findById(userId);
    if (!user) throw new ApiError(404, 'User not found');
    patient = await Patient.create({ userId: user._id, name: user.name });
  }

  let doctor = await Doctor.findById(doctorId);
  let doctorUserId = doctor ? doctor.userId : doctorId;

  function parseDateTime(dateStr, timeStr) {
    if (!timeStr || !dateStr) return new Date(NaN);
    let hours = 0,
      minutes = 0;
    const m12 = timeStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    const m24 = timeStr.match(/^(\d{1,2}):(\d{2})$/);
    if (m12) {
      hours = parseInt(m12[1], 10);
      minutes = parseInt(m12[2], 10);
      if (m12[3].toUpperCase() === 'PM' && hours < 12) hours += 12;
      if (m12[3].toUpperCase() === 'AM' && hours === 12) hours = 0;
    } else if (m24) {
      hours = parseInt(m24[1], 10);
      minutes = parseInt(m24[2], 10);
    } else {
      return new Date(NaN);
    }
    // Treat the entered time as PKT (UTC+5) so stored UTC matches what user selected
    const hh = String(hours).padStart(2, '0');
    const mm = String(minutes).padStart(2, '0');
    return new Date(`${dateStr}T${hh}:${mm}:00+05:00`);
  }

  const dateTime = parseDateTime(appointmentDate, appointmentTime);
  if (isNaN(dateTime.getTime())) {
    throw new ApiError(400, 'Invalid appointment date or time format');
  }
  const slotStart = new Date(dateTime.getTime() - 15 * 60000);
  const slotEnd = new Date(dateTime.getTime() + 15 * 60000);
  const tenMinsAgo = new Date(Date.now() - 10 * 60000);

  const existingAppointment = await Appointment.findOne({
    doctorId: doctorUserId,
    dateTime: { $gte: slotStart, $lte: slotEnd },
    $or: [
      { status: { $nin: ['cancelled', 'reserved'] } },
      { status: 'reserved', createdAt: { $gte: tenMinsAgo } },
    ],
  });

  if (
    existingAppointment &&
    existingAppointment.patientId.toString() !== patient.userId.toString()
  ) {
    throw new ApiError(
      409,
      'This slot is currently reserved or booked by someone else.',
    );
  }

  if (existingAppointment) {
    existingAppointment.createdAt = new Date();
    await existingAppointment.save();
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          existingAppointment,
          'Reservation extended for another 10 minutes',
        ),
      );
  }

  const reservation = await Appointment.create({
    patientId: patient.userId,
    doctorId: doctorUserId,
    clinicId: doctor?.clinicId || null,
    dateTime,
    reason: 'Not Mentioned',
    status: 'reserved',
    type: 'consultation',
  });

  res
    .status(201)
    .json(
      new ApiResponse(
        201,
        reservation,
        'Slot reserved successfully for 10 minutes',
      ),
    );
});

exports.deleteAppointment = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { id } = req.params;

  const appointment = await Appointment.findOne({ _id: id, patientId: userId });
  if (!appointment) {
    throw new ApiError(404, 'Appointment not found');
  }

  await Appointment.findByIdAndDelete(id);

  res
    .status(200)
    .json(new ApiResponse(200, null, 'Appointment deleted successfully'));
});
