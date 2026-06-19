const Staff = require('../../models/Staff');
const User = require('../../models/User');
const Clinic = require('../../models/Clinic');
const bcrypt = require('bcryptjs');
const asyncHandler = require('../../utils/asyncHandler');
const ApiError = require('../../utils/ApiError');
const ApiResponse = require('../../utils/ApiResponse');

exports.getStaff = asyncHandler(async (req, res) => {
  const clinicId = req.user.clinicId;

  if (!clinicId) {
    throw new ApiError(404, 'Clinic not found for this user');
  }

  const staff = await Staff.find({ clinicId }).populate('userId', 'name email');

  res.status(200).json(new ApiResponse(200, staff));
});

exports.createStaff = asyncHandler(async (req, res) => {
  const clinicId = req.user.clinicId;
  const { name, email, phone, role, photo } = req.body;

  if (!clinicId) {
    throw new ApiError(404, 'Clinic not found for this user');
  }

  if (!name || !email || !role) {
    throw new ApiError(400, 'Name, email, and role are required');
  }

  const existingUser = await User.findOne({ email: email.toLowerCase() });

  if (existingUser) {
    throw new ApiError(400, 'Email already in use');
  }

  const defaultPassword = 'staff123';
  const hashedPassword = await bcrypt.hash(defaultPassword, 12);

  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password: hashedPassword,
    roles: ['clinic_admin'],
    photo,
  });

  const staff = await Staff.create({
    userId: user._id,
    clinicId,
    role,
    name,
    email: email.toLowerCase(),
    phone,
    photo,
  });

  const { sendEmail } = require('../../services/emailService');
  const clinic = await Clinic.findById(clinicId);
  try {
    sendEmail(
      email.toLowerCase(),
      'Your Care Nexus Staff Account',
      'newStaffAccount',
      {
        name,
        clinicName: clinic?.name || 'the clinic',
        password: defaultPassword,
      },
    );
  } catch (e) {}

  res.status(201).json(new ApiResponse(201, staff, 'Staff account created'));
});

exports.updateStaff = asyncHandler(async (req, res) => {
  const clinicId = req.user.clinicId;
  const { id } = req.params;
  const { name, email, phone, role, photo } = req.body;

  if (!clinicId) {
    throw new ApiError(404, 'Clinic not found for this user');
  }

  const staff = await Staff.findOne({ _id: id, clinicId });

  if (!staff) {
    throw new ApiError(404, 'Staff not found');
  }

  if (name) staff.name = name;
  if (email) staff.email = email.toLowerCase();
  if (phone) staff.phone = phone;
  if (role) staff.role = role;
  if (photo) staff.photo = photo;

  await staff.save();

  // Update corresponding user record
  const userUpdate = {};
  if (name) userUpdate.name = name;
  if (email) userUpdate.email = email.toLowerCase();
  if (photo) userUpdate.photo = photo;

  if (Object.keys(userUpdate).length > 0) {
    await User.findByIdAndUpdate(staff.userId, userUpdate);
  }

  res.status(200).json(new ApiResponse(200, staff, 'Staff updated'));
});

exports.deleteStaff = asyncHandler(async (req, res) => {
  const clinicId = req.user.clinicId;
  const { id } = req.params;

  if (!clinicId) {
    throw new ApiError(404, 'Clinic not found for this user');
  }

  const staff = await Staff.findOne({ _id: id, clinicId });

  if (!staff) {
    throw new ApiError(404, 'Staff not found');
  }

  await User.findByIdAndDelete(staff.userId);
  await Staff.findByIdAndDelete(id);

  res.status(200).json(new ApiResponse(200, null, 'Staff account removed'));
});
