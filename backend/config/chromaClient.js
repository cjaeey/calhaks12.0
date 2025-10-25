import { ChromaClient } from 'chromadb';
import config from './env.js';
import logger from '../utils/logger.js';

let client = null;
let collections = {};

/**
 * Initialize ChromaDB client and collections
 */
export async function initChromaDB() {
  try {
    // Initialize client
    client = new ChromaClient({
      path: `http://${config.CHROMA_HOST}:${config.CHROMA_PORT}`,
    });

    logger.info('ChromaDB client initialized');

    // Initialize collections
    await initCollections();

    logger.info('ChromaDB collections ready');
    return client;
  } catch (error) {
    logger.error('Failed to initialize ChromaDB:', error);
    throw error;
  }
}

/**
 * Initialize or get existing collections
 */
async function initCollections() {
  try {
    // Professionals collection
    collections.professionals = await client.getOrCreateCollection({
      name: 'professionals',
      metadata: {
        description: 'Licensed building professionals with their services and ratings',
      },
    });

    // Jobs collection
    collections.jobs = await client.getOrCreateCollection({
      name: 'jobs',
      metadata: {
        description: 'Customer job requests with requirements and location',
      },
    });

    // Matches collection
    collections.matches = await client.getOrCreateCollection({
      name: 'matches',
      metadata: {
        description: 'Job-to-professional matches with scores and reasoning',
      },
    });

    logger.info('Collections initialized:', Object.keys(collections));
  } catch (error) {
    logger.error('Failed to initialize collections:', error);
    throw error;
  }
}

/**
 * Get a collection by name
 */
export function getCollection(name) {
  if (!collections[name]) {
    throw new Error(`Collection ${name} not initialized`);
  }
  return collections[name];
}

/**
 * Get the ChromaDB client
 */
export function getClient() {
  if (!client) {
    throw new Error('ChromaDB client not initialized');
  }
  return client;
}

/**
 * Add professionals to the collection
 */
export async function addProfessionals(professionals) {
  const collection = getCollection('professionals');

  const ids = professionals.map(p => p.id);
  const documents = professionals.map(p =>
    `${p.name} - ${p.trade} in ${p.city}, ${p.state}. Services: ${p.services.join(', ')}. ${p.bio || ''}`
  );
  const metadatas = professionals.map(p => ({
    name: p.name,
    trade: p.trade,
    city: p.city,
    state: p.state,
    license: p.license || '',
    price_band: p.price_band || 'medium',
    rating: p.rating || 0,
    services: JSON.stringify(p.services),
    website: p.website || '',
  }));

  await collection.add({
    ids,
    documents,
    metadatas,
  });

  logger.info(`Added ${professionals.length} professionals to ChromaDB`);
}

/**
 * Query professionals by embedding similarity
 */
export async function queryProfessionals(queryText, filters = {}, nResults = 10) {
  const collection = getCollection('professionals');

  const results = await collection.query({
    queryTexts: [queryText],
    nResults,
    where: filters,
  });

  return results;
}

/**
 * Store a job request
 */
export async function storeJob(job) {
  const collection = getCollection('jobs');

  await collection.add({
    ids: [job.id],
    documents: [job.prompt],
    metadatas: [{
      job_id: job.id,
      trade_hint: job.trade || '',
      urgency: job.urgency || 'normal',
      location: `${job.city}, ${job.state}`,
      created_at: new Date().toISOString(),
    }],
  });

  logger.info(`Stored job ${job.id} in ChromaDB`);
}

/**
 * Store match results
 */
export async function storeMatches(jobId, matches) {
  const collection = getCollection('matches');

  const ids = matches.map((m, i) => `${jobId}_match_${i}`);
  const documents = matches.map(m => m.reason || '');
  const metadatas = matches.map(m => ({
    job_id: jobId,
    professional_id: m.professional_id,
    score: m.score,
    reason: m.reason || '',
    created_at: new Date().toISOString(),
  }));

  await collection.add({
    ids,
    documents,
    metadatas,
  });

  logger.info(`Stored ${matches.length} matches for job ${jobId}`);
}

/**
 * Get matches for a job
 */
export async function getMatches(jobId) {
  const collection = getCollection('matches');

  const results = await collection.get({
    where: { job_id: jobId },
  });

  return results;
}

export default {
  initChromaDB,
  getCollection,
  getClient,
  addProfessionals,
  queryProfessionals,
  storeJob,
  storeMatches,
  getMatches,
};
