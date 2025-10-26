# ReNOVA 2025 🏗️

> AI-powered contractor matching platform built for CalHacks 12.0

ReNOVA connects homeowners and businesses with verified building professionals using multi-agent AI systems powered by Fetch.ai, Anthropic Claude, Bright Data, and ChromaDB.

![ReNOVA Architecture](https://img.shields.io/badge/Stack-Next.js%20%7C%20Node.js%20%7C%20Fetch.ai%20%7C%20Claude-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Features

- **Multi-Agent AI Pipeline**: Fetch.ai agents orchestrate the entire matching workflow
- **Natural Language Understanding**: Claude AI analyzes project requirements
- **Real-Time Progress**: Server-Sent Events provide live pipeline updates
- **Smart Matching**: Vector similarity search + AI reasoning for optimal contractor matches
- **Beautiful UI**: Figma-designed responsive interface with smooth animations
- **Zero SQL**: All data stored in ChromaDB vector database
- **Usage-Based Billing**: Lava Payments integration with automatic fallback to direct API

## 🎯 How It Works

1. **User submits project** - Describe your need (e.g., "AC unit making noise, needs repair")
2. **IntakeAgent analyzes** - Claude extracts trade, urgency, services, budget hints
3. **ScraperAgent finds pros** - Bright Data searches for local licensed contractors
4. **IndexerAgent stores** - Professionals indexed in ChromaDB with embeddings
5. **MatcherAgent ranks** - Vector search + Claude reasoning generates top matches
6. **Results delivered** - Real-time progress updates, detailed match explanations

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- Redis (for pub/sub)
- Docker & Docker Compose (optional)
- Anthropic API key

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd renova

# Copy environment variables
cp .env.example .env

# Add your Anthropic API key to .env
# ANTHROPIC_API_KEY=your_key_here

# Install dependencies
make install

# Start services with Docker
make up

# Seed demo data
make seed

# Open http://localhost:3000
```

### Local Development (without Docker)

**Terminal 1 - Redis:**
```bash
redis-server
```

**Terminal 2 - Backend:**
```bash
cd backend
npm install
npm run dev
```

**Terminal 3 - Frontend:**
```bash
cd "frontend/Landing Page AI"
npm install
npm run dev
```

## 📁 Project Structure

```
renova/
├── backend/                    # Node.js + Express backend
│   ├── agents/                 # Fetch.ai uAgents
│   │   ├── coordinatorAgent.js
│   │   ├── intakeAgent.js
│   │   ├── scraperAgent.js
│   │   ├── indexerAgent.js
│   │   └── matcherAgent.js
│   ├── services/
│   │   ├── claudeClient.js     # Anthropic Claude integration
│   │   ├── brightDataClient.js # Web scraping
│   │   ├── matchingService.js  # Vector search + business logic
│   │   └── embeddingService.js
│   ├── config/
│   │   ├── chromaClient.js     # ChromaDB setup
│   │   └── redisClient.js      # Redis pub/sub
│   ├── routes/
│   │   ├── jobs.js             # Job API endpoints
│   │   └── pros.js             # Professional listings
│   └── server.js
│
├── frontend/Landing Page AI/   # Next.js 14 frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx        # Landing page
│   │   │   ├── jobs/[jobId]/   # Job results
│   │   │   └── layout.tsx
│   │   ├── components/
│   │   │   ├── Hero.tsx
│   │   │   ├── IntakeForm.tsx
│   │   │   ├── PostProjectModal.tsx
│   │   │   ├── ProgressTracker.tsx
│   │   │   ├── MatchResults.tsx
│   │   │   └── ui/             # shadcn/ui components
│   │   └── lib/
│   │       ├── api.ts          # Backend API client
│   │       └── useSSE.ts       # SSE hook
│   └── package.json
│
├── docker-compose.yml
├── Makefile
├── .env.example
└── README.md
```

## 🧩 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 14, React 18, Tailwind CSS, Framer Motion, shadcn/ui |
| **Backend** | Node.js, Express, Fetch.ai uAgents |
| **AI/ML** | Anthropic Claude (Sonnet 4.5), ChromaDB (vector DB) |
| **Data** | Bright Data (web scraping), Redis (pub/sub) |
| **Deployment** | Vercel (frontend), Render/Railway (backend) |

## 🔧 Configuration

### Environment Variables

```bash
# Required
ANTHROPIC_API_KEY=sk-ant-...

# Optional (for live scraping)
BRIGHT_DATA_USERNAME=your_username
BRIGHT_DATA_PASSWORD=your_password
BRIGHT_DATA_ZONE=your_zone
BRIGHT_DATA_PROXY=brd.superproxy.io:22225

# Fetch.ai (optional)
UAGENTS_WALLET_MNEMONIC=your_mnemonic
UAGENTS_NETWORK=alpha

# Redis
REDIS_URL=redis://localhost:6379/0

# ChromaDB
CHROMA_PATH=./chroma_data

# App
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:3000
```

## 📡 API Endpoints

### Jobs

```bash
# Create a new job
POST /api/jobs
{
  "prompt": "Need HVAC repair for noisy AC",
  "city": "San Francisco",
  "state": "CA",
  "zipCode": "94102"
}

# Get job status
GET /api/jobs/:id

# Stream progress (SSE)
GET /api/jobs/:id/events

# Get results
GET /api/jobs/:id/results
```

### Professionals

```bash
# List all professionals
GET /api/pros?trade=HVAC&city=San Francisco&state=CA

# Get professional details
GET /api/pros/:id
```

## 🧪 Testing

```bash
# Seed demo professionals
make seed

# Run end-to-end demo
make demo

# Manual test flow
curl -X POST http://localhost:3001/api/jobs \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "AC not cooling, needs urgent repair",
    "city": "San Francisco",
    "state": "CA"
  }'
```

## 🌋 Lava Payments Integration (Optional)

ReNOVA supports **Lava Payments** for AI usage tracking and billing:

```bash
# Quick setup
./setup-lava.sh

# Or manually set in .env
USE_LAVA=true
LAVA_FORWARD_TOKEN=your_token_here
```

**Features:**
- Real-time usage and cost tracking
- Automatic fallback to direct Anthropic API if credits exhausted
- Zero downtime - transparent switching
- Dashboard analytics at https://www.lavapayments.com/dashboard

**How it works:**
1. Lava acts as a transparent proxy to Anthropic Claude API
2. Tracks every API call with usage metrics
3. If Lava credits run out, automatically falls back to your Anthropic credits
4. Application continues working seamlessly

📖 **Full documentation:** See [LAVA_INTEGRATION.md](LAVA_INTEGRATION.md)

## 🎨 UI Components

The frontend uses a Figma-designed component system:

- **Hero**: Animated landing section with 3D visualization
- **HowItWorks**: Step-by-step process explanation
- **AIShowcase**: Technology stack showcase
- **IntakeForm**: Project submission with validation
- **ProgressTracker**: Real-time SSE progress display
- **MatchResults**: AI-ranked contractor cards with reasoning

## 🚢 Deployment

### Frontend (Vercel)

```bash
cd "frontend/Landing Page AI"
vercel deploy
```

### Backend (Render/Railway)

1. Connect your repo to Render/Railway
2. Set environment variables
3. Deploy from `main` branch
4. Ensure Redis add-on is enabled

## 🤝 Contributing

This is a hackathon project built for CalHacks 12.0. Contributions welcome!

```bash
# Fork the repo
# Create a feature branch
git checkout -b feature/amazing-feature

# Commit changes
git commit -m "Add amazing feature"

# Push and create PR
git push origin feature/amazing-feature
```

## 📝 License

MIT License - see [LICENSE](LICENSE) file for details

## 🙏 Acknowledgments

- **Fetch.ai** - Multi-agent orchestration
- **Anthropic** - Claude AI for natural language understanding
- **Lava Payments** - Usage-based AI billing with automatic fallback
- **Bright Data** - Web scraping infrastructure
- **ChromaDB** - Vector database for embeddings
- **CalHacks 12.0** - Hackathon inspiration and community

## 📧 Contact

Built with ❤️ by the ReNOVA Team for CalHacks 12.0

---

**ReNOVA** - Smarter hiring for your next project. 🏗️
