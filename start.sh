#!/bin/bash

# ReNOVA 2025 - One-Command Startup Script
# This script starts all services needed for the project

set -e  # Exit on error

echo "🚀 ReNOVA 2025 - Starting All Services"
echo "========================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if .env exists
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  No .env file found${NC}"
    echo "📝 Creating .env from .env.example..."
    cp .env.example .env
    echo ""
    echo -e "${RED}❗ IMPORTANT: Edit .env and add your API keys:${NC}"
    echo "   - ANTHROPIC_API_KEY=your_key_here"
    echo "   - YELP_API_KEY=your_key_here (optional)"
    echo ""
    read -p "Press Enter after you've added your API keys..."
fi

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}❌ Docker is not running${NC}"
    echo "Please start Docker Desktop and try again"
    exit 1
fi

echo -e "${GREEN}✅ Docker is running${NC}"
echo ""

# Stop any existing containers
echo "🛑 Stopping any existing containers..."
docker compose down 2>/dev/null || true
echo ""

# Build and start services
echo "🏗️  Building and starting services..."
echo "   This may take a few minutes on first run..."
echo ""

docker compose up --build -d

echo ""
echo "⏳ Waiting for services to be healthy..."
echo ""

# Wait for services to be healthy
MAX_WAIT=120
WAITED=0
while [ $WAITED -lt $MAX_WAIT ]; do
    REDIS_HEALTH=$(docker inspect --format='{{.State.Health.Status}}' renova-redis 2>/dev/null || echo "starting")
    CHROMA_HEALTH=$(docker inspect --format='{{.State.Health.Status}}' renova-chromadb 2>/dev/null || echo "starting")
    BACKEND_HEALTH=$(docker inspect --format='{{.State.Health.Status}}' renova-backend 2>/dev/null || echo "starting")
    FRONTEND_HEALTH=$(docker inspect --format='{{.State.Health.Status}}' renova-frontend 2>/dev/null || echo "starting")

    if [ "$REDIS_HEALTH" = "healthy" ] && \
       [ "$CHROMA_HEALTH" = "healthy" ] && \
       [ "$BACKEND_HEALTH" = "healthy" ] && \
       [ "$FRONTEND_HEALTH" = "healthy" ]; then
        break
    fi

    echo "   Redis: $REDIS_HEALTH | ChromaDB: $CHROMA_HEALTH | Backend: $BACKEND_HEALTH | Frontend: $FRONTEND_HEALTH"
    sleep 5
    WAITED=$((WAITED + 5))
done

echo ""

if [ $WAITED -ge $MAX_WAIT ]; then
    echo -e "${YELLOW}⚠️  Services took longer than expected to start${NC}"
    echo "Check logs with: docker compose logs"
else
    echo -e "${GREEN}✅ All services are healthy!${NC}"
fi

echo ""
echo "╔════════════════════════════════════════╗"
echo "║   🎉 ReNOVA is now running!           ║"
echo "╚════════════════════════════════════════╝"
echo ""
echo "📱 Access your application:"
echo "   🌐 Frontend:  http://localhost:3000"
echo "   🔧 Backend:   http://localhost:3001"
echo "   🗄️  ChromaDB:  http://localhost:8000"
echo "   📮 Redis:     localhost:6379"
echo ""
echo "📊 Useful commands:"
echo "   View logs:        docker compose logs -f"
echo "   View backend:     docker compose logs -f backend"
echo "   View frontend:    docker compose logs -f frontend"
echo "   Stop services:    docker compose down"
echo "   Restart:          ./start.sh"
echo ""
echo "🌱 Optional - Seed demo data:"
echo "   make seed"
echo ""
echo "🧪 Run end-to-end demo:"
echo "   make demo"
echo ""
echo -e "${GREEN}Happy hacking! 🚀${NC}"
echo ""
