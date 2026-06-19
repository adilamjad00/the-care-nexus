const Conversation = require('../models/Conversation');
const Message = require('../models/Message');

const resolveViewerRole = (req) => {
  const requestedRole = String(req.query?.viewerRole || '').toLowerCase();
  if (requestedRole === 'doctor' || requestedRole === 'patient') {
    return requestedRole;
  }
  return req.user.roles.includes('doctor') ? 'doctor' : 'patient';
};

const getConversations = async (req, res) => {
  const viewerRole = resolveViewerRole(req);
  const isDoctor = viewerRole === 'doctor';
  const id = req.user._id;
  const filter = isDoctor ? { doctorId: id } : { patientId: id };

  const conversations = await Conversation.find(filter)
    .populate('doctorId', 'name photo specialization')
    .populate('patientId', 'name photo email')
    .sort({ lastMessageAt: -1 });

  const formatted = conversations.map((c) => ({
    _id: c._id,
    otherParty: isDoctor
      ? { ...c.patientId?.toObject(), role: 'patient' }
      : { ...c.doctorId?.toObject(), role: 'doctor' },
    lastMessage: c.lastMessage,
    lastMessageAt: c.lastMessageAt,
    lastMessageSender: c.lastMessageSender,
    unreadCount: isDoctor ? c.unreadCountDoctor : c.unreadCountPatient,
  }));

  res.json({ success: true, data: formatted });
};

const getMessages = async (req, res) => {
  const { conversationId } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 30;
  const skip = (page - 1) * limit;

  const messages = await Message.find({ conversationId })
    .sort({ createdAt: 1 })
    .skip(skip)
    .limit(limit);

  const total = await Message.countDocuments({ conversationId });

  res.json({
    success: true,
    data: messages,
    total,
    page,
    pages: Math.ceil(total / limit),
  });
};

const startOrGetConversation = async (req, res) => {
  const isDoctor = req.user.roles.includes('doctor');
  const id = req.user._id;
  const { doctorId, patientId } = req.body;

  const filter = isDoctor
    ? { doctorId: id, patientId }
    : { doctorId, patientId: id };

  let conversation = await Conversation.findOne(filter);
  if (!conversation) {
    conversation = await Conversation.create({ ...filter });
  }

  res.json({ success: true, data: { conversationId: conversation._id } });
};

const markRead = async (req, res) => {
  const { conversationId } = req.params;
  const viewerRole = resolveViewerRole(req);
  const isDoctor = viewerRole === 'doctor';
  const id = req.user._id;

  await Message.updateMany(
    { conversationId, senderId: { $ne: id }, isRead: false },
    { isRead: true, isDelivered: true },
  );

  const update = isDoctor
    ? { unreadCountDoctor: 0 }
    : { unreadCountPatient: 0 };

  await Conversation.findByIdAndUpdate(conversationId, update);

  // Notify via socket so the sender gets the "blue tick" instantly
  const io = req.app.get('io');
  if (io) {
    io.to(conversationId).emit('messages_read', {
      conversationId,
      readerId: id.toString(),
    });
  }

  res.json({ success: true });
};

const deleteMessage = async (req, res) => {
  const { messageId } = req.params;
  const id = req.user._id;

  const message = await Message.findById(messageId);
  if (!message) {
    return res
      .status(404)
      .json({ success: false, message: 'Message not found' });
  }

  // Only sender can delete their own message
  if (message.senderId.toString() !== id.toString()) {
    return res
      .status(403)
      .json({
        success: false,
        message: 'You can only delete your own messages',
      });
  }

  message.isDeleted = true;
  message.content = 'This message was deleted';
  message.fileUrl = undefined;
  message.fileName = undefined;
  await message.save();

  // Notify via socket
  const io = req.app.get('io');
  if (io) {
    io.to(message.conversationId.toString()).emit('message_deleted', {
      messageId: message._id,
      conversationId: message.conversationId,
    });
  }

  res.json({ success: true, message: 'Message deleted' });
};

const deleteConversation = async (req, res) => {
  const { conversationId } = req.params;
  const id = req.user._id;

  const conversation = await Conversation.findById(conversationId);
  if (!conversation) {
    return res
      .status(404)
      .json({ success: false, message: 'Conversation not found' });
  }

  // Must be part of the conversation
  if (
    conversation.doctorId.toString() !== id.toString() &&
    conversation.patientId.toString() !== id.toString()
  ) {
    return res.status(403).json({ success: false, message: 'Access denied' });
  }

  // Hard delete conversation and messages
  await Message.deleteMany({ conversationId });
  await Conversation.findByIdAndDelete(conversationId);

  // Notify participants via socket
  const io = require('../config/socket').getIO();
  if (io) {
    const participants = [
      conversation.doctorId.toString(),
      conversation.patientId.toString(),
    ];
    participants.forEach((pId) => {
      io.to(pId).emit('conversation_deleted', { conversationId });
    });
  }

  res.json({ success: true, message: 'Conversation deleted' });
};

module.exports = {
  getConversations,
  getMessages,
  startOrGetConversation,
  markRead,
  deleteMessage,
  deleteConversation,
};
