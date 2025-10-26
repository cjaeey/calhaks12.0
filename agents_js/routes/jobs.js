import express from 'express';
import { nanoid } from 'nanoid';
import coordinatorAgent from '../agents/coordinatorAgent.js';
import { getRedisClient, getRedisSubscriber } from '../config/redisClient.js';
import { getMatches } from '../config/chromaClient.js';
import { storeJob, getJob, updateJob } from '../services/jobStore.js';
import logger from '../utils/logger.js';

const router = express.Router();

/**
 * Process job asynchronously in the background
 */
async function processJobAsync(jobId, job) {
  try {
    // Update job status
    await updateJob(jobId, { status: 'processing' });

    // Process the job through the agent pipeline
    const result = await coordinatorAgent.process(job);

    // Update job with results
    await updateJob(jobId, {
      status: 'completed',
      result,
      completedAt: new Date().toISOString(),
    });

    logger.info({ jobId, matchCount: result.matches?.length }, 'Job completed successfully');
  } catch (error) {
    // Update job with error
    await updateJob(jobId, {
      status: 'failed',
      error: error.message,
      failedAt: new Date().toISOString(),
    });

    logger.error({ error, jobId }, 'Job processing failed');
  }
}

/**
 * POST /api/jobs - Create a new job
 */
router.post('/', async (req, res) => {
  try {
    const { prompt, photoUrls = [], city, state, zipCode } = req.body;

    if (!prompt || !city || !state) {
      return res.status(400).json({
        error: 'Missing required fields: prompt, city, state',
      });
    }

    const jobId = nanoid();
    const job = {
      id: jobId,
      prompt,
      photoUrls,
      city,
      state,
      zipCode,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    // Store job in Redis
    await storeJob(job);
    logger.info({ jobId, city, state }, 'New job created');

    // Return job ID immediately and process in background
    res.status(201).json({
      jobId,
      message: 'Job created and processing started',
      status: 'pending',
    });

    // Process job asynchronously (don't await)
    processJobAsync(jobId, job).catch(err => {
      logger.error({ error: err, jobId }, 'Async job processing error');
    });
  } catch (error) {
    logger.error({ error }, 'Failed to create job');
    res.status(500).json({ error: 'Failed to create job' });
  }
});

/**
 * GET /api/jobs/:id - Get job status
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const job = await getJob(id);

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    res.json(job);
  } catch (error) {
    logger.error({ error }, 'Failed to get job');
    res.status(500).json({ error: 'Failed to get job' });
  }
});

/**
 * GET /api/jobs/:id/events - SSE stream for job progress
 */
router.get('/:id/events', async (req, res) => {
  const { id: jobId } = req.params;

  try {
    const job = await getJob(jobId);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    // Set up SSE
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no'); // Disable nginx buffering

    logger.info({ jobId }, 'Client connected to SSE stream');

    // Send initial connection event
    res.write(`data: ${JSON.stringify({ stage: 'connected', message: 'Connected to progress stream' })}\n\n`);

    // Subscribe to Redis pub/sub for this job
    const subscriber = getRedisSubscriber();
    const channel = `job:${jobId}:progress`;

    const messageHandler = (ch, message) => {
      if (ch === channel) {
        try {
          const event = JSON.parse(message);
          res.write(`data: ${JSON.stringify(event)}\n\n`);

          // Close stream when done
          if (event.stage === 'done' || event.stage === 'error') {
            setTimeout(() => {
              res.end();
            }, 1000);
          }
        } catch (error) {
          logger.error({ error, message }, 'Failed to parse progress event');
        }
      }
    };

    subscriber.on('message', messageHandler);
    subscriber.subscribe(channel);

    // Handle client disconnect
    req.on('close', () => {
      subscriber.unsubscribe(channel);
      subscriber.off('message', messageHandler);
      logger.info({ jobId }, 'Client disconnected from SSE stream');
    });
  } catch (error) {
    logger.error({ error, jobId }, 'SSE stream error');
    res.status(500).end();
  }
});

/**
 * GET /api/jobs/:id/results - Get match results
 */
router.get('/:id/results', async (req, res) => {
  try {
    const { id: jobId } = req.params;

    const job = await getJob(jobId);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    if (job.status !== 'completed') {
      return res.status(202).json({
        status: job.status,
        message: 'Job not yet completed',
      });
    }

    // Get matches from ChromaDB
    const matchesData = await getMatches(jobId);

    // Transform ChromaDB results
    const matches = matchesData.ids.map((id, index) => {
      const metadata = matchesData.metadatas[index];
      return {
        id: metadata.professional_id,
        score: metadata.score,
        reason: metadata.reason,
        createdAt: metadata.created_at,
      };
    });

    res.json({
      jobId,
      status: job.status,
      matches,
      count: matches.length,
    });
  } catch (error) {
    logger.error({ error }, 'Failed to get results');
    res.status(500).json({ error: 'Failed to get results' });
  }
});

export default router;
