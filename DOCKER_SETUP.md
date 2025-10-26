# 🐳 Docker Setup Guide - ReNOVA 2025

Complete guide to running ReNOVA with Docker for development and demo purposes.

## 🚀 Quick Start (One Command)

```bash
./start.sh
```

That's it! The script will:
- ✅ Check if `.env` exists (creates from `.env.example` if not)
- ✅ Verify Docker is running
- ✅ Build all containers
- ✅ Start all services
- ✅ Wait for health checks
- ✅ Show you the URLs

## 📋 Prerequisites

- **Docker Desktop** installed and running
- **At least 4GB RAM** allocated to Docker
- **Git** for cloning the repository
- **Anthropic API key** (required)

### Install Docker

- **Mac**: https://docs.docker.com/desktop/install/mac-install/
- **Windows**: https://docs.docker.com/desktop/install/windows-install/
- **Linux**: https://docs.docker.com/engine/install/

## 🏗️ Architecture

The Docker setup includes 4 services:

```
┌─────────────────────────────────────────┐
│          Docker Network                  │
│  (renova-network)                       │
│                                          │
│  ┌──────────────┐  ┌──────────────┐   │
│  │   Frontend   │  │   Backend    │   │
│  │  (Next.js)   │  │  (Node.js)   │   │
│  │  Port: 3000  │  │  Port: 3001  │   │
│  └──────────────┘  └──────────────┘   │
│         │                  │            │
│         └────────┬─────────┘            │
│                  │                      │
│  ┌──────────────┴────┐  ┌──────────┐  │
│  │     Redis         │  │ ChromaDB │  │
│  │  (Pub/Sub)        │  │ (Vector) │  │
│  │  Port: 6379       │  │ Port:8000│  │
│  └───────────────────┘  └──────────┘  │
└─────────────────────────────────────────┘
```

## 🔧 Manual Setup

### 1. Environment Variables

```bash
# Copy example file
cp .env.example .env

# Edit .env and add your keys
nano .env  # or use your favorite editor
```

**Required variables:**
```bash
ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

**Optional variables:**
```bash
# Lava Payments (for usage tracking)
USE_LAVA=false
LAVA_FORWARD_TOKEN=your_token

# Yelp API (for live contractor data)
YELP_API_KEY=your_yelp_key
```

### 2. Build Containers

```bash
docker compose build
```

This will:
- Build the backend Node.js container
- Build the frontend Next.js container
- Pull Redis and ChromaDB images

### 3. Start Services

```bash
docker compose up -d
```

The `-d` flag runs containers in detached mode (background).

### 4. Check Health

```bash
docker compose ps
```

You should see all services as "healthy":
```
NAME                 STATUS
renova-backend       Up (healthy)
renova-frontend      Up (healthy)
renova-redis         Up (healthy)
renova-chromadb      Up (healthy)
```

## 📊 Useful Commands

### View Logs

```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f backend
docker compose logs -f frontend

# Last 100 lines
docker compose logs --tail=100
```

### Stop Services

```bash
# Stop all containers
docker compose down

# Stop and remove volumes (clean slate)
docker compose down -v
```

### Restart Services

```bash
# Restart all
docker compose restart

# Restart specific service
docker compose restart backend
```

### Execute Commands Inside Containers

```bash
# Backend shell
docker compose exec backend sh

# Run seed script
docker compose exec backend node scripts/seedPros.js

# Frontend shell
docker compose exec frontend sh
```

### Check Service Health

```bash
# Check if backend is responding
curl http://localhost:3001/health

# Check if frontend is up
curl http://localhost:3000

# Check ChromaDB
curl http://localhost:8000/api/v1/heartbeat
```

## 🌱 Seed Demo Data

After services are running:

```bash
make seed
```

Or manually:
```bash
docker compose exec backend node scripts/seedPros.js
```

This adds sample contractors to ChromaDB for testing.

## 🧪 Run End-to-End Demo

```bash
make demo
```

Or manually:
```bash
docker compose exec backend node scripts/demoE2E.js
```

## 🔍 Troubleshooting

### Services Won't Start

**Check Docker is running:**
```bash
docker info
```

**Check available resources:**
```bash
docker system df
```

**Clean up old containers:**
```bash
docker system prune -a
```

### Port Already in Use

If you see "port already allocated":

```bash
# Find what's using the port
lsof -i :3000  # or :3001, :6379, :8000

# Kill the process
kill -9 <PID>
```

Or change ports in `docker-compose.yml`:
```yaml
ports:
  - "3010:3000"  # Use port 3010 instead
```

### Backend Health Check Failing

**Check logs:**
```bash
docker compose logs backend
```

**Common issues:**
- Missing `ANTHROPIC_API_KEY` in `.env`
- Redis not healthy yet
- ChromaDB not healthy yet

**Solution:** Wait longer or check individual service logs.

### Frontend Build Errors

**Clear Next.js cache:**
```bash
docker compose down
docker volume rm $(docker volume ls -q | grep renova)
docker compose up --build
```

### ChromaDB Permission Issues

```bash
# Fix permissions on chroma_data folder
chmod -R 777 chroma_data
```

### Out of Disk Space

```bash
# Remove unused Docker data
docker system prune -a --volumes

# Check available space
docker system df
```

## 📈 Performance Tips

### Faster Builds

The project uses `.dockerignore` files to exclude:
- `node_modules`
- `.next` cache
- `.env` files
- Documentation

This makes builds much faster.

### Hot Reload

Both frontend and backend support hot reload in development:
- Edit files on your host machine
- Changes are reflected inside containers via volume mounts
- No need to rebuild!

### Resource Allocation

**Recommended Docker Desktop settings:**
- **CPUs**: 4 cores
- **Memory**: 4GB minimum, 8GB recommended
- **Swap**: 1GB
- **Disk**: 20GB

## 🔐 Security Notes

### Production Deployment

**Don't use this Docker setup for production!** It's configured for development:

- Runs in development mode
- Mounts source code as volumes
- No SSL/TLS
- Exposes all ports
- Uses weak secrets

**For production:**
- Use multi-stage builds
- Run as non-root user
- Use environment-specific configs
- Enable HTTPS
- Use Docker secrets
- Scan images for vulnerabilities

### Environment Variables

**Never commit `.env` files!** The `.gitignore` already excludes them, but double-check:

```bash
git status .env  # Should show "ignored"
```

## 🎯 Testing Your Setup

### Quick Health Test

```bash
# 1. Check services are up
docker compose ps

# 2. Test backend health
curl http://localhost:3001/health

# 3. Test frontend (returns HTML)
curl -I http://localhost:3000

# 4. Test ChromaDB
curl http://localhost:8000/api/v1/heartbeat

# 5. Test Redis
docker compose exec redis redis-cli ping
```

### Full Integration Test

```bash
# 1. Seed data
make seed

# 2. Run demo
make demo

# 3. Check logs for success
docker compose logs backend | tail -20
```

### Manual Browser Test

1. Open http://localhost:3000
2. Fill out the project form
3. Submit a job request
4. Watch real-time progress
5. See matched contractors

## 🛠️ Development Workflow

### Typical Development Session

```bash
# 1. Start services
./start.sh

# 2. Watch logs in separate terminal
docker compose logs -f backend

# 3. Make code changes (auto-reloads)
nano backend/routes/jobs.js

# 4. Test changes
curl http://localhost:3001/health

# 5. When done
docker compose down
```

### Debugging

**Attach to running container:**
```bash
docker compose exec backend sh
cd /app
ls -la
```

**View environment variables:**
```bash
docker compose exec backend env | grep ANTHROPIC
```

**Check network connectivity:**
```bash
docker compose exec backend ping chromadb
docker compose exec backend ping redis
```

## 📚 Additional Resources

- **Docker Compose Docs**: https://docs.docker.com/compose/
- **Next.js in Docker**: https://nextjs.org/docs/deployment
- **Node.js Best Practices**: https://github.com/goldbergyoni/nodebestpractices

## 🆘 Getting Help

If you're stuck:

1. Check this guide's troubleshooting section
2. View logs: `docker compose logs`
3. Check GitHub issues
4. Ask the ReNOVA team

---

**Happy Docker-ing! 🐳**
