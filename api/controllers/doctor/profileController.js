const asyncHandler = require('../../utils/asyncHandler');
const ApiResponse = require('../../utils/ApiResponse');
const ApiError = require('../../utils/ApiError');
const Doctor = require('../../models/Doctor');
const User = require('../../models/User');

/**
 * @desc    Get doctor profile
 * @route   GET /api/doctor/profile
 * @access  Private (Doctor)
 */
exports.getProfile = asyncHandler(async (req, res) => {
  const doctor = await Doctor.findOne({ userId: req.user._id }).populate(
    'userId',
    'name email phone photo',
  );

  if (!doctor) {
    throw new ApiError(404, 'Doctor profile not found');
  }

  res
    .status(200)
    .json(new ApiResponse(200, doctor, 'Profile fetched successfully'));
});

/**
 * @desc    Update doctor profile
 * @route   PUT /api/doctor/profile
 * @access  Private (Doctor)
 */
exports.updateProfile = asyncHandler(async (req, res) => {
  const {
    bio,
    experience,
    education,
    languages,
    consultationFee,
    name,
    phone,
    photo,
    location,
    specialization,
    gender,
    city,
    licenseNo,
  } = req.body;

  // Update User basic info only if provided
  const userUpdate = {};
  if (name) userUpdate.name = name;
  if (phone) userUpdate.phone = phone;
  if (photo) userUpdate.photo = photo;

  if (Object.keys(userUpdate).length > 0) {
    await User.findByIdAndUpdate(req.user._id, userUpdate);
  }

  // Update Doctor clinical info
  const updateData = {
    bio,
    experience,
    education,
    languages,
    consultationFee,
    specialization,
    gender,
    city,
    licenseNo,
    fullName: name,
  };

  if (location) {
    updateData.location = location;
  }

  const doctor = await Doctor.findOneAndUpdate(
    { userId: req.user._id },
    updateData,
    { new: true, runValidators: true },
  );

  if (!doctor) {
    throw new ApiError(404, 'Doctor profile not found');
  }

  res
    .status(200)
    .json(new ApiResponse(200, doctor, 'Profile updated successfully'));
});
