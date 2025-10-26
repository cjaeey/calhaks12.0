import { findMatches, applyBusinessFilters, sortMatches } from '../services/matchingService.js';
import { storeMatches } from '../config/chromaClient.js';
import logger from '../utils/logger.js';

/**
 * MatcherAgent: Finds and ranks matching professionals
 */
class MatcherAgent {
  constructor() {
    this.name = 'MatcherAgent';
  }

  /**
   * Find matching professionals for a job
   */
  async process(jobId, jobScope, location) {
    try {
      logger.info({ jobId, jobScope }, 'MatcherAgent: Finding matches');

      // Find matches using vector similarity + Claude re-ranking
      let matches = await findMatches(jobScope, location, { maxResults: 20 });

      // Apply business logic filters
      matches = applyBusinessFilters(matches, jobScope);

      // Sort by score and rating
      matches = sortMatches(matches);

      // Take top 10
      const topMatches = matches.slice(0, 10);

      // Store matches in ChromaDB
      const matchRecords = topMatches.map(m => ({
        professional_id: m.id,
        score: m.score,
        reason: m.reason,
        concerns: m.concerns,
      }));

      await storeMatches(jobId, matchRecords);

      logger.info({ jobId, count: topMatches.length }, 'MatcherAgent: Matches found and stored');

      return {
        success: true,
        matches: topMatches,
        count: topMatches.length,
      };
    } catch (error) {
      logger.error({ error, jobId }, 'MatcherAgent: Failed to find matches');
      throw error;
    }
  }
}

export default new MatcherAgent();
