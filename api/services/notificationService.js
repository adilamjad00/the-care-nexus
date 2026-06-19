const Notification = require('../models/Notification');
const NotificationPreference = require('../models/NotificationPreference');
const redis = require('../config/redis');
const { getIO } = require('../config/socket');

const DEFAULT_TTL_SECONDS = 60 * 60 * 24;

const normalizeObjectId = (value) => {
  if (!value) return null;
  return value.toString();
};

const buildLegacyText = ({ titleKey, bodyKey, bodyParams }) => {
  // Keep legacy title/message populated for compatibility with old UI surfaces.
  const title = titleKey || 'notification';
  const rawBody = bodyKey || 'notification';
  const hasParams = bodyParams && Object.keys(bodyParams).length > 0;
  const message = hasParams
    ? `${rawBody} ${JSON.stringify(bodyParams)}`
    : rawBody;
  return { title, message };
};

async function sendNotification(userId, payload) {
  const targetUserId = normalizeObjectId(userId);
  if (!targetUserId) return null;

  const {
    type,
    titleKey,
    bodyKey,
    bodyParams = {},
    actionUrl = null,
    dedupeKey = null,
    portal = 'general',
  } = payload;

  if (!type || !titleKey || !bodyKey) {
    throw new Error(
      'Notification payload missing required fields: type/titleKey/bodyKey',
    );
  }

  if (dedupeKey) {
    const already = await redis.get(dedupeKey);
    if (already) return null;
  }

  let prefs = await NotificationPreference.findOne({ userId: targetUserId });
  if (!prefs) {
    prefs = await NotificationPreference.create({ userId: targetUserId });
  }

  if (prefs[type] === false) {
    return null;
  }

  const legacy = buildLegacyText({ titleKey, bodyKey, bodyParams });

  const notification = await Notification.create({
    userId: targetUserId,
    recipient: targetUserId,
    type,
    portal,
    titleKey,
    bodyKey,
    bodyParams,
    actionUrl,
    dedupeKey,
    title: legacy.title,
    message: legacy.message,
    link: actionUrl,
    read: false,
  });

  const io = getIO();
  if (io) {
    io.to(targetUserId).emit('notification', {
      _id: notification._id,
      userId: targetUserId,
      type,
      titleKey,
      bodyKey,
      bodyParams,
      actionUrl,
      portal,
      read: false,
      createdAt: notification.createdAt,
    });
  }

  if (dedupeKey) {
    await redis.set(dedupeKey, '1', { ex: DEFAULT_TTL_SECONDS });
  }

  return notification;
}

module.exports = { sendNotification };
