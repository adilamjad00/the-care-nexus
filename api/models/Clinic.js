const mongoose = require('mongoose');

const clinicSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Clinic name is required'],
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
  },
  photo: {
    type: String,
  },
  workingHours: {
    monday: {
      open: { type: String, default: '09:00' },
      close: { type: String, default: '17:00' },
      closed: { type: Boolean, default: false },
    },
    tuesday: {
      open: { type: String, default: '09:00' },
      close: { type: String, default: '17:00' },
      closed: { type: Boolean, default: false },
    },
    wednesday: {
      open: { type: String, default: '09:00' },
      close: { type: String, default: '17:00' },
      closed: { type: Boolean, default: false },
    },
    thursday: {
      open: { type: String, default: '09:00' },
      close: { type: String, default: '17:00' },
      closed: { type: Boolean, default: false },
    },
    friday: {
      open: { type: String, default: '09:00' },
      close: { type: String, default: '17:00' },
      closed: { type: Boolean, default: false },
    },
    saturday: {
      open: { type: String, default: '09:00' },
      close: { type: String, default: '17:00' },
      closed: { type: Boolean, default: true },
    },
    sunday: {
      open: { type: String, default: '09:00' },
      close: { type: String, default: '17:00' },
      closed: { type: Boolean, default: true },
    },
  },
  subscription: {
    plan: {
      type: String,
      enum: ['free', 'basic', 'premium', 'enterprise'],
      default: 'free',
    },
    expiresAt: {
      type: Date,
    },
  },
  doctors: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
    },
  ],
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Admin ID is required'],
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Clinic', clinicSchema);
