const Clinic = require('../../models/Clinic');
const asyncHandler = require('../../utils/asyncHandler');
const ApiError = require('../../utils/ApiError');
const ApiResponse = require('../../utils/ApiResponse');

exports.getSettings = asyncHandler(async (req, res) => {
  const clinic = await Clinic.findOne({ adminId: req.user._id });

  if (!clinic) {
    throw new ApiError(404, 'Clinic not found');
  }

  res.status(200).json(new ApiResponse(200, clinic));
});

exports.updateSettings = asyncHandler(async (req, res) => {
  const { name, address, phone, email, workingHours, photo } = req.body;

  const clinic = await Clinic.findOne({ adminId: req.user._id });

  if (!clinic) {
    throw new ApiError(404, 'Clinic not found for this user');
  }

  if (name) clinic.name = name;
  if (address) clinic.address = address;
  if (phone) clinic.phone = phone;
  if (email) clinic.email = email;
  if (workingHours) clinic.workingHours = workingHours;
  if (photo !== undefined) clinic.photo = photo;

  await clinic.save();

  res
    .status(200)
    .json(new ApiResponse(200, clinic, 'Settings saved successfully'));
});
