const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  clinicId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Clinic',
    required: [true, 'Clinic ID is required'],
  },
  date: {
    type: Date,
    required: [true, 'Date is required'],
  },
  totalPatients: {
    type: Number,
    default: 0,
  },
  totalAppointments: {
    type: Number,
    default: 0,
  },
  completedAppointments: {
    type: Number,
    default: 0,
  },
  cancelledAppointments: {
    type: Number,
    default: 0,
  },
  revenue: {
    type: Number,
    default: 0,
  },
  doctorStats: [
    {
      doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
      },
      appointmentsCompleted: {
        type: Number,
        default: 0,
      },
      avgVisitTime: {
        type: Number,
        default: 0,
      },
    },
  ],
});

analyticsSchema.index({ clinicId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Analytics', analyticsSchema);
