import dotenv from 'dotenv';
import { z } from 'zod';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from parent directory
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const envSchema = z.object({
  // Anthropic
  ANTHROPIC_API_KEY: z.string().default('demo-key-for-testing'),

  // Yelp Fusion API
  YELP_API_KEY: z.string().optional(),

  // Bright Data
  BRIGHT_DATA_USERNAME: z.string().optional(),
  BRIGHT_DATA_PASSWORD: z.string().optional(),
  BRIGHT_DATA_ZONE: z.string().optional(),
  BRIGHT_DATA_PROXY: z.string().default('brd.superproxy.io:22225'),

  // Fetch.ai
  UAGENTS_WALLET_MNEMONIC: z.string().optional(),
  UAGENTS_NETWORK: z.string().default('alpha'),

  // Redis
  REDIS_URL: z.string().default('redis://localhost:6379/0'),

  // ChromaDB
  CHROMA_PATH: z.string().default('./chroma_data'),
  CHROMA_HOST: z.string().default('localhost'),
  CHROMA_PORT: z.string().default('8000'),

  // App
  APP_ENV: z.string().default('local'),
  NODE_ENV: z.string().default('development'),
  PORT: z.string().default('3001'),
  FRONTEND_URL: z.string().default('http://localhost:3000'),
  CORS_ORIGINS: z.string().default('http://localhost:3000'),
  LOG_LEVEL: z.string().default('info'),
});

let config;

try {
  config = envSchema.parse(process.env);
} catch (error) {
  console.error('❌ Invalid environment variables:', error.errors);
  process.exit(1);
}

export default {
  ...config,
  PORT: parseInt(config.PORT, 10),
  CORS_ORIGINS: config.CORS_ORIGINS.split(','),
  isProduction: config.NODE_ENV === 'production',
  isDevelopment: config.NODE_ENV === 'development',
};
