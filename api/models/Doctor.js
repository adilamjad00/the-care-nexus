const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      required: [true, 'Please provide full name'],
    },
    specialization: {
      type: String,
      required: [true, 'Please provide specialization'],
    },
    licenseNo: {
      type: String,
      required: [true, 'Please provide license number'],
      unique: true,
    },
    schedule: {
      monday: [String],
      tuesday: [String],
      wednesday: [String],
      thursday: [String],
      friday: [String],
      saturday: [String],
      sunday: [String],
    },
    experience: {
      type: Number,
      default: 0,
    },
    bio: {
      type: String,
    },
    clinicId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Clinic',
    },
    patients: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
      },
    ],
    consultationFee: {
      type: Number,
      default: 0,
    },
    averageRating: {
      type: Number,
      default: 0,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
    revenue: {
      total: {
        type: Number,
        default: 0,
      },
      monthly: {
        type: Map,
        of: Number,
        default: new Map(),
      },
      daily: {
        type: Map,
        of: Number,
        default: new Map(),
      },
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('Doctor', doctorSchema);
