import { queryProfessionals } from '../config/chromaClient.js';
import { reRankMatches } from './claudeClient.js';
import { createSearchQuery } from './embeddingService.js';
import logger from '../utils/logger.js';

/**
 * Find matching professionals for a job
 */
export async function findMatches(jobScope, location, options = {}) {
  const { maxResults = 20 } = options;

  try {
    // Create search query from job scope
    const searchQuery = createSearchQuery(jobScope);
    logger.info({ searchQuery, jobScope }, 'Searching for professionals');

    // Build filters
    const filters = {};
    if (location.state) {
      filters.state = location.state;
    }

    // Query ChromaDB for vector similarity
    const vectorResults = await queryProfessionals(searchQuery, filters, maxResults);

    // Transform results into candidates
    const candidates = vectorResults.ids[0].map((id, index) => {
      const metadata = vectorResults.metadatas[0][index];
      return {
        id,
        name: metadata.name,
        trade: metadata.trade,
        city: metadata.city,
        state: metadata.state,
        services: JSON.parse(metadata.services || '[]'),
        rating: metadata.rating || 0,
        price_band: metadata.price_band || 'medium',
        license: metadata.license || '',
        website: metadata.website || '',
        initial_score: vectorResults.distances?.[0]?.[index] || 0,
      };
    });

    logger.info({ candidateCount: candidates.length }, 'Initial candidates found');

    // Use Claude to re-rank and explain matches
    let finalMatches;
    try {
      const rankedMatches = await reRankMatches(jobScope, candidates);

      // Merge ranked results with candidate data
      finalMatches = rankedMatches.map(match => {
        const candidate = candidates.find(c => c.id === match.professional_id);
        return {
          ...candidate,
          score: match.score,
          reason: match.reason,
          concerns: match.concerns,
        };
      });
      logger.info({ matchCount: finalMatches.length }, 'Matches ranked and ready');
    } catch (error) {
      // YOLO MODE: If AI re-ranking fails, return candidates with default scores
      logger.warn({ error }, 'Failed to re-rank with AI, using default scoring');
      finalMatches = candidates.map(candidate => ({
        ...candidate,
        score: Math.min(95, Math.round(70 + (candidate.rating || 3) * 5)),
        reason: `${candidate.name} is a qualified ${candidate.trade} professional in your area with ${candidate.rating || 'good'} ratings.`,
        concerns: null,
      }));
      logger.info({ matchCount: finalMatches.length }, 'Matches ready (fallback mode)');
    }

    return finalMatches;
  } catch (error) {
    logger.error({ error, jobScope }, 'Failed to find matches');
    throw error;
  }
}

/**
 * Apply business logic filters
 */
export function applyBusinessFilters(matches, jobScope) {
  return matches.filter(match => {
    // Filter by minimum score
    if (match.score < 60) {
      return false;
    }

    // Ensure trade matches (skip for fallback mode with "General Contractor")
    if (jobScope.trade !== 'General Contractor' &&
        match.trade.toLowerCase() !== jobScope.trade.toLowerCase()) {
      return false;
    }

    // For emergency jobs, prefer higher ratings
    if (jobScope.urgency === 'emergency' && match.rating < 4.0) {
      return false;
    }

    return true;
  });
}

/**
 * Sort matches by score and rating
 */
export function sortMatches(matches) {
  return matches.sort((a, b) => {
    // Primary: by score
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    // Secondary: by rating
    return (b.rating || 0) - (a.rating || 0);
  });
}

export default {
  findMatches,
  applyBusinessFilters,
  sortMatches,
};
