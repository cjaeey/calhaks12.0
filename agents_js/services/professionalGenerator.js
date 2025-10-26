import { nanoid } from 'nanoid';
import logger from '../utils/logger.js';
import { searchYelpProfessionals, transformYelpToDatabase } from './yelpClient.js';

/**
 * Trade-specific business name generators
 */
const BUSINESS_NAME_TEMPLATES = {
  HVAC: ['Climate Control', 'Air Systems', 'Comfort Solutions', 'Temperature Pro', 'Cool Breeze', 'Heating & Cooling'],
  Plumbing: ['Flow', 'Pipeline', 'Drain Master', 'Water Works', 'Pipe Pro', 'Leak Busters'],
  Electrical: ['Power Up', 'Bright Spark', 'Current', 'Volt', 'Lightning', 'Circuit Pro'],
  Remodeling: ['Home Builders', 'Renovation Pro', 'Design & Build', 'Modern Homes', 'Dream Spaces'],
  Handyman: ['Fix-It', 'Handy Pro', 'Home Repair', 'All-Purpose', 'Property Maintenance'],
  'General Contractor': ['Construction Co', 'Build Right', 'Premier Contractors', 'Master Builders', 'Quality Construction'],
};

const PREFIXES = ['Bay Area', 'Golden State', 'Elite', 'Premier', 'Expert', 'Pro', 'Quality', 'Reliable', 'Fast', 'Trusted'];
const SUFFIXES = ['Services', 'Solutions', 'Experts', 'Professionals', 'Specialists', 'Group', 'Team'];

/**
 * Service generators by trade
 */
const TRADE_SERVICES = {
  HVAC: ['AC Installation', 'AC Repair', 'Heating Installation', 'Heating Repair', 'Duct Cleaning', 'Maintenance', 'Emergency Service', 'Smart Thermostat', 'Air Quality'],
  Plumbing: ['Leak Repair', 'Drain Cleaning', 'Water Heater', 'Pipe Replacement', 'Emergency Service', 'Sewer Line', 'Fixture Installation', 'Repiping'],
  Electrical: ['Wiring', 'Panel Upgrades', 'Outlet Installation', 'Lighting', 'Ceiling Fans', 'Safety Inspections', 'Emergency Repair', 'EV Charger Installation'],
  Remodeling: ['Kitchen Remodel', 'Bathroom Remodel', 'Room Addition', 'Whole House Renovation', 'Flooring', 'Painting', 'Cabinetry', 'Custom Carpentry'],
  Handyman: ['General Repairs', 'Painting', 'Drywall', 'Furniture Assembly', 'Small Projects', 'Home Maintenance', 'Installation', 'Seasonal Services'],
  'General Contractor': ['New Construction', 'Renovations', 'Project Management', 'Design-Build', 'Commercial', 'Residential'],
};

/**
 * Generate realistic business name
 */
function generateBusinessName(trade) {
  const templates = BUSINESS_NAME_TEMPLATES[trade] || BUSINESS_NAME_TEMPLATES['General Contractor'];
  const prefix = PREFIXES[Math.floor(Math.random() * PREFIXES.length)];
  const template = templates[Math.floor(Math.random() * templates.length)];
  const suffix = Math.random() > 0.5 ? ` ${SUFFIXES[Math.floor(Math.random() * SUFFIXES.length)]}` : '';

  return `${prefix} ${template}${suffix}`;
}

/**
 * Generate services for a trade
 */
function generateServices(trade, count = 4) {
  const services = TRADE_SERVICES[trade] || TRADE_SERVICES['General Contractor'];
  const shuffled = [...services].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, services.length));
}

/**
 * Generate realistic rating
 */
function generateRating(minRating = 4.0) {
  return parseFloat((minRating + Math.random() * (5.0 - minRating)).toFixed(1));
}

/**
 * Generate license number
 */
function generateLicense(trade, state) {
  const tradeCode = {
    HVAC: 'HVAC',
    Plumbing: 'PLB',
    Electrical: 'ELEC',
    Remodeling: 'GC',
    Handyman: 'HM',
    'General Contractor': 'GC',
  }[trade] || 'CONT';

  const number = Math.floor(10000 + Math.random() * 90000);
  return `${tradeCode}-${state}-${number}`;
}

/**
 * Generate website URL
 */
function generateWebsite(businessName) {
  const slug = businessName.toLowerCase()
    .replace(/[^a-z0-9]+/g, '')
    .substring(0, 20);
  return `https://${slug}.example.com`;
}

/**
 * Generate price band
 */
function generatePriceBand() {
  const rand = Math.random();
  if (rand < 0.2) return 'low';
  if (rand < 0.7) return 'medium';
  if (rand < 0.9) return 'high';
  return 'premium';
}

/**
 * Generate nearby city for the given location
 */
function generateNearbyCity(baseCity, state) {
  const cityVariants = {
    'San Francisco': ['San Francisco', 'Oakland', 'Berkeley', 'Daly City', 'South San Francisco'],
    'Oakland': ['Oakland', 'San Francisco', 'Berkeley', 'Alameda', 'Emeryville'],
    'Berkeley': ['Berkeley', 'Oakland', 'San Francisco', 'Albany', 'El Cerrito'],
    'San Jose': ['San Jose', 'Santa Clara', 'Sunnyvale', 'Mountain View', 'Milpitas'],
    'Los Angeles': ['Los Angeles', 'Santa Monica', 'Pasadena', 'Glendale', 'Burbank'],
  };

  const variants = cityVariants[baseCity] || [baseCity];
  return variants[Math.floor(Math.random() * variants.length)];
}


/**
 * Generate professionals using templates (fallback)
 */
function generateWithTemplates(jobScope, location, count = 8) {
  const professionals = [];

  for (let i = 0; i < count; i++) {
    const name = generateBusinessName(jobScope.trade);
    const city = generateNearbyCity(location.city, location.state);
    const rating = generateRating(i < 2 ? 4.5 : 4.0); // First 2 have higher ratings
    const priceBand = generatePriceBand();
    const services = generateServices(jobScope.trade, 4 + Math.floor(Math.random() * 3));

    professionals.push({
      id: nanoid(),
      name,
      trade: jobScope.trade,
      city,
      state: location.state,
      services,
      rating,
      price_band: priceBand,
      license: generateLicense(jobScope.trade, location.state),
      website: generateWebsite(name),
    });
  }

  return professionals;
}

/**
 * Main function: Find professionals for a job
 *
 * Strategy:
 * 1. Try to fetch REAL professionals from Yelp API
 * 2. If Yelp unavailable/fails, generate with templates
 */
export async function generateProfessionals(jobScope, location, options = {}) {
  const { count = 8 } = options;

  try {
    logger.info(
      {
        trade: jobScope.trade,
        location: `${location.city}, ${location.state}`,
        services: jobScope.services,
        count,
      },
      'Finding professionals'
    );

    // Step 1: Try Yelp API for REAL professionals
    try {
      const yelpResults = await searchYelpProfessionals(jobScope.trade, location, {
        limit: count,
      });

      if (yelpResults && yelpResults.length > 0) {
        const professionals = yelpResults.map(yelpBiz => {
          const transformed = transformYelpToDatabase(yelpBiz, jobScope.trade);
          return {
            id: nanoid(),
            ...transformed,
          };
        });

        logger.info(
          {
            count: professionals.length,
            trade: jobScope.trade,
            source: 'Yelp',
            sampleNames: professionals.slice(0, 3).map(p => p.name),
          },
          'REAL professionals found from Yelp'
        );

        return professionals;
      }
    } catch (yelpError) {
      logger.warn(
        { error: yelpError.message, trade: jobScope.trade },
        'Yelp search failed, falling back to generated professionals'
      );
    }

    // Step 2: Fallback to template generation
    const professionals = generateWithTemplates(jobScope, location, count);

    logger.info(
      {
        count: professionals.length,
        trade: jobScope.trade,
        source: 'generated',
        sampleNames: professionals.slice(0, 3).map(p => p.name),
      },
      'Generated professionals (Yelp unavailable)'
    );

    return professionals;
  } catch (error) {
    logger.error({ error, jobScope }, 'Failed to find professionals');
    throw error;
  }
}

export default {
  generateProfessionals,
  generateWithTemplates,
};
