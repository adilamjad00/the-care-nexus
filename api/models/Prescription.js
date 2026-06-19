const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    dosage: {
      type: String,
      required: true,
    },
    frequency: {
      type: String,
      required: true,
    },
    duration: {
      type: String,
      required: true,
    },
    instructions: {
      type: String,
      default: '',
    },
  },
  { _id: false },
);

const prescriptionSchema = new mongoose.Schema(
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
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Appointment',
      default: null,
    },
    clinicId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Clinic',
      default: null,
      index: true,
    },
    diagnosis: {
      type: String,
      required: true,
      trim: true,
    },
    medicines: {
      type: [medicineSchema],
      default: [],
    },
    notes: {
      type: String,
      default: '',
      trim: true,
    },
    rawTranscript: {
      type: String,
      default: '',
    },
    audioUrl: {
      type: String,
      default: '',
    },
    followUpDate: {
      type: Date,
      default: null,
    },
    consultationFee: {
      type: Number,
      default: 0,
    },
    medicineCost: {
      type: Number,
      default: 0,
    },
    totalCost: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['draft', 'finalized', 'modified'],
      default: 'finalized',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    lastModifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  },
);

// Round fees to whole numbers before saving
prescriptionSchema.pre('save', function () {
  if (this.consultationFee !== undefined)
    this.consultationFee = Math.round(this.consultationFee);
  if (this.medicineCost !== undefined)
    this.medicineCost = Math.round(this.medicineCost);
  if (this.totalCost !== undefined) this.totalCost = Math.round(this.totalCost);
});

// Indexes for efficient queries
prescriptionSchema.index({ doctorId: 1, createdAt: -1 });
prescriptionSchema.index({ patientId: 1, createdAt: -1 });
prescriptionSchema.index({ clinicId: 1, createdAt: -1 });
prescriptionSchema.index({ appointmentId: 1 });
prescriptionSchema.index({ status: 1 });

// Virtual for prescription summary
prescriptionSchema.virtual('medicineCount').get(function () {
  return this.medicines.length;
});

// Ensure virtuals are included in JSON
prescriptionSchema.set('toJSON', { virtuals: true });
prescriptionSchema.set('toObject', { virtuals: true });

const Prescription = mongoose.model('Prescription', prescriptionSchema);

module.exports = Prescription;
