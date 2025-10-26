import intakeAgent from './intakeAgent.js';
import scraperAgent from './scraperAgent.js';
import indexerAgent from './indexerAgent.js';
import matcherAgent from './matcherAgent.js';
import { publishProgress } from '../utils/events.js';
import logger from '../utils/logger.js';

/**
 * CoordinatorAgent: Orchestrates the entire job matching pipeline
 */
class CoordinatorAgent {
  constructor() {
    this.name = 'CoordinatorAgent';
  }

  /**
   * Run the full pipeline for a job
   */
  async process(job) {
    const { id: jobId } = job;

    try {
      logger.info({ jobId }, 'CoordinatorAgent: Starting pipeline');
      await publishProgress(jobId, 'started', 'Processing your request...');

      // Step 1: Intake - Analyze job request
      await publishProgress(jobId, 'intake', 'Analyzing your project requirements');

      let jobScope;
      try {
        const intakeResult = await intakeAgent.process(job);
        jobScope = intakeResult.scope;
        logger.info({ jobId, jobScope }, 'CoordinatorAgent: Intake complete');
      } catch (error) {
        // YOLO MODE: If AI fails, create a simple fallback jobScope
        logger.warn({ error, jobId }, 'CoordinatorAgent: Intake failed, using fallback scope');
        jobScope = {
          trade: 'General Contractor',
          services: ['general services'],
          urgency: 'normal',
          project_type: 'general',
          budget_hint: 'medium',
        };
        logger.info({ jobId, jobScope }, 'CoordinatorAgent: Using fallback scope');
      }

      // Step 2: Generate - Find professionals dynamically based on query
      await publishProgress(jobId, 'scrape', 'Finding professionals for your specific needs');

      let newProfessionals = [];
      try {
        const scrapeResult = await scraperAgent.process(jobScope, {
          city: job.city,
          state: job.state,
        });
        newProfessionals = scrapeResult.professionals;
        logger.info({ jobId, count: newProfessionals.length }, 'CoordinatorAgent: Professionals generated');
      } catch (error) {
        logger.error({ error, jobId }, 'CoordinatorAgent: Professional generation failed');
        throw error; // Don't continue without professionals
      }

      // Step 3: Index - Store generated professionals temporarily
      if (newProfessionals.length > 0) {
        await publishProgress(jobId, 'index', 'Indexing matched professionals');
        await indexerAgent.process(newProfessionals);
        logger.info({ jobId, count: newProfessionals.length }, 'CoordinatorAgent: Professionals indexed');
      } else {
        logger.warn({ jobId }, 'CoordinatorAgent: No professionals generated');
      }

      // Step 4: Match - Find best matches
      await publishProgress(jobId, 'match', 'Ranking the best matches for your project');
      const matchResult = await matcherAgent.process(jobId, jobScope, {
        city: job.city,
        state: job.state,
      });

      const { matches } = matchResult;

      // Complete
      await publishProgress(jobId, 'done', `Found ${matches.length} qualified professionals`, {
        matchCount: matches.length,
      });

      logger.info({ jobId, matchCount: matches.length }, 'CoordinatorAgent: Pipeline complete');

      return {
        success: true,
        jobId,
        matches,
        scope: jobScope,
      };
    } catch (error) {
      logger.error({ error, jobId }, 'CoordinatorAgent: Pipeline failed');
      await publishProgress(jobId, 'error', 'An error occurred processing your request', {
        error: error.message,
      });

      throw error;
    }
  }
}

export default new CoordinatorAgent();
