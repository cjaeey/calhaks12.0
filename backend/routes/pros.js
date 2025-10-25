import express from 'express';
import { getCollection } from '../config/chromaClient.js';
import logger from '../utils/logger.js';

const router = express.Router();

/**
 * GET /api/pros - List all professionals
 */
router.get('/', async (req, res) => {
  try {
    const { trade, city, state, limit = 50 } = req.query;

    const collection = getCollection('professionals');

    // Build filters
    const where = {};
    if (trade) where.trade = trade;
    if (city) where.city = city;
    if (state) where.state = state;

    // Get professionals
    const results = await collection.get({
      where: Object.keys(where).length > 0 ? where : undefined,
      limit: parseInt(limit, 10),
    });

    const professionals = results.ids.map((id, index) => {
      const metadata = results.metadatas[index];
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
      };
    });

    res.json({
      professionals,
      count: professionals.length,
    });
  } catch (error) {
    logger.error({ error }, 'Failed to list professionals');
    res.status(500).json({ error: 'Failed to list professionals' });
  }
});

/**
 * GET /api/pros/:id - Get professional details
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const collection = getCollection('professionals');

    const results = await collection.get({
      ids: [id],
    });

    if (results.ids.length === 0) {
      return res.status(404).json({ error: 'Professional not found' });
    }

    const metadata = results.metadatas[0];
    const professional = {
      id: results.ids[0],
      name: metadata.name,
      trade: metadata.trade,
      city: metadata.city,
      state: metadata.state,
      services: JSON.parse(metadata.services || '[]'),
      rating: metadata.rating || 0,
      price_band: metadata.price_band || 'medium',
      license: metadata.license || '',
      website: metadata.website || '',
    };

    res.json(professional);
  } catch (error) {
    logger.error({ error }, 'Failed to get professional');
    res.status(500).json({ error: 'Failed to get professional' });
  }
});

export default router;
