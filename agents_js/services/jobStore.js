import { getRedisClient } from '../config/redisClient.js';
import logger from '../utils/logger.js';

const JOB_PREFIX = 'job:';
const JOB_TTL = 60 * 60 * 24 * 7; // 7 days

/**
 * Store a job in Redis
 */
export async function storeJob(job) {
  try {
    const redis = getRedisClient();
    const key = `${JOB_PREFIX}${job.id}`;
    await redis.set(key, JSON.stringify(job), 'EX', JOB_TTL);
    logger.info({ jobId: job.id }, 'Job stored in Redis');
    return job;
  } catch (error) {
    logger.error({ error, jobId: job.id }, 'Failed to store job in Redis');
    throw error;
  }
}

/**
 * Get a job from Redis
 */
export async function getJob(jobId) {
  try {
    const redis = getRedisClient();
    const key = `${JOB_PREFIX}${jobId}`;
    const data = await redis.get(key);

    if (!data) {
      return null;
    }

    return JSON.parse(data);
  } catch (error) {
    logger.error({ error, jobId }, 'Failed to get job from Redis');
    throw error;
  }
}

/**
 * Update a job in Redis
 */
export async function updateJob(jobId, updates) {
  try {
    const job = await getJob(jobId);

    if (!job) {
      throw new Error(`Job ${jobId} not found`);
    }

    const updatedJob = { ...job, ...updates };
    await storeJob(updatedJob);

    logger.info({ jobId, updates: Object.keys(updates) }, 'Job updated in Redis');
    return updatedJob;
  } catch (error) {
    logger.error({ error, jobId }, 'Failed to update job in Redis');
    throw error;
  }
}

/**
 * Delete a job from Redis
 */
export async function deleteJob(jobId) {
  try {
    const redis = getRedisClient();
    const key = `${JOB_PREFIX}${jobId}`;
    await redis.del(key);
    logger.info({ jobId }, 'Job deleted from Redis');
  } catch (error) {
    logger.error({ error, jobId }, 'Failed to delete job from Redis');
    throw error;
  }
}

export default {
  storeJob,
  getJob,
  updateJob,
  deleteJob,
};
