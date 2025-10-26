import Anthropic from '@anthropic-ai/sdk';
import { z } from 'zod';
import axios from 'axios';
import config from '../config/env.js';
import logger from '../utils/logger.js';

// Initialize Anthropic client (used when Lava is disabled)
const client = new Anthropic({
  apiKey: config.ANTHROPIC_API_KEY,
});

// Lava configuration
const USE_LAVA = config.USE_LAVA === 'true';
const LAVA_FORWARD_TOKEN = config.LAVA_FORWARD_TOKEN;
const LAVA_API_URL = 'https://api.lavapayments.com/v1/forward';
const ANTHROPIC_BASE_URL = 'https://api.anthropic.com/v1/messages';

/**
 * Make Claude API call through Lava proxy or direct
 */
async function makeClaudeRequest(params) {
  if (!USE_LAVA) {
    // Direct Anthropic API call
    return await client.messages.create(params);
  }

  // Route through Lava
  try {
    logger.info('Routing Claude request through Lava proxy');

    const response = await axios.post(
      `${LAVA_API_URL}?u=${encodeURIComponent(ANTHROPIC_BASE_URL)}`,
      params,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${LAVA_FORWARD_TOKEN}`,
          'anthropic-version': '2023-06-01',
          'x-api-key': config.ANTHROPIC_API_KEY,
        },
      }
    );

    logger.info({ usage: response.data.usage }, 'Lava request completed');
    return response.data;
  } catch (error) {
    logger.error({ error: error.message }, 'Lava request failed');
    throw error;
  }
}

// Schema for job scope extraction
const JobScopeSchema = z.object({
  trade: z.string().describe('Primary trade needed (e.g., HVAC, Plumbing, Electrical, Remodeling)'),
  services: z.array(z.string()).describe('Specific services required'),
  urgency: z.enum(['low', 'normal', 'high', 'emergency']).describe('Project urgency level'),
  budget_hint: z.enum(['low', 'medium', 'high', 'premium']).optional(),
  project_type: z.string().describe('Type of project (installation, repair, maintenance, renovation)'),
  location_requirements: z.string().optional().describe('Any specific location or travel requirements'),
});

// Schema for professional normalization
const ProfessionalSchema = z.object({
  company_name: z.string(),
  trade: z.string(),
  services: z.array(z.string()),
  city: z.string(),
  state: z.string(),
  license: z.string().optional(),
  rating: z.number().min(0).max(5).optional(),
  price_band: z.enum(['low', 'medium', 'high', 'premium']).optional(),
  website: z.string().optional(),
  bio: z.string().optional(),
});

/**
 * Extract structured job requirements from natural language prompt
 */
export async function analyzeJobRequest(prompt, photoUrls = []) {
  try {
    const messages = [
      {
        role: 'user',
        content: `Analyze this job request and extract structured information.

Job Description: ${prompt}

${photoUrls.length > 0 ? `Photos provided: ${photoUrls.length} image(s)` : ''}

Extract:
1. The primary trade/profession needed
2. Specific services required
3. Project urgency level
4. Budget tier if mentioned
5. Type of project

Respond with a JSON object matching this schema:
{
  "trade": "primary trade category",
  "services": ["service1", "service2"],
  "urgency": "low|normal|high|emergency",
  "budget_hint": "low|medium|high|premium",
  "project_type": "installation|repair|maintenance|renovation",
  "location_requirements": "any specific location notes"
}`,
      },
    ];

    const response = await makeClaudeRequest({
      model: 'claude-3-haiku-20240307',
      max_tokens: 1024,
      messages,
    });

    const content = response.content[0].text;
    const jsonMatch = content.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      throw new Error('Failed to extract JSON from Claude response');
    }

    const parsed = JSON.parse(jsonMatch[0]);
    const validated = JobScopeSchema.parse(parsed);

    logger.info({ prompt, result: validated }, 'Job request analyzed');
    return validated;
  } catch (error) {
    logger.error({ error, prompt }, 'Failed to analyze job request');
    throw error;
  }
}

/**
 * Normalize scraped professional data
 */
export async function normalizeProfessionalData(rawData) {
  try {
    const prompt = `Normalize this contractor data into a structured format:

${JSON.stringify(rawData, null, 2)}

Extract and standardize:
- Company name
- Trade/profession category
- List of services offered
- City and State
- License number if available
- Rating (0-5 scale)
- Price tier
- Website
- Brief bio/description

Return JSON matching this schema:
{
  "company_name": "string",
  "trade": "HVAC|Plumbing|Electrical|Remodeling|etc",
  "services": ["service1", "service2"],
  "city": "string",
  "state": "two-letter code",
  "license": "optional",
  "rating": 0-5,
  "price_band": "low|medium|high|premium",
  "website": "optional",
  "bio": "optional"
}`;

    const response = await makeClaudeRequest({
      model: 'claude-3-haiku-20240307',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    });

    const content = response.content[0].text;
    const jsonMatch = content.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      throw new Error('Failed to extract JSON from Claude response');
    }

    const parsed = JSON.parse(jsonMatch[0]);
    const validated = ProfessionalSchema.parse(parsed);

    return validated;
  } catch (error) {
    logger.error({ error, rawData }, 'Failed to normalize professional data');
    return null;
  }
}

/**
 * Re-rank and explain matches using Claude
 */
export async function reRankMatches(jobScope, candidates) {
  try {
    const prompt = `You are matching a customer's project with contractors.

Project Requirements:
${JSON.stringify(jobScope, null, 2)}

Candidate Contractors:
${candidates.map((c, i) => `${i + 1}. ${c.name} - ${c.trade} in ${c.city}, ${c.state}
   Services: ${c.services.join(', ')}
   Rating: ${c.rating || 'N/A'}
   Price: ${c.price_band || 'medium'}`).join('\n\n')}

Rank these contractors and provide:
1. A score (0-100) for each based on fit
2. A brief reason why they're a good match
3. Any concerns or caveats

Return JSON array:
[
  {
    "professional_id": "id",
    "score": 95,
    "reason": "Excellent match because...",
    "concerns": "optional concerns"
  }
]

Sort by score descending.`;

    const response = await makeClaudeRequest({
      model: 'claude-3-haiku-20240307',
      max_tokens: 2048,
      messages: [{ role: 'user', content: prompt }],
    });

    const content = response.content[0].text;
    const jsonMatch = content.match(/\[[\s\S]*\]/);

    if (!jsonMatch) {
      throw new Error('Failed to extract JSON array from Claude response');
    }

    const matches = JSON.parse(jsonMatch[0]);
    logger.info({ jobScope, candidateCount: candidates.length, matchCount: matches.length }, 'Matches re-ranked');

    return matches;
  } catch (error) {
    logger.error({ error, jobScope }, 'Failed to re-rank matches');
    throw error;
  }
}

export default {
  analyzeJobRequest,
  normalizeProfessionalData,
  reRankMatches,
};
