import { getRedisPublisher } from '../config/redisClient.js';
import logger from './logger.js';

/**
 * Publish progress event for a job
 * @param {string} jobId - The job ID
 * @param {string} stage - Current stage (intake, scrape, index, match, done, error)
 * @param {string} message - Human-readable status message
 * @param {object} data - Additional data to include
 */
export async function publishProgress(jobId, stage, message, data = {}) {
  try {
    const redis = getRedisPublisher();
    const event = {
      jobId,
      stage,
      message,
      timestamp: new Date().toISOString(),
      ...data,
    };

    await redis.publish(`job:${jobId}:progress`, JSON.stringify(event));
    logger.info({ jobId, stage, message }, 'Progress event published');
  } catch (error) {
    logger.error({ error, jobId, stage }, 'Failed to publish progress');
  }
}

/**
 * Subscribe to job progress events
 * @param {string} jobId - The job ID to subscribe to
 * @param {function} callback - Callback function to handle events
 */
export function subscribeToJobProgress(jobId, callback) {
  const redis = getRedisPublisher();
  const channel = `job:${jobId}:progress`;

  redis.subscribe(channel, (err) => {
    if (err) {
      logger.error({ error: err, jobId }, 'Failed to subscribe to job progress');
      return;
    }
    logger.info({ jobId }, 'Subscribed to job progress');
  });

  redis.on('message', (ch, message) => {
    if (ch === channel) {
      try {
        const event = JSON.parse(message);
        callback(event);
      } catch (error) {
        logger.error({ error, message }, 'Failed to parse progress event');
      }
    }
  });

  return () => {
    redis.unsubscribe(channel);
    logger.info({ jobId }, 'Unsubscribed from job progress');
  };
}

export default {
  publishProgress,
  subscribeToJobProgress,
};
