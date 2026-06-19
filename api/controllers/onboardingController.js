const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');

exports.markComplete = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  user.onboardingCompleted = true;
  await user.save();

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { onboardingCompleted: true },
        'Onboarding marked complete',
      ),
    );
});

exports.markProfileComplete = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  user.profileCompleted = true;
  await user.save();

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { profileCompleted: true },
        'Profile marked complete',
      ),
    );
});
