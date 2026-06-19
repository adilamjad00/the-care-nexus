const Clinic = require('../../models/Clinic');
const Doctor = require('../../models/Doctor');
const User = require('../../models/User');
const Appointment = require('../../models/Appointment');
const asyncHandler = require('../../utils/asyncHandler');
const ApiError = require('../../utils/ApiError');
const ApiResponse = require('../../utils/ApiResponse');

exports.getDoctors = asyncHandler(async (req, res) => {
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 100);

  const userClinic = await Clinic.findOne({ adminId: req.user._id }).populate({
    path: 'doctors',
    populate: {
      path: 'userId',
      select: 'name email photo phone',
    },
  });

  if (!userClinic) {
    throw new ApiError(404, 'Clinic not found for this user');
  }

  const total = userClinic.doctors.length;
  const start = (page - 1) * limit;
  const doctors = userClinic.doctors.slice(start, start + limit);

  res.status(200).json(
    new ApiResponse(200, {
      doctors,
      pagination: {
        total,
        page,
        pages: Math.max(Math.ceil(total / limit), 1),
        limit,
      },
    }),
  );
});

exports.addDoctor = asyncHandler(async (req, res) => {
  const userClinic = await Clinic.findOne({ adminId: req.user._id });
  const { email, specialization, photo } = req.body;

  if (!userClinic) {
    throw new ApiError(404, 'Clinic not found for this user');
  }

  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user) {
    throw new ApiError(404, 'No doctor account found with this email');
  }

  if (!user.roles.includes('doctor')) {
    throw new ApiError(400, 'User is not registered as a doctor');
  }

  const doctor = await Doctor.findOne({ userId: user._id });

  if (!doctor) {
    throw new ApiError(404, 'Doctor profile not found');
  }

  const clinic = userClinic;

  if (clinic.doctors.includes(doctor._id)) {
    throw new ApiError(400, 'Doctor already added to this clinic');
  }

  if (specialization && specialization !== doctor.specialization) {
    doctor.specialization = specialization;
  }

  doctor.clinicId = clinic._id;
  await doctor.save();

  clinic.doctors.push(doctor._id);
  await clinic.save();

  if (photo) {
    user.photo = photo;
    await user.save();
  }

  const { sendEmail } = require('../../services/emailService');
  try {
    sendEmail(
      user.email,
      "You've Been Added to " + clinic.name,
      'doctorAddedToClinic',
      {
        doctorName: user.name,
        clinicName: clinic.name,
      },
    );
  } catch (e) {}

  res
    .status(200)
    .json(new ApiResponse(200, { doctor }, 'Doctor added to clinic'));
});

exports.searchDoctorByEmail = asyncHandler(async (req, res) => {
  const { email } = req.query;

  if (!email || typeof email !== 'string' || email.trim().length < 3) {
    return res
      .status(200)
      .json(new ApiResponse(200, [], 'Invalid search query'));
  }

  // Search for users with email matching the query
  const users = await User.find({
    email: { $regex: email, $options: 'i' },
    roles: 'doctor',
  })
    .select('name email photo')
    .limit(10);

  // Get corresponding doctor profiles
  const doctorResults = [];
  for (const user of users) {
    const doctor = await Doctor.findOne({ userId: user._id }).select(
      'specialization userId',
    );
    if (doctor) {
      doctorResults.push({
        _id: doctor._id,
        userId: doctor.userId._id,
        email: user.email,
        fullName: user.name,
        name: user.name,
        specialization: doctor.specialization || 'General',
        photo: user.photo,
      });
    }
  }

  res.status(200).json(new ApiResponse(200, doctorResults, 'Doctors found'));
});

exports.removeDoctor = asyncHandler(async (req, res) => {
  const userClinic = await Clinic.findOne({ adminId: req.user._id });
  const { id } = req.params;

  if (!userClinic) {
    throw new ApiError(404, 'Clinic not found for this user');
  }

  const clinic = userClinic;

  clinic.doctors = clinic.doctors.filter(
    (doctorId) => doctorId.toString() !== id,
  );
  await clinic.save();

  const doctor = await Doctor.findById(id);
  if (doctor) {
    doctor.clinicId = null;
    await doctor.save();
  }

  res.status(200).json(new ApiResponse(200, null, 'Doctor removed'));
});

exports.getDoctorStats = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userClinic = await Clinic.findOne({ adminId: req.user._id });

  if (!userClinic) {
    throw new ApiError(404, 'Clinic not found for this user');
  }

  // Try finding by Doctor ID first, then by User ID
  let doctor = await Doctor.findById(id);
  if (!doctor) {
    doctor = await Doctor.findOne({ userId: id });
  }

  if (!doctor) {
    throw new ApiError(404, `Doctor not found with ID: ${id}`);
  }

  const completedAppointments = await Appointment.countDocuments({
    doctorId: doctor.userId,
    status: 'completed',
  });

  const appointments = await Appointment.find({
    doctorId: doctor.userId,
    status: 'completed',
  }).select('duration patientFeedback');

  let avgVisitTime = 0;
  if (appointments.length > 0) {
    const totalDuration = appointments.reduce(
      (sum, app) => sum + Math.min(Number(app.duration || 15), 15),
      0,
    );
    avgVisitTime = Math.round(totalDuration / appointments.length);
  }

  // Calculate patient satisfaction based on ratings
  let patientSatisfaction = 0;
  const ratedAppointments = appointments.filter(
    (app) => app.patientFeedback?.score,
  );
  if (ratedAppointments.length > 0) {
    const totalScore = ratedAppointments.reduce(
      (sum, app) => sum + (app.patientFeedback.score || 0),
      0,
    );
    const averageScore = totalScore / ratedAppointments.length; // Average out of 5
    patientSatisfaction = Math.round((averageScore / 5) * 100); // Convert to percentage out of 100
  }

  res.status(200).json(
    new ApiResponse(200, {
      appointmentsCompleted: completedAppointments,
      avgVisitTime,
      patientSatisfaction: patientSatisfaction,
      totalRevenue: doctor.revenue?.total || 0,
    }),
  );
});
