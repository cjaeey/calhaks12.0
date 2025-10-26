import axios from 'axios';
import config from '../config/env.js';
import logger from '../utils/logger.js';

/**
 * Create Bright Data proxy configuration
 */
function getProxyConfig() {
  if (!config.BRIGHT_DATA_USERNAME || !config.BRIGHT_DATA_PASSWORD) {
    logger.warn('Bright Data credentials not configured - scraping will be disabled');
    return null;
  }

  const proxyUrl = `http://${config.BRIGHT_DATA_USERNAME}:${config.BRIGHT_DATA_PASSWORD}@${config.BRIGHT_DATA_PROXY}`;

  return {
    proxy: {
      host: config.BRIGHT_DATA_PROXY.split(':')[0],
      port: parseInt(config.BRIGHT_DATA_PROXY.split(':')[1], 10),
      auth: {
        username: config.BRIGHT_DATA_USERNAME,
        password: config.BRIGHT_DATA_PASSWORD,
      },
    },
  };
}

/**
 * Scrape contractor listings from a URL
 */
export async function scrapeContractors(searchParams) {
  const proxyConfig = getProxyConfig();

  if (!proxyConfig) {
    logger.warn('Scraping disabled - returning empty results');
    return [];
  }

  try {
    const { trade, city, state } = searchParams;

    // Example: Search Yelp-style listings
    // In production, this would use Bright Data's Web Scraper API or SERP API
    const searchUrl = `https://www.yelp.com/search?find_desc=${encodeURIComponent(trade)}&find_loc=${encodeURIComponent(`${city}, ${state}`)}`;

    logger.info({ searchUrl, trade, city, state }, 'Scraping contractors');

    const response = await axios.get(searchUrl, {
      ...proxyConfig,
      timeout: 30000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    // Parse HTML response (simplified - in production use cheerio or similar)
    const contractors = parseContractorListings(response.data);

    logger.info({ count: contractors.length, trade, city, state }, 'Contractors scraped');
    return contractors;
  } catch (error) {
    logger.error({ error, searchParams }, 'Failed to scrape contractors');
    return [];
  }
}

/**
 * Parse contractor data from HTML
 * NOTE: This is a placeholder - real implementation would use cheerio or similar
 */
function parseContractorListings(html) {
  // In production, parse actual HTML structure
  // For now, return mock structure that matches what we'd extract
  return [];
}

/**
 * Scrape detailed profile for a contractor
 */
export async function scrapeContractorProfile(profileUrl) {
  const proxyConfig = getProxyConfig();

  if (!proxyConfig) {
    return null;
  }

  try {
    logger.info({ profileUrl }, 'Scraping contractor profile');

    const response = await axios.get(profileUrl, {
      ...proxyConfig,
      timeout: 30000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    // Parse profile details
    const profile = parseContractorProfile(response.data);

    logger.info({ profileUrl, profile }, 'Profile scraped');
    return profile;
  } catch (error) {
    logger.error({ error, profileUrl }, 'Failed to scrape profile');
    return null;
  }
}

/**
 * Parse detailed contractor profile from HTML
 */
function parseContractorProfile(html) {
  // Placeholder for real parsing logic
  return {};
}

/**
 * Rate limiting helper
 */
let requestQueue = [];
let processing = false;

async function queueRequest(requestFn) {
  return new Promise((resolve, reject) => {
    requestQueue.push({ requestFn, resolve, reject });
    processQueue();
  });
}

async function processQueue() {
  if (processing || requestQueue.length === 0) {
    return;
  }

  processing = true;

  while (requestQueue.length > 0) {
    const { requestFn, resolve, reject } = requestQueue.shift();

    try {
      const result = await requestFn();
      resolve(result);
    } catch (error) {
      reject(error);
    }

    // Rate limit: wait between requests
    await new Promise(r => setTimeout(r, 1000));
  }

  processing = false;
}

export default {
  scrapeContractors,
  scrapeContractorProfile,
  queueRequest,
};
