const asyncHandler = require('../../utils/asyncHandler');
const ApiResponse = require('../../utils/ApiResponse');
const ApiError = require('../../utils/ApiError');
const Patient = require('../../models/Patient');
const User = require('../../models/User');
const bcrypt = require('bcryptjs');

/**
 * Get patient profile
 * @route GET /api/patient/profile
 * @access Private (Patient only)
 */
exports.getProfile = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const patient = await Patient.findOne({ userId }).populate(
    'userId',
    'email role',
  );

  if (!patient) {
    throw new ApiError(404, 'Patient profile not found');
  }

  res
    .status(200)
    .json(new ApiResponse(200, patient, 'Profile fetched successfully'));
});

/**
 * Update patient profile
 * @route PUT /api/patient/profile
 * @access Private (Patient only)
 */
exports.updateProfile = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { name, dob, gender, bloodGroup, allergies, contact, profilePhoto } =
    req.body;

  const patient = await Patient.findOne({ userId });

  if (!patient) {
    throw new ApiError(404, 'Patient profile not found');
  }

  // Normalize gender to lowercase for schema validation
  if (gender) {
    patient.gender = gender.toLowerCase();
  }

  // Update other fields
  patient.name = name || patient.name;
  patient.dob = dob || patient.dob;
  patient.bloodGroup = bloodGroup || patient.bloodGroup;
  patient.allergies = allergies || patient.allergies;
  patient.contact = contact || patient.contact;
  patient.profilePhoto = profilePhoto || patient.profilePhoto;

  // Ensure email remains consistent and doesn't trigger "required" errors if Mongoose is being picky
  if (!patient.email) {
    const user = await User.findById(userId);
    patient.email = user.email;
  }

  await patient.save();

  const updatedPatient = await Patient.findOne({ userId }).populate(
    'userId',
    'email role',
  );

  res
    .status(200)
    .json(new ApiResponse(200, updatedPatient, 'Profile updated successfully'));
});

/**
 * Change password
 * @route PUT /api/patient/profile/password
 * @access Private (Patient only)
 */
exports.updatePassword = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    throw new ApiError(400, 'Please provide current and new password');
  }

  const user = await User.findById(userId).select('+password');

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  // Verify current password
  const isPasswordMatch = await bcrypt.compare(currentPassword, user.password);

  if (!isPasswordMatch) {
    throw new ApiError(401, 'Current password is incorrect');
  }

  // Hash new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;
  await user.save();

  res
    .status(200)
    .json(new ApiResponse(200, null, 'Password changed successfully'));
});
