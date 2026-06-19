const { verifyAccessToken } = require('../utils/jwt');
const User = require('../models/User');
const Clinic = require('../models/Clinic');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: 'Not authorized to access this route' });
  }

  try {
    const decoded = verifyAccessToken(token);

    if (!decoded) {
      return res
        .status(401)
        .json({ success: false, message: 'Token is invalid or expired' });
    }

    req.user = await User.findById(decoded.id).select('-password');

    // Populate clinicId for clinic admins so controllers can use req.user.clinicId
    if (req.user && req.user.roles.includes('clinic_admin')) {
      const clinic = await Clinic.findOne({ adminId: req.user._id }).select(
        '_id',
      );
      if (clinic) req.user.clinicId = clinic._id;
    }

    next();
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, message: 'Not authorized to access this route' });
  }
};

module.exports = { protect };
