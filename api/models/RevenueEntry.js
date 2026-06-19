const mongoose = require('mongoose');

const revenueEntrySchema = new mongoose.Schema(
  {
    doctorUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    clinicId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Clinic',
      default: null,
      index: true,
    },
    patientUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true,
    },
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Appointment',
      default: null,
      index: true,
    },
    prescriptionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Prescription',
      default: null,
      index: true,
    },
    sourceType: {
      type: String,
      enum: ['appointment_completed', 'manual_prescription'],
      default: 'appointment_completed',
      index: true,
    },
    consultationFee: {
      type: Number,
      default: 0,
      min: 0,
    },
    medicineCost: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalCost: {
      type: Number,
      required: true,
      min: 0,
    },
    doctorShare: {
      type: Number,
      required: true,
      min: 0,
    },
    clinicShare: {
      type: Number,
      required: true,
      min: 0,
    },
    occurredAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  { timestamps: true },
);

revenueEntrySchema.index({ doctorUserId: 1, occurredAt: -1 });
revenueEntrySchema.index({ clinicId: 1, occurredAt: -1 });
revenueEntrySchema.index({ patientUserId: 1, occurredAt: -1 });

module.exports = mongoose.model('RevenueEntry', revenueEntrySchema);
