import Redis from 'ioredis';
import config from './env.js';
import logger from '../utils/logger.js';

let redisClient = null;
let redisPub = null;
let redisSub = null;

/**
 * Initialize Redis connections
 */
export function initRedis() {
  try {
    // Main client for general operations
    redisClient = new Redis(config.REDIS_URL, {
      retryStrategy(times) {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
      reconnectOnError(err) {
        logger.error('Redis connection error:', err);
        return true;
      },
    });

    // Publisher for events
    redisPub = new Redis(config.REDIS_URL);

    // Subscriber for events
    redisSub = new Redis(config.REDIS_URL);

    redisClient.on('connect', () => {
      logger.info('Redis client connected');
    });

    redisClient.on('error', (err) => {
      logger.error('Redis client error:', err);
    });

    return { redisClient, redisPub, redisSub };
  } catch (error) {
    logger.error('Failed to initialize Redis:', error);
    throw error;
  }
}

/**
 * Get the main Redis client
 */
export function getRedisClient() {
  if (!redisClient) {
    throw new Error('Redis client not initialized');
  }
  return redisClient;
}

/**
 * Get the Redis publisher
 */
export function getRedisPublisher() {
  if (!redisPub) {
    throw new Error('Redis publisher not initialized');
  }
  return redisPub;
}

/**
 * Get the Redis subscriber
 */
export function getRedisSubscriber() {
  if (!redisSub) {
    throw new Error('Redis subscriber not initialized');
  }
  return redisSub;
}

/**
 * Gracefully close all Redis connections
 */
export async function closeRedis() {
  try {
    if (redisClient) await redisClient.quit();
    if (redisPub) await redisPub.quit();
    if (redisSub) await redisSub.quit();
    logger.info('Redis connections closed');
  } catch (error) {
    logger.error('Error closing Redis connections:', error);
  }
}

export default {
  initRedis,
  getRedisClient,
  getRedisPublisher,
  getRedisSubscriber,
  closeRedis,
};
