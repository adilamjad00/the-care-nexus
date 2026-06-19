const User = require('../models/User');
const crypto = require('crypto');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const Clinic = require('../models/Clinic');
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require('../utils/jwt');
const {
  storeRefreshToken,
  getRefreshToken,
  deleteRefreshToken,
  storePendingUser,
  getPendingUser,
  deletePendingUser,
  storeResetToken,
  getResetUserId,
  deleteResetToken,
} = require('../services/redisService');
const { sendEmail } = require('../services/emailService');
const {
  getVerificationEmail,
  getForgotPasswordEmail,
} = require('../utils/emailTemplates');

const buildUserResponse = (user) => {
  const primaryRole =
    user.roles && user.roles.length > 0 ? user.roles[0] : 'patient';
  return {
    _id: user._id,
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    photo: user.photo,
    avatar: user.photo,
    role: primaryRole,
    roles: user.roles,
    isVerified: user.isVerified,
    onboardingCompleted: Boolean(user.onboardingCompleted),
    profileCompleted: Boolean(user.profileCompleted),
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};

// @desc    Register user (Pending)
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { email, password, role, profileData } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    // Check if user already exists in DB
    const existingUser = await User.findOne({ email });

    // Block re-registration with a DIFFERENT role (role isolation)
    if (existingUser) {
      if (existingUser.roles.includes(role)) {
        return res.status(400).json({
          success: false,
          message: 'An account with this role already exists for this email.',
        });
      }
      // User exists but with a different role — not allowed
      return res.status(400).json({
        success: false,
        message:
          `This email is already registered as ${existingUser.roles.join('/')}. ` +
          'Please use a different email or log in with your existing role.',
      });
    }

    // For clinic admins, prevent duplicate clinic names
    if (role === 'clinic_admin') {
      const clinicName = profileData?.clinicName?.trim();
      if (clinicName) {
        const existingClinic = await Clinic.findOne({
          name: { $regex: new RegExp(`^${clinicName}$`, 'i') },
        });
        if (existingClinic) {
          return res.status(400).json({
            success: false,
            message: `A clinic named "${clinicName}" already exists. Please choose a different name.`,
          });
        }
      }
    }

    // Store pending registration in Redis and send verification email
    const verificationToken = crypto.randomBytes(32).toString('hex');

    const userData = {
      email,
      password,
      role,
      profileData,
      isNew: true,
    };

    await storePendingUser(verificationToken, userData);

    const sent = await sendEmail({
      to: email,
      subject: 'Verify your email - The Care Nexus',
      html: getVerificationEmail(email, verificationToken),
    });

    if (!sent) {
      await deletePendingUser(verificationToken);
      return res.status(500).json({
        success: false,
        message: 'Could not send verification email. Please try again.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Verification email sent. Please check your inbox.',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Verify Email
// @route   POST /api/auth/verify/:token
// @access  Public
const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    const userData = await getPendingUser(token);

    if (!userData) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid or expired token' });
    }

    const { email, password, role, profileData, isNew } = userData;

    const resolvedName =
      profileData?.name ||
      profileData?.fullName ||
      profileData?.clinicName ||
      null;
    const resolvedPhone = profileData?.phone || null;
    const resolvedPhoto = profileData?.photo || null;

    let user;
    if (isNew) {
      user = await User.create({
        name: resolvedName,
        phone: resolvedPhone,
        photo: resolvedPhoto,
        email,
        password,
        roles: [role],
        isVerified: true,
      });
    } else {
      user = await User.findOne({ email });
      if (!user) {
        // Handle case where user was expected to exist but doesn't (cache/db out of sync)
        user = await User.create({
          name: resolvedName,
          phone: resolvedPhone,
          photo: resolvedPhoto,
          email,
          password,
          roles: [role],
          isVerified: true,
        });
      } else {
        if (!user.roles.includes(role)) {
          user.roles.push(role);
        }
        if (!user.phone && resolvedPhone) {
          user.phone = resolvedPhone;
        }
        user.isVerified = true;
        await user.save();
      }
    }

    // Create role-specific profile — normalize registration fields to each
    // model's schema so data entered at signup isn't silently dropped.
    if (role === 'patient') {
      const { fullName, phone, ...rest } = profileData || {};
      const doc = {
        userId: user._id,
        email: user.email,
        ...rest,
      };
      if (fullName) doc.name = fullName;
      if (phone) doc.contact = phone;

      await Patient.findOneAndUpdate({ userId: user._id }, doc, {
        upsert: true,
        returnDocument: 'after',
        setDefaultsOnInsert: true,
      });
    } else if (role === 'doctor') {
      await Doctor.findOneAndUpdate(
        { userId: user._id },
        { ...(profileData || {}), userId: user._id },
        { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true },
      );
    } else if (role === 'clinic_admin') {
      const { clinicName, ...rest } = profileData || {};
      const doc = {
        adminId: user._id,
        email: user.email,
        ...rest,
      };
      if (clinicName) doc.name = clinicName;

      await Clinic.findOneAndUpdate({ adminId: user._id }, doc, {
        upsert: true,
        returnDocument: 'after',
        setDefaultsOnInsert: true,
      });
    }

    await deletePendingUser(token);

    const accessToken = generateAccessToken(user._id, user.roles);
    const refreshToken = generateRefreshToken(user._id);
    await storeRefreshToken(user._id, refreshToken);

    res.status(200).json({
      success: true,
      data: {
        ...buildUserResponse(user),
        verifiedRole: role,
      },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an email and password',
      });
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.matchPassword(password))) {
      return res
        .status(401)
        .json({ success: false, message: 'Invalid credentials' });
    }

    // If a specific role was requested, verify the user has it
    if (role && !user.roles.includes(role)) {
      return res.status(403).json({
        success: false,
        message:
          `This account is not registered as ${role}. ` +
          `Please log in with your correct role (${user.roles.join('/')}).`,
      });
    }

    const accessToken = generateAccessToken(user._id, user.roles);
    const refreshToken = generateRefreshToken(user._id);

    await storeRefreshToken(user._id, refreshToken);

    res.status(200).json({
      success: true,
      data: {
        ...buildUserResponse(user),
      },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Logout user / clear token
// @route   POST /api/auth/logout
// @access  Private
const logoutUser = async (req, res) => {
  try {
    await deleteRefreshToken(req.user._id);
    res.status(200).json({ success: true, message: 'User logged out' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get new access token from refresh token
// @route   POST /api/auth/refresh
// @access  Public
const refreshAccessToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res
        .status(401)
        .json({ success: false, message: 'No refresh token provided' });
    }

    const decoded = verifyRefreshToken(refreshToken);

    if (!decoded) {
      return res
        .status(401)
        .json({ success: false, message: 'Refresh token invalid or expired' });
    }

    const storedToken = await getRefreshToken(decoded.id);

    if (storedToken !== refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token compromised or expired',
      });
    }

    const user = await User.findById(decoded.id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: 'User not found' });
    }

    const newAccessToken = generateAccessToken(user._id, user.roles);

    res.status(200).json({
      success: true,
      accessToken: newAccessToken,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.status(200).json({
        success: true,
        data: {
          ...buildUserResponse(user),
        },
      });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.phone = req.body.phone ?? user.phone;
      user.photo = req.body.photo ?? user.photo;
      user.email = req.body.email || user.email;

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.status(200).json({
        success: true,
        data: {
          ...buildUserResponse(updatedUser),
        },
      });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Forgot Password
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: 'No account found with this email' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    await storeResetToken(resetToken, user._id);

    const sent = await sendEmail({
      to: user.email,
      subject: 'Reset your password - The Care Nexus',
      html: getForgotPasswordEmail(resetToken),
    });

    if (!sent) {
      await deleteResetToken(resetToken);
      return res
        .status(500)
        .json({ success: false, message: 'Could not send reset email' });
    }

    res.status(200).json({
      success: true,
      message: 'Password reset link sent to your email',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Reset Password
// @route   POST /api/auth/reset-password/:token
// @access  Public
const resetPassword = async (req, res) => {
  try {
    const { password } = req.body;
    const { token } = req.params;

    const userId = await getResetUserId(token);
    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid or expired reset token' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: 'User no longer exists' });
    }

    user.password = password;
    await user.save();
    await deleteResetToken(token);

    res
      .status(200)
      .json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Google OAuth Auth (Login/Signup)
// @route   POST /api/auth/google
// @access  Public
const axios = require('axios');

const googleAuthUser = async (req, res) => {
  try {
    const { idToken, role } = req.body;

    if (!idToken) {
      return res.status(400).json({
        success: false,
        message: 'Google ID token is required',
      });
    }

    let payload;
    try {
      const { data } = await axios.get(
        `https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`,
      );

      if (data.aud !== process.env.GOOGLE_CLIENT_ID) {
        throw new Error('Token audience mismatch');
      }

      payload = data;
    } catch (err) {
      console.error(
        'Google token verification failed:',
        err.response?.data || err.message,
      );
      return res.status(401).json({
        success: false,
        message: 'Invalid Google token',
      });
    }

    const { sub: googleId, email, name, picture } = payload;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Google account does not provide an email address',
      });
    }

    // Check if user exists
    let user = await User.findOne({
      $or: [{ googleId }, { email: email.toLowerCase() }],
    });
    let isNewUser = false;

    if (user) {
      // If local account, silently link the Google ID (email verified by Google)
      if (user.authProvider === 'local' && !user.googleId) {
        user.googleId = googleId;
        await user.save();
      }

      // Conflict check: registering under a role this account doesn't have
      if (role && !user.roles.includes(role)) {
        return res.status(409).json({
          success: false,
          message:
            'An account with this email already exists. Please sign in instead.',
        });
      }
    } else {
      // User does not exist — create account with the provided role
      if (!role) {
        return res.status(400).json({
          success: false,
          message:
            'Please select a role (Patient, Doctor, or Clinic) before continuing with Google.',
        });
      }

      // Create new user & profile
      let createdUser = null;
      try {
        createdUser = await User.create({
          name: name || null,
          email: email.toLowerCase(),
          googleId,
          authProvider: 'google',
          roles: [role],
          isVerified: true,
          photo: picture || null,
        });

        if (role === 'patient') {
          await Patient.findOneAndUpdate(
            { userId: createdUser._id },
            {
              userId: createdUser._id,
              email: createdUser.email,
              dob: null,
              bloodGroup: '',
              allergies: [],
            },
            { upsert: true, setDefaultsOnInsert: true },
          );
        } else if (role === 'doctor') {
          await Doctor.findOneAndUpdate(
            { userId: createdUser._id },
            {
              userId: createdUser._id,
              fullName: name || 'Doctor',
              specialization: 'General',
              licenseNo: `GOOGLE-${createdUser._id}`,
              schedule: {},
            },
            { upsert: true, setDefaultsOnInsert: true },
          );
        } else if (role === 'clinic_admin') {
          await Clinic.findOneAndUpdate(
            { adminId: createdUser._id },
            {
              adminId: createdUser._id,
              email: createdUser.email,
              name: name || 'My Clinic',
              address: 'Pending',
              phone: 'Pending',
            },
            { upsert: true, setDefaultsOnInsert: true },
          );
        }

        user = createdUser;
        isNewUser = true;
      } catch (dbError) {
        if (createdUser) {
          await User.findByIdAndDelete(createdUser._id);
        }
        return res.status(500).json({
          success: false,
          message: dbError.message || 'Failed to create user profile',
        });
      }
    }

    const accessToken = generateAccessToken(user._id, user.roles);
    const refreshToken = generateRefreshToken(user._id);

    await storeRefreshToken(user._id, refreshToken);

    const userRes = buildUserResponse(user);

    res.status(200).json({
      success: true,
      isNew: isNewUser,
      data: userRes,
      user: userRes,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  registerUser,
  verifyEmail,
  loginUser,
  logoutUser,
  refreshAccessToken,
  getUserProfile,
  updateUserProfile,
  forgotPassword,
  resetPassword,
  googleAuthUser,
};
