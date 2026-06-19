const mongoose = require('mongoose');
const conversationSchema = new mongoose.Schema(
  {
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    lastMessage: String,
    lastMessageAt: Date,
    lastMessageSender: { type: String, enum: ['doctor', 'patient'] },
    unreadCountDoctor: { type: Number, default: 0 },
    unreadCountPatient: { type: Number, default: 0 },
  },
  { timestamps: true },
);
conversationSchema.index({ doctorId: 1, patientId: 1 }, { unique: true });
module.exports = mongoose.model('Conversation', conversationSchema);
