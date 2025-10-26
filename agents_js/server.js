import express from 'express';
import cors from 'cors';
import config from './config/env.js';
import { initChromaDB } from './config/chromaClient.js';
import { initRedis, closeRedis } from './config/redisClient.js';
import logger from './utils/logger.js';

// Routes
import jobsRouter from './routes/jobs.js';
import prosRouter from './routes/pros.js';

const app = express();

// Middleware
app.use(cors({
  origin: typeof config.CORS_ORIGINS === 'string'
    ? config.CORS_ORIGINS.split(',').map(o => o.trim())
    : config.CORS_ORIGINS,
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Request logging
app.use((req, res, next) => {
  logger.info({ method: req.method, path: req.path }, 'Incoming request');
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: config.NODE_ENV,
  });
});

// API Routes
app.use('/api/jobs', jobsRouter);
app.use('/api/pros', prosRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handler
app.use((err, req, res, next) => {
  logger.error({ error: err }, 'Unhandled error');
  res.status(500).json({
    error: 'Internal server error',
    message: config.isDevelopment ? err.message : undefined,
  });
});

/**
 * Initialize services and start server
 */
async function start() {
  try {
    logger.info('Starting ReNOVA backend...');

    // Initialize ChromaDB
    await initChromaDB();
    logger.info('ChromaDB initialized');

    // Initialize Redis
    initRedis();
    logger.info('Redis initialized');

    // Start server
    app.listen(config.PORT, () => {
      logger.info(
        {
          port: config.PORT,
          environment: config.NODE_ENV,
        },
        'Server listening'
      );
      console.log(`\n✅ ReNOVA backend running on http://localhost:${config.PORT}`);
      console.log(`📚 API endpoints:`);
      console.log(`   POST   /api/jobs`);
      console.log(`   GET    /api/jobs/:id`);
      console.log(`   GET    /api/jobs/:id/events (SSE)`);
      console.log(`   GET    /api/jobs/:id/results`);
      console.log(`   GET    /api/pros`);
      console.log(`   GET    /api/pros/:id\n`);
    });
  } catch (error) {
    logger.error({ error }, 'Failed to start server');
    process.exit(1);
  }
}

/**
 * Graceful shutdown
 */
async function shutdown() {
  logger.info('Shutting down...');
  await closeRedis();
  process.exit(0);
}

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

// Start the server
start();
