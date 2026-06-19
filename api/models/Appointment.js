const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    clinicId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Clinic',
      required: false,
      index: true,
    },
    dateTime: {
      type: Date,
      required: true,
      index: true,
    },
    duration: {
      type: Number,
      default: 15, // minutes
      min: 15,
      max: 180,
    },
    status: {
      type: String,
      enum: [
        'pending',
        'confirmed',
        'in-progress',
        'completed',
        'cancelled',
        'no-show',
        'reserved',
      ],
      default: 'pending',
      index: true,
    },
    type: {
      type: String,
      enum: ['consultation', 'follow-up', 'emergency', 'routine'],
      default: 'consultation',
    },
    reason: {
      type: String,
      required: true,
      trim: true,
    },
    notes: {
      type: String,
      default: '',
      trim: true,
    },
    cancellationReason: {
      type: String,
      default: '',
      trim: true,
    },
    cancelledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    cancelledAt: {
      type: Date,
    },
    completedAt: {
      type: Date,
    },
    prescriptionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Prescription',
    },
    patientFeedback: {
      score: { type: Number, min: 1, max: 5 },
      comment: { type: String, trim: true },
      ratedAt: { type: Date },
    },
    reviewId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Review',
    },
  },
  {
    timestamps: true,
  },
);

// Compound indexes for efficient queries
appointmentSchema.index({ doctorId: 1, dateTime: 1 });
appointmentSchema.index({ patientId: 1, dateTime: 1 });
appointmentSchema.index({ clinicId: 1, dateTime: 1 });
appointmentSchema.index({ status: 1, dateTime: 1 });
appointmentSchema.index({ doctorId: 1, status: 1, dateTime: 1 });

// Pre-save middleware to set completedAt
appointmentSchema.pre('save', async function () {
  if (
    this.isModified('status') &&
    this.status === 'completed' &&
    !this.completedAt
  ) {
    this.completedAt = new Date();
  }
});

// Virtual for appointment duration in hours
appointmentSchema.virtual('durationInHours').get(function () {
  return this.duration / 60;
});

// Ensure virtuals are included in JSON
appointmentSchema.set('toJSON', { virtuals: true });
appointmentSchema.set('toObject', { virtuals: true });

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;
