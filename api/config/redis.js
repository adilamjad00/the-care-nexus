const { Redis } = require('@upstash/redis');
require('dotenv').config();

// Initialize Upstash Redis client only if URL is provided
let redisClient = null;

if (
  process.env.UPSTASH_REDIS_REST_URL &&
  process.env.UPSTASH_REDIS_REST_TOKEN
) {
  try {
    redisClient = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
    console.log('Redis connected');
  } catch (error) {
    console.error('Redis connection failed:', error.message);
  }
} else {
  console.warn('Redis URL not configured. Redis features will be disabled.');
}

// Mock Redis client for development without Redis
const mockRedis = {
  get: async () => null,
  set: async () => 'OK',
  del: async () => 1,
  exists: async () => 0,
};

module.exports = redisClient || mockRedis;
