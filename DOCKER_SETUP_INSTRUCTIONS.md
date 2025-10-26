# Docker Setup Instructions

This guide explains how to run the ReNOVA application using Docker.

## Prerequisites

- Docker installed ([Get Docker](https://docs.docker.com/get-docker/))
- Docker Compose installed (included with Docker Desktop)

## Quick Start

### 1. Configure Environment Variables

Copy the example environment file and fill in your API keys:

```bash
cp .env.example .env
```

Edit `.env` and add your actual API keys:

```env
ASI1_API_KEY=sk_your_actual_asi1_api_key_here
BRIGHTDATA_BEARER_TOKEN=your_actual_brightdata_token_here
BRIGHTDATA_DATASET_ID=gd_l1vikfch901nx3by4
```

### 2. Start the Application

Run both frontend and backend with one command:

```bash
docker-compose up
```

Or run in detached mode (background):

```bash
docker-compose up -d
```

### 3. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080

## Individual Service Commands

### Build services:
```bash
docker-compose build
```

### Start only backend:
```bash
docker-compose up backend
```

### Start only frontend:
```bash
docker-compose up frontend
```

### View logs:
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Stop services:
```bash
docker-compose down
```

### Stop and remove volumes:
```bash
docker-compose down -v
```

## Development Workflow

### Rebuild after code changes:
```bash
docker-compose up --build
```

### Restart a specific service:
```bash
docker-compose restart backend
```

## Troubleshooting

### Port already in use:
If ports 3000 or 8080 are already in use, you can change them in `docker-compose.yml`:

```yaml
ports:
  - "3001:3000"  # Change 3001 to any available port
```

### View service status:
```bash
docker-compose ps
```

### Access container shell:
```bash
# Backend
docker-compose exec backend sh

# Frontend
docker-compose exec frontend sh
```

### Reset everything:
```bash
docker-compose down -v
docker-compose up --build
```

## Environment Variables

### Backend (`.env`)
- `ASI1_API_KEY`: API key for ASI1 AI service
- `BRIGHTDATA_BEARER_TOKEN`: Bearer token for BrightData API
- `BRIGHTDATA_DATASET_ID`: Dataset ID for Instagram scraping

### Frontend
- `NEXT_PUBLIC_API_URL`: Backend API URL (set automatically by docker-compose)

## Production Deployment

For production, consider:

1. Use environment-specific `.env` files
2. Enable HTTPS/SSL
3. Set up proper logging and monitoring
4. Use secrets management (e.g., Docker secrets, AWS Secrets Manager)
5. Set up CI/CD pipeline

## Architecture

```
┌─────────────────┐
│   Frontend      │
│   (Next.js)     │
│   Port: 3000    │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│   Backend       │
│   (Flask API)   │
│   Port: 8080    │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│   ChromaDB      │
│   (Vector DB)   │
│   Volume        │
└─────────────────┘
```

## Support

For issues or questions, please check the main README.md or create an issue in the repository.
