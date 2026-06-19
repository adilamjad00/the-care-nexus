const mongoose = require('mongoose');

const connectionRequestSchema = new mongoose.Schema(
  {
    fromId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // The requesting doctor/clinic admin user ID
      required: true,
    },
    fromRole: {
      type: String,
      enum: ['doctor', 'clinic'],
      required: true,
    },
    fromName: {
      type: String,
      required: true,
    },
    toPatientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // The patient's user ID
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    // If clinic, which clinic exactly (might be needed if one admin manages multiple, though usually 1-to-1 here)
    clinicId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Clinic',
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('ConnectionRequest', connectionRequestSchema);
