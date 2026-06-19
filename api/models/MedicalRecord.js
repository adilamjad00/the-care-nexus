const mongoose = require('mongoose');

const medicalRecordSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: true,
      index: true,
    },
    doctorId: {
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
    externalDoctorName: {
      type: String,
      trim: true,
    },
    externalClinicName: {
      type: String,
      trim: true,
    },
    familyMemberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FamilyMember',
      index: true,
    },
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Appointment',
    },
    prescriptionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Prescription',
    },
    visitDate: {
      type: Date,
      required: true,
      default: Date.now,
      index: true,
    },
    chiefComplaint: {
      type: String,
      required: true,
      trim: true,
    },
    symptoms: {
      type: [String],
      default: [],
    },
    diagnosis: {
      type: String,
      required: true,
      trim: true,
    },
    vitalSigns: {
      bloodPressure: {
        systolic: Number,
        diastolic: Number,
      },
      heartRate: Number,
      temperature: Number,
      weight: Number,
      height: Number,
      oxygenSaturation: Number,
    },
    labResults: [
      {
        testName: String,
        result: String,
        date: Date,
        fileUrl: String,
      },
    ],
    imaging: [
      {
        type: String,
        description: String,
        fileUrl: String,
        date: Date,
      },
    ],
    notes: {
      type: String,
      default: '',
      trim: true,
    },
    followUpDate: {
      type: Date,
    },
    attachments: [
      {
        fileName: String,
        fileUrl: String,
        fileType: String,
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  },
);

// Indexes for efficient queries
medicalRecordSchema.index({ patientId: 1, visitDate: -1 });
medicalRecordSchema.index({ doctorId: 1, visitDate: -1 });
medicalRecordSchema.index({ appointmentId: 1 });
medicalRecordSchema.index({ prescriptionId: 1 });

// Virtual for BMI calculation
medicalRecordSchema.virtual('bmi').get(function () {
  if (this.vitalSigns?.weight && this.vitalSigns?.height) {
    const heightInMeters = this.vitalSigns.height / 100;
    return (this.vitalSigns.weight / (heightInMeters * heightInMeters)).toFixed(
      2,
    );
  }
  return null;
});

// Ensure virtuals are included in JSON
medicalRecordSchema.set('toJSON', { virtuals: true });
medicalRecordSchema.set('toObject', { virtuals: true });

const MedicalRecord = mongoose.model('MedicalRecord', medicalRecordSchema);

module.exports = MedicalRecord;
