import { generateProfessionals } from '../services/professionalGenerator.js';
import logger from '../utils/logger.js';

/**
 * ScraperAgent: Finds professionals for a job using AI-powered generation
 *
 * This agent dynamically generates contextually relevant professionals
 * based on the job requirements rather than scraping static databases.
 */
class ScraperAgent {
  constructor() {
    this.name = 'ScraperAgent';
  }

  /**
   * Find professionals based on job scope
   *
   * Uses AI to generate realistic, contextually relevant professionals
   * that match the job requirements. Falls back to template-based
   * generation if AI is unavailable.
   */
  async process(jobScope, location, options = {}) {
    try {
      logger.info({ jobScope, location }, 'ScraperAgent: Finding professionals');

      const { count = 8 } = options;

      // Generate professionals dynamically based on the job
      const professionals = await generateProfessionals(jobScope, location, {
        count,
      });

      logger.info(
        {
          count: professionals.length,
          trade: jobScope.trade,
          location: `${location.city}, ${location.state}`,
        },
        'ScraperAgent: Professionals generated'
      );

      return {
        success: true,
        professionals,
        generatedAt: new Date().toISOString(),
      };
    } catch (error) {
      logger.error({ error, jobScope }, 'ScraperAgent: Failed to find professionals');
      throw error;
    }
  }
}

export default new ScraperAgent();
