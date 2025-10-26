import logger from '../utils/logger.js';

/**
 * Generate embeddings for text
 * NOTE: ChromaDB has built-in embedding generation, so we rely on that
 * This service is a placeholder for custom embedding logic if needed
 */

/**
 * Prepare text for embedding
 */
export function prepareTextForEmbedding(data) {
  if (typeof data === 'string') {
    return data;
  }

  // For objects, create a rich text representation
  if (typeof data === 'object') {
    return Object.entries(data)
      .filter(([key, value]) => value != null)
      .map(([key, value]) => {
        if (Array.isArray(value)) {
          return `${key}: ${value.join(', ')}`;
        }
        return `${key}: ${value}`;
      })
      .join('. ');
  }

  return String(data);
}

/**
 * Create a search query from job scope
 */
export function createSearchQuery(jobScope) {
  const parts = [
    jobScope.trade,
    ...jobScope.services,
    jobScope.project_type,
  ];

  if (jobScope.urgency === 'emergency') {
    parts.push('emergency service', '24/7 available');
  }

  if (jobScope.budget_hint) {
    parts.push(`${jobScope.budget_hint} budget`);
  }

  return parts.filter(Boolean).join(' ');
}

/**
 * Calculate similarity score (if needed for custom logic)
 */
export function calculateSimilarity(vec1, vec2) {
  // Cosine similarity
  let dotProduct = 0;
  let mag1 = 0;
  let mag2 = 0;

  for (let i = 0; i < vec1.length; i++) {
    dotProduct += vec1[i] * vec2[i];
    mag1 += vec1[i] * vec1[i];
    mag2 += vec2[i] * vec2[i];
  }

  mag1 = Math.sqrt(mag1);
  mag2 = Math.sqrt(mag2);

  if (mag1 === 0 || mag2 === 0) {
    return 0;
  }

  return dotProduct / (mag1 * mag2);
}

export default {
  prepareTextForEmbedding,
  createSearchQuery,
  calculateSimilarity,
};
