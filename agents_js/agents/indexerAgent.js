import { addProfessionals } from '../config/chromaClient.js';
import { nanoid } from 'nanoid';
import logger from '../utils/logger.js';

/**
 * IndexerAgent: Indexes professionals into ChromaDB
 */
class IndexerAgent {
  constructor() {
    this.name = 'IndexerAgent';
  }

  /**
   * Index professionals into the database
   */
  async process(professionals) {
    try {
      logger.info({ count: professionals.length }, 'IndexerAgent: Indexing professionals');

      // Add IDs if not present
      const prosWithIds = professionals.map(pro => ({
        id: pro.id || nanoid(),
        ...pro,
      }));

      // Store in ChromaDB
      await addProfessionals(prosWithIds);

      logger.info({ count: prosWithIds.length }, 'IndexerAgent: Professionals indexed');

      return {
        success: true,
        indexed: prosWithIds.length,
        professionalIds: prosWithIds.map(p => p.id),
      };
    } catch (error) {
      logger.error({ error, count: professionals.length }, 'IndexerAgent: Failed to index');
      throw error;
    }
  }
}

export default new IndexerAgent();
