import { initChromaDB, addProfessionals } from '../config/chromaClient.js';
import { nanoid } from 'nanoid';
import logger from '../utils/logger.js';

/**
 * Seed database with demo professionals
 */
async function seedProfessionals() {
  try {
    logger.info('Initializing ChromaDB...');
    await initChromaDB();

    logger.info('Seeding demo professionals...');

    const demoPros = [
      // HVAC Professionals
      {
        id: nanoid(),
        name: 'CoolAir HVAC Services',
        trade: 'HVAC',
        services: ['AC Installation', 'AC Repair', 'Heating Repair', 'Duct Cleaning', 'Maintenance'],
        city: 'San Francisco',
        state: 'CA',
        license: 'HVAC-CA-12345',
        rating: 4.8,
        price_band: 'medium',
        website: 'https://coolairhvac.example.com',
        bio: 'Family-owned HVAC company serving the Bay Area for 20+ years. Specializing in energy-efficient systems.',
      },
      {
        id: nanoid(),
        name: 'Bay Area Climate Control',
        trade: 'HVAC',
        services: ['AC Installation', 'Heating Installation', 'Emergency Service', 'Smart Thermostat'],
        city: 'Oakland',
        state: 'CA',
        license: 'HVAC-CA-23456',
        rating: 4.9,
        price_band: 'high',
        website: 'https://bayareaclimate.example.com',
        bio: '24/7 emergency HVAC service. Licensed and insured with certified technicians.',
      },
      // Plumbers
      {
        id: nanoid(),
        name: 'Golden State Plumbing',
        trade: 'Plumbing',
        services: ['Leak Repair', 'Drain Cleaning', 'Water Heater', 'Pipe Replacement', 'Emergency Service'],
        city: 'San Jose',
        state: 'CA',
        license: 'PLB-CA-34567',
        rating: 4.7,
        price_band: 'medium',
        website: 'https://goldenstateplumbing.example.com',
        bio: 'Trusted plumbing services throughout Silicon Valley. Same-day service available.',
      },
      {
        id: nanoid(),
        name: 'Fast Flow Plumbing',
        trade: 'Plumbing',
        services: ['Emergency Plumbing', 'Sewer Line', 'Water Heater', 'Fixture Installation'],
        city: 'San Francisco',
        state: 'CA',
        license: 'PLB-CA-45678',
        rating: 4.6,
        price_band: 'low',
        website: 'https://fastflowplumbing.example.com',
        bio: 'Affordable and reliable plumbing for residential and commercial clients.',
      },
      // Electricians
      {
        id: nanoid(),
        name: 'Bright Spark Electric',
        trade: 'Electrical',
        services: ['Wiring', 'Panel Upgrades', 'EV Charger Installation', 'Lighting', 'Emergency Repair'],
        city: 'Berkeley',
        state: 'CA',
        license: 'ELEC-CA-56789',
        rating: 4.9,
        price_band: 'high',
        website: 'https://brightspark.example.com',
        bio: 'Master electricians specializing in residential upgrades and EV charging installations.',
      },
      {
        id: nanoid(),
        name: 'PowerUp Electrical Services',
        trade: 'Electrical',
        services: ['Electrical Repair', 'Outlet Installation', 'Ceiling Fans', 'Safety Inspections'],
        city: 'San Francisco',
        state: 'CA',
        license: 'ELEC-CA-67890',
        rating: 4.5,
        price_band: 'medium',
        website: 'https://powerupelectrical.example.com',
        bio: 'Licensed electricians providing safe and code-compliant electrical work.',
      },
      // Remodelers
      {
        id: nanoid(),
        name: 'Bay Remodeling & Construction',
        trade: 'Remodeling',
        services: ['Kitchen Remodel', 'Bathroom Remodel', 'Room Addition', 'Whole House Renovation'],
        city: 'San Francisco',
        state: 'CA',
        license: 'GC-CA-78901',
        rating: 4.8,
        price_band: 'premium',
        website: 'https://bayremodeling.example.com',
        bio: 'Award-winning general contractor specializing in high-end residential remodels.',
      },
      {
        id: nanoid(),
        name: 'Modern Home Builders',
        trade: 'Remodeling',
        services: ['Kitchen Remodel', 'Bathroom Remodel', 'Flooring', 'Painting', 'Cabinetry'],
        city: 'Palo Alto',
        state: 'CA',
        license: 'GC-CA-89012',
        rating: 4.7,
        price_band: 'high',
        website: 'https://modernhomebuilders.example.com',
        bio: 'Transform your home with our expert remodeling services. Free estimates.',
      },
      // Handyman/General
      {
        id: nanoid(),
        name: 'Fix-It All Handyman Services',
        trade: 'Handyman',
        services: ['General Repairs', 'Painting', 'Drywall', 'Furniture Assembly', 'Small Projects'],
        city: 'San Francisco',
        state: 'CA',
        license: 'HM-CA-90123',
        rating: 4.4,
        price_band: 'low',
        website: 'https://fixitall.example.com',
        bio: 'Reliable handyman for all your home repair needs. No job too small.',
      },
      {
        id: nanoid(),
        name: 'Elite Property Maintenance',
        trade: 'Handyman',
        services: ['Home Maintenance', 'Repairs', 'Installation', 'Seasonal Services'],
        city: 'Oakland',
        state: 'CA',
        license: 'HM-CA-01234',
        rating: 4.6,
        price_band: 'medium',
        website: 'https://eliteproperty.example.com',
        bio: 'Professional handyman and property maintenance for busy homeowners.',
      },
    ];

    await addProfessionals(demoPros);

    logger.info(`✅ Successfully seeded ${demoPros.length} professionals`);
    console.log(`\n✅ Seeded ${demoPros.length} demo professionals:`);
    console.log(`   - ${demoPros.filter(p => p.trade === 'HVAC').length} HVAC professionals`);
    console.log(`   - ${demoPros.filter(p => p.trade === 'Plumbing').length} Plumbers`);
    console.log(`   - ${demoPros.filter(p => p.trade === 'Electrical').length} Electricians`);
    console.log(`   - ${demoPros.filter(p => p.trade === 'Remodeling').length} Remodelers`);
    console.log(`   - ${demoPros.filter(p => p.trade === 'Handyman').length} Handyman services\n`);

    process.exit(0);
  } catch (error) {
    logger.error({ error }, 'Failed to seed professionals');
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
}

seedProfessionals();
