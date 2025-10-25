# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**ReNOVA 2025** is a CalHacks 12.0 AI-powered contractor matching platform that connects homeowners and businesses with licensed building professionals (HVAC, plumbing, electricians, remodelers, etc.) using multi-agent AI systems.

## Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **UI**: React 18 with Figma-designed components
- **Styling**: Tailwind CSS with shadcn/ui components
- **Animations**: Framer Motion
- **API Client**: Axios

### Backend
- **Runtime**: Node.js with Express
- **AI Agents**: Fetch.ai uAgents SDK (JavaScript)
- **LLM**: Anthropic Claude API (Sonnet 4.5)
- **Scraping**: Bright Data
- **Database**: ChromaDB (vector database)
- **Queuing**: Redis (pub/sub for real-time updates)

## Architecture

### Multi-Agent Pipeline

The system uses a coordinator pattern with specialized agents:

1. **CoordinatorAgent** (`backend/agents/coordinatorAgent.js`): Orchestrates the entire pipeline
2. **IntakeAgent** (`backend/agents/intakeAgent.js`): Analyzes job requests using Claude
3. **ScraperAgent** (`backend/agents/scraperAgent.js`): Scrapes contractor data via Bright Data
4. **IndexerAgent** (`backend/agents/indexerAgent.js`): Stores professionals in ChromaDB
5. **MatcherAgent** (`backend/agents/matcherAgent.js`): Ranks matches using vector similarity + Claude reasoning

### Data Flow

```
User submits project → IntakeAgent analyzes → ScraperAgent finds pros →
IndexerAgent stores in ChromaDB → MatcherAgent ranks →
Results returned + Real-time SSE progress updates
```

### Key Services

- `backend/services/claudeClient.js`: Claude API integration for job analysis, data normalization, and match ranking
- `backend/services/brightDataClient.js`: Web scraping for contractor data
- `backend/services/matchingService.js`: Vector search and business logic filters
- `backend/config/chromaClient.js`: ChromaDB collections management
- `backend/config/redisClient.js`: Redis pub/sub for progress events

### API Endpoints

```
POST   /api/jobs              - Create new job
GET    /api/jobs/:id          - Get job status
GET    /api/jobs/:id/events   - SSE stream for progress
GET    /api/jobs/:id/results  - Get match results
GET    /api/pros              - List professionals
GET    /api/pros/:id          - Get professional details
```

### Frontend Structure

```
frontend/Landing Page AI/
  src/
    app/
      page.tsx              - Landing page (Figma design)
      jobs/[jobId]/         - Job results with real-time progress
      layout.tsx            - Root layout
    components/
      Hero.tsx              - Hero with animations
      HowItWorks.tsx        - Process explanation
      AIShowcase.tsx        - Technology showcase
      FeaturedTrades.tsx    - Trade categories
      IntakeForm.tsx        - Project submission form
      PostProjectModal.tsx  - Quick project modal
      ProgressTracker.tsx   - Real-time progress display
      MatchResults.tsx      - Match cards with AI reasoning
      ui/                   - shadcn/ui components
    lib/
      api.ts                - Backend API client
      useSSE.ts             - Server-Sent Events hook
```

## Development Commands

```bash
# Install dependencies
make install

# Start all services (Docker)
make up

# Seed demo data
make seed

# Run E2E demo
make demo

# View logs
make logs

# Stop services
make down

# Clean all data
make clean
```

### Local Development (without Docker)

**Backend:**
```bash
cd backend
npm install
npm run dev
```

**Frontend:**
```bash
cd "frontend/Landing Page AI"
npm install
npm run dev
```

**Redis:**
```bash
redis-server
```

## Environment Variables

Copy `.env.example` to `.env` and configure:

```
# Required
ANTHROPIC_API_KEY=your_key

# Optional (for live scraping)
BRIGHT_DATA_USERNAME=
BRIGHT_DATA_PASSWORD=
BRIGHT_DATA_ZONE=
```

If Bright Data credentials are not provided, the system uses seed data only.

## ChromaDB Collections

- **professionals**: Contractor profiles with services and ratings
- **jobs**: Customer job requests
- **matches**: Job-to-professional match results with scores and reasoning

## Real-Time Progress

The system uses Redis pub/sub to broadcast progress events:
- `started`: Job received
- `intake`: Analyzing requirements
- `scrape`: Finding professionals
- `index`: Storing data
- `match`: Ranking matches
- `done`: Results ready

Frontend subscribes via Server-Sent Events (SSE) at `/api/jobs/:id/events`.

## Important Context

- This is a hackathon project (CalHacks 12.0) - expect rapid iteration
- Frontend design is from Figma - maintain the visual design
- All data persists in ChromaDB (no SQL database)
- Multi-agent coordination uses Fetch.ai uAgents
- Claude AI handles natural language understanding and match reasoning

## Development Tips

1. **Adding new trades**: Update seed data in `backend/scripts/seedPros.js`
2. **Modifying matching logic**: Edit `backend/services/matchingService.js`
3. **Changing Claude prompts**: Update `backend/services/claudeClient.js`
4. **Frontend styling**: Use Tailwind classes, maintain Figma design tokens
5. **Testing pipeline**: Use `make demo` for full E2E test

## Common Issues

- **ChromaDB errors**: Delete `chroma_data/` directory and restart
- **Redis connection fails**: Ensure Redis is running on port 6379
- **Frontend build errors**: Delete `.next/` and `node_modules/`, reinstall
- **No matches found**: Run `make seed` to populate demo professionals
