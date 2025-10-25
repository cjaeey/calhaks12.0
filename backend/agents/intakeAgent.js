import { analyzeJobRequest } from '../services/claudeClient.js';
import { storeJob } from '../config/chromaClient.js';
import logger from '../utils/logger.js';

/**
 * IntakeAgent: Analyzes job requests and extracts structured data
 */
class IntakeAgent {
  constructor() {
    this.name = 'IntakeAgent';
  }

  /**
   * Process a job request
   */
  async process(job) {
    try {
      logger.info({ jobId: job.id }, 'IntakeAgent: Processing job request');

      // Analyze the job request using Claude
      const jobScope = await analyzeJobRequest(job.prompt, job.photoUrls);

      // Enrich job with analyzed data
      const enrichedJob = {
        ...job,
        scope: jobScope,
        analyzedAt: new Date().toISOString(),
      };

      // Store in ChromaDB
      await storeJob(enrichedJob);

      logger.info({ jobId: job.id, scope: jobScope }, 'IntakeAgent: Job analyzed and stored');

      return {
        success: true,
        job: enrichedJob,
        scope: jobScope,
      };
    } catch (error) {
      logger.error({ error, jobId: job.id }, 'IntakeAgent: Failed to process job');
      throw error;
    }
  }
}

export default new IntakeAgent();
