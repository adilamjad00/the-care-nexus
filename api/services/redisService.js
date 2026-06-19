const redisClient = require('../config/redis');

// Store refresh token in Redis with 7 days expiry
const storeRefreshToken = async (userId, token) => {
  const expiryInSeconds = 7 * 24 * 60 * 60; // 7 days
  await redisClient.set(`refresh_token:${userId}`, token, {
    ex: expiryInSeconds,
  });
};

// Retrieve refresh token from Redis
const getRefreshToken = async (userId) => {
  return await redisClient.get(`refresh_token:${userId}`);
};

// Delete refresh token from Redis
const deleteRefreshToken = async (userId) => {
  await redisClient.del(`refresh_token:${userId}`);
};

// Store registration data in Redis for 24 hours
const storePendingUser = async (token, userData) => {
  const expiryInSeconds = 24 * 60 * 60; // 24 hours
  await redisClient.set(`pending_user:${token}`, userData, {
    ex: expiryInSeconds,
  });
};

const getPendingUser = async (token) => {
  return await redisClient.get(`pending_user:${token}`);
};

const deletePendingUser = async (token) => {
  await redisClient.del(`pending_user:${token}`);
};

// Store reset token with 1 hour expiry
const storeResetToken = async (token, userId) => {
  await redisClient.set(`reset_token:${token}`, userId.toString(), {
    ex: 3600,
  });
};

const getResetUserId = async (token) => {
  return await redisClient.get(`reset_token:${token}`);
};

const deleteResetToken = async (token) => {
  await redisClient.del(`reset_token:${token}`);
};

module.exports = {
  storeRefreshToken,
  getRefreshToken,
  deleteRefreshToken,
  storePendingUser,
  getPendingUser,
  deletePendingUser,
  storeResetToken,
  getResetUserId,
  deleteResetToken,
};
