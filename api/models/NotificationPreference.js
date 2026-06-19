const mongoose = require('mongoose');

const notificationPreferenceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    follow_up_reminder: { type: Boolean, default: true },
    appointment_reminder: { type: Boolean, default: true },
    appointment_status: { type: Boolean, default: true },
    new_prescription: { type: Boolean, default: true },
    doctor_appointment_reminder: { type: Boolean, default: true },
    appointment_booked: { type: Boolean, default: true },
    appointment_cancelled_by_patient: { type: Boolean, default: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model(
  'NotificationPreference',
  notificationPreferenceSchema,
);
