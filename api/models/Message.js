const mongoose = require('mongoose');
const {
  encryptMessageContent,
  decryptMessageContent,
} = require('../utils/messageCrypto');

const messageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Conversation',
      required: true,
    },
    senderId: { type: mongoose.Schema.Types.ObjectId, required: true },
    senderRole: { type: String, enum: ['doctor', 'patient'], required: true },
    content: { type: String, default: '' },
    type: { type: String, enum: ['text', 'file'], default: 'text' },
    fileUrl: String,
    fileName: String,
    isRead: { type: Boolean, default: false },
    isDelivered: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

messageSchema.pre('save', function () {
  if (
    this.isModified('content') &&
    typeof this.content === 'string' &&
    this.content.length > 0
  ) {
    this.content = encryptMessageContent(this.content);
  }
});

messageSchema.methods.getDecryptedContent = function () {
  return decryptMessageContent(this.content);
};

const transformMessage = (_doc, ret) => {
  if (typeof ret.content === 'string') {
    ret.content = decryptMessageContent(ret.content);
  }
  return ret;
};

messageSchema.set('toJSON', {
  virtuals: true,
  transform: transformMessage,
});

messageSchema.set('toObject', {
  virtuals: true,
  transform: transformMessage,
});

module.exports = mongoose.model('Message', messageSchema);
