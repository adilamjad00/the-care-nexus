const asyncHandler = require('../../utils/asyncHandler');
const ApiResponse = require('../../utils/ApiResponse');
const ApiError = require('../../utils/ApiError');
const Appointment = require('../../models/Appointment');
const Prescription = require('../../models/Prescription');
const Patient = require('../../models/Patient');
const Doctor = require('../../models/Doctor');
const Clinic = require('../../models/Clinic');
const User = require('../../models/User');

/**
 * Get patient dashboard statistics
 * @route GET /api/patient/dashboard
 * @access Private (Patient only)
 */
exports.getDashboard = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Find patient by userId - with a fallback creation if missing for some reason
  let patient = await Patient.findOne({ userId });
  if (!patient) {
    // If user exists and is a patient, recreate profile
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

  const now = new Date();

  // Current week: Mon 00:00 → Sun 23:59
  const startOfThisWeek = new Date(now);
  startOfThisWeek.setHours(0, 0, 0, 0);
  const dayOfWeek = startOfThisWeek.getDay();
  startOfThisWeek.setDate(
    startOfThisWeek.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1),
  );

  const endOfThisWeek = new Date(startOfThisWeek);
  endOfThisWeek.setDate(endOfThisWeek.getDate() + 6);
  endOfThisWeek.setHours(23, 59, 59, 999);

  // Last week: Mon → Sun
  const startOfLastWeek = new Date(startOfThisWeek);
  startOfLastWeek.setDate(startOfLastWeek.getDate() - 7);
  const endOfLastWeek = new Date(startOfThisWeek);
  endOfLastWeek.setMilliseconds(-1);

  // Current month: 1st → last day
  const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfThisMonth = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0,
    23,
    59,
    59,
  );

  // Last month
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfLastMonth = new Date(
    now.getFullYear(),
    now.getMonth(),
    0,
    23,
    59,
    59,
  );

  const countAppointmentsInRange = async (start, end) => {
    return Appointment.countDocuments({
      patientId: userId,
      status: { $ne: 'cancelled' },
      dateTime: { $gte: start, $lte: end },
    });
  };

  // Appointments this week (full Mon–Sun, includes upcoming)
  const appointmentsThisWeek = await countAppointmentsInRange(
    startOfThisWeek,
    endOfThisWeek,
  );

  // Appointments last week
  const appointmentsLastWeek = await countAppointmentsInRange(
    startOfLastWeek,
    endOfLastWeek,
  );

  // Appointments this month (full month, includes upcoming)
  const appointmentsThisMonth = await countAppointmentsInRange(
    startOfThisMonth,
    endOfThisMonth,
  );

  // Appointments last month
  const appointmentsLastMonth = await countAppointmentsInRange(
    startOfLastMonth,
    endOfLastMonth,
  );

  // Total prescriptions
  const totalPrescriptions = await Prescription.countDocuments({
    patientId: userId,
  });

  // Doctors visited (unique)
  const prescriptions = await Prescription.find({ patientId: userId }).populate(
    {
      path: 'doctorId',
      select: 'name email photo',
      populate: {
        path: 'doctorProfile',
        select: 'specialization fullName clinicId',
        populate: { path: 'clinicId', select: 'name' },
      },
    },
  );

  const doctorsMap = new Map();
  prescriptions.forEach((prescription) => {
    if (prescription.doctorId && prescription.doctorId.doctorProfile) {
      const doc = prescription.doctorId;
      const profile = doc.doctorProfile;
      if (!doctorsMap.has(profile._id.toString())) {
        doctorsMap.set(profile._id.toString(), {
          _id: profile._id,
          name: profile.fullName || doc.name,
          specialization: profile.specialization || 'General Physician',
          clinicName: profile.clinicId
            ? profile.clinicId.name
            : 'Private Practice',
          photo: doc.photo || profile.photo,
        });
      }
    }
  });

  const doctorsVisited = Array.from(doctorsMap.values());

  // Recent prescriptions (last 3)
  const recentPrescriptions = await Prescription.find({ patientId: userId })
    .sort({ createdAt: -1 })
    .limit(3)
    .populate({
      path: 'doctorId',
      select: 'name email photo',
      populate: { path: 'doctorProfile', select: 'specialization fullName' },
    });

  // Calculate Total Spent from all completed appointments
  const allCompletedAppointments = await Appointment.find({
    patientId: userId,
    status: 'completed',
  });

  let totalSpentCalculated = 0;
  for (const app of allCompletedAppointments) {
    const prescription = await Prescription.findOne({
      appointmentId: app._id,
    }).select('consultationFee medicineCost totalCost');
    totalSpentCalculated +=
      Number(prescription?.totalCost || prescription?.consultationFee || 0) ||
      0;
  }

  // Upcoming appointments (next 3) - Only pending or confirmed
  const upcomingAppointments = await Appointment.find({
    patientId: userId,
    dateTime: { $gte: now },
    status: { $in: ['pending', 'confirmed'] },
  })
    .sort({ dateTime: -1 })
    .limit(3)
    .populate({
      path: 'doctorId',
      select: 'name email photo',
      populate: { path: 'doctorProfile', select: 'specialization fullName' },
    })
    .populate('clinicId', 'name address');

  // Upcoming Follow-ups (next 3)
  const upcomingFollowUps = await Prescription.find({
    patientId: userId,
    followUpDate: { $gte: now },
  })
    .sort({ followUpDate: -1 })
    .limit(3)
    .populate({
      path: 'doctorId',
      select: 'name email photo',
      populate: { path: 'doctorProfile', select: 'specialization fullName' },
    });

  // Spending Trend (Last 6 months - Newest First)
  const spendingTrend = [];
  for (let i = 0; i < 6; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const nextM = new Date(d.getFullYear(), d.getMonth() + 1, 1);
    const monthKey = d.toLocaleString('default', { month: 'short' });

    const monthAppointments = await Appointment.find({
      patientId: userId,
      status: 'completed',
      dateTime: { $gte: d, $lt: nextM },
    });

    let monthlySpent = 0;
    for (const app of monthAppointments) {
      const prescription = await Prescription.findOne({
        appointmentId: app._id,
      }).select('consultationFee medicineCost totalCost');
      monthlySpent +=
        Number(prescription?.totalCost || prescription?.consultationFee || 0) ||
        0;
    }

    spendingTrend.push({
      label: monthKey,
      spent: monthlySpent,
    });
  }

  res.status(200).json(
    new ApiResponse(
      200,
      {
        appointmentsThisWeek,
        appointmentsLastWeek,
        appointmentsThisMonth,
        appointmentsLastMonth,
        totalSpent: totalSpentCalculated,
        totalPrescriptions,
        doctorsVisited,
        recentPrescriptions,
        upcomingAppointments,
        upcomingFollowUps,
        spendingTrend,
      },
      'Dashboard data fetched successfully',
    ),
  );
});

exports.getSpentHistory = asyncHandler(async (req, res) => {
  const RevenueEntry = require('../../models/RevenueEntry');
  const { page = 1, limit = 20 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  const [entries, total] = await Promise.all([
    RevenueEntry.find({ patientUserId: req.user._id })
      .sort({ occurredAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .populate('doctorUserId', 'name email')
      .populate('clinicId', 'name')
      .lean(),
    RevenueEntry.countDocuments({ patientUserId: req.user._id }),
  ]);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        entries,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit)),
        },
      },
      'Spent history fetched successfully',
    ),
  );
});
