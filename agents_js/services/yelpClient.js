import axios from 'axios';
import config from '../config/env.js';
import logger from '../utils/logger.js';

/**
 * Yelp Fusion API Client
 *
 * Get your FREE API key at: https://www.yelp.com/developers/v3/manage_app
 * Free tier: 500 API calls per day
 */

const YELP_API_BASE = 'https://api.yelp.com/v3';

// Trade to Yelp category mapping
const TRADE_CATEGORIES = {
  'HVAC': 'hvac',
  'Plumbing': 'plumbing',
  'Electrical': 'electricians',
  'Remodeling': 'contractors',
  'Handyman': 'handyman',
  'General Contractor': 'contractors',
};

/**
 * Search for professionals on Yelp
 */
export async function searchYelpProfessionals(trade, location, options = {}) {
  const { limit = 20, radius = 16093 } = options; // 16093 meters = 10 miles

  // Check if API key is configured
  if (!config.YELP_API_KEY) {
    logger.warn('Yelp API key not configured');
    return [];
  }

  try {
    const category = TRADE_CATEGORIES[trade] || 'contractors';
    const locationString = `${location.city}, ${location.state}`;

    logger.info(
      { trade, category, location: locationString, limit },
      'Searching Yelp for professionals'
    );

    const response = await axios.get(`${YELP_API_BASE}/businesses/search`, {
      headers: {
        Authorization: `Bearer ${config.YELP_API_KEY}`,
      },
      params: {
        categories: category,
        location: locationString,
        limit,
        radius,
        sort_by: 'rating', // Sort by highest rated
      },
    });

    const businesses = response.data.businesses || [];

    logger.info(
      { count: businesses.length, trade, location: locationString },
      'Yelp professionals found'
    );

    // Transform Yelp data to our format
    return businesses.map(business => ({
      // Yelp data
      yelpId: business.id,
      name: business.name,
      rating: business.rating,
      reviewCount: business.review_count,
      phone: business.phone || business.display_phone,
      yelpUrl: business.url,

      // Location
      address: business.location?.address1,
      city: business.location?.city,
      state: business.location?.state,
      zipCode: business.location?.zip_code,

      // Categories (Yelp returns multiple)
      categories: business.categories?.map(c => c.title) || [],

      // Price level ($ to $$$$)
      priceLevel: business.price,

      // Coordinates
      latitude: business.coordinates?.latitude,
      longitude: business.coordinates?.longitude,

      // Business info
      imageUrl: business.image_url,
      isClosed: business.is_closed,

      // Additional
      distance: business.distance, // meters from search location
    }));
  } catch (error) {
    if (error.response?.status === 401) {
      logger.error('Yelp API authentication failed - invalid API key');
    } else if (error.response?.status === 429) {
      logger.error('Yelp API rate limit exceeded');
    } else {
      logger.error({ error: error.message }, 'Yelp API request failed');
    }

    return [];
  }
}

/**
 * Get detailed business information
 */
export async function getYelpBusinessDetails(businessId) {
  if (!config.YELP_API_KEY) {
    return null;
  }

  try {
    logger.info({ businessId }, 'Fetching Yelp business details');

    const response = await axios.get(`${YELP_API_BASE}/businesses/${businessId}`, {
      headers: {
        Authorization: `Bearer ${config.YELP_API_KEY}`,
      },
    });

    return response.data;
  } catch (error) {
    logger.error({ error: error.message, businessId }, 'Failed to fetch Yelp business details');
    return null;
  }
}

/**
 * Transform Yelp professional to our database format
 */
export function transformYelpToDatabase(yelpBusiness, trade) {
  // Map Yelp price to our price bands
  const priceToBand = {
    '$': 'low',
    '$$': 'medium',
    '$$$': 'high',
    '$$$$': 'premium',
  };

  return {
    name: yelpBusiness.name,
    trade,
    city: yelpBusiness.city,
    state: yelpBusiness.state,
    services: yelpBusiness.categories || [],
    rating: yelpBusiness.rating || 0,
    price_band: priceToBand[yelpBusiness.priceLevel] || 'medium',
    license: '', // Yelp doesn't provide license numbers
    website: yelpBusiness.yelpUrl,
    phone: yelpBusiness.phone,
    address: yelpBusiness.address,
    zipCode: yelpBusiness.zipCode,

    // Extra Yelp-specific data
    yelpId: yelpBusiness.yelpId,
    reviewCount: yelpBusiness.reviewCount,
    imageUrl: yelpBusiness.imageUrl,
    distance: yelpBusiness.distance,
  };
}

export default {
  searchYelpProfessionals,
  getYelpBusinessDetails,
  transformYelpToDatabase,
};
