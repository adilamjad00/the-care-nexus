const Notification = require('../models/Notification');

/**
 * Helper to create a notification and emit via socket
 * @param {Object} io - Socket.io instance
 * @param {Object} data - Notification data
 */
const createNotification = async (
  io,
  { recipient, title, message, type = 'info', link = '', portal = 'general' },
) => {
  try {
    const notification = await Notification.create({
      recipient,
      title,
      message,
      type,
      link,
      portal,
    });

    if (io) {
      io.to(recipient.toString()).emit('notification', {
        id: notification._id,
        title,
        message,
        type,
        link,
        portal,
        read: false,
        createdAt: notification.createdAt,
      });
    }

    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
  }
};

module.exports = { createNotification };
