# Docker Setup for ReNOVA

## Summary of Changes

### 1. **Removed Hardcoded API Keys** ✅
All hardcoded API keys have been removed and replaced with environment variables:
- **ASI1 API Key** (was hardcoded in `describe_customer.py` and `describe_designer.py`)
- **BrightData Token** (was hardcoded in `get_posts.py`)

### 2. **Environment Configuration** ✅
Created `.env.example` files:
- Root: `/calhaks12.0/.env.example` - Contains all API keys
- Backend: `/backend/.env.example` - Backend-specific config
- Frontend: `/frontend/Landing Page AI/.env.example` - Frontend API URL

### 3. **Docker Files Created** ✅
- **Backend Dockerfile**: Python Flask API with all dependencies
- **Frontend Dockerfile**: Next.js application
- **docker-compose.yml**: Orchestrates all services

## Quick Start

### 1. Create your `.env` file:
```bash
cp .env.example .env
```

### 2. Add your API keys to `.env`:
```env
ASI1_API_KEY=sk_384038c3b01d4c569aef317d8cb6686901786c2c50074ad2af55494bbce84319
BRIGHTDATA_BEARER_TOKEN=cbe37fd115555c3cab636f656e3c4fc8ad0bf748bf6b5e1739fbc609afd0587c
BRIGHTDATA_DATASET_ID=gd_l1vikfch901nx3by4
```

### 3. Install python-dotenv (if not already installed):
```bash
cd backend
pip install python-dotenv
```

### 4. Start with Docker Compose:
```bash
docker-compose up --build
```

## Services

The docker-compose setup includes:

- **Frontend** (Port 3000): Next.js application
- **Backend** (Port 8080): Python Flask API
- **Redis** (Port 6379): Caching layer
- **ChromaDB** (Port 8000): Vector database

## Access Points

- Frontend: http://localhost:3000
- Backend API: http://localhost:8080
- ChromaDB: http://localhost:8000

## Files Modified

### Backend Files (Environment Variables Added):
1. `/backend/customer/describe_customer.py` - Now uses `os.getenv("ASI1_API_KEY")`
2. `/backend/designer/describe_designer.py` - Now uses `os.getenv("ASI1_API_KEY")`
3. `/backend/designer/get_posts.py` - Now uses `os.getenv("BRIGHTDATA_BEARER_TOKEN")`

### New Files Created:
1. `/backend/Dockerfile` - Python Flask container
2. `/backend/.dockerignore` - Excludes unnecessary files
3. `/backend/.env.example` - Backend environment template
4. `/frontend/Landing Page AI/.env.example` - Frontend environment template
5. `/DOCKER_SETUP_INSTRUCTIONS.md` - Detailed Docker instructions

### Modified Files:
1. `/docker-compose.yml` - Updated to use Python Flask backend instead of Node.js
2. `/frontend/Landing Page AI/Dockerfile` - Added environment variable support
3. `/.env.example` - Added ASI1 and BrightData API keys

## Development vs Production

### Development (Current Setup):
```bash
docker-compose up
```
- Uses `npm run dev` for hot reloading
- Volume mounts for live code updates
- Debug mode enabled

### Production:
For production deployment, modify:
1. Set `FLASK_DEBUG=False`
2. Use production build for Next.js
3. Add HTTPS/SSL certificates
4. Use secrets management
5. Set up proper logging and monitoring

## Troubleshooting

### Missing API Keys Error:
```
ValueError: ASI1_API_KEY environment variable is required
```
**Solution**: Make sure you've created `.env` file and added your API keys.

### Port Already in Use:
```
Error: Port 8080 is already allocated
```
**Solution**: Stop other services using that port or change ports in `docker-compose.yml`.

### Import Error (dotenv):
```
ModuleNotFoundError: No module named 'dotenv'
```
**Solution**: Install python-dotenv:
```bash
pip install python-dotenv
```

## Security Notes

⚠️ **IMPORTANT**:
- Never commit `.env` file to git
- Keep your API keys secure
- Rotate keys if accidentally exposed
- Use different keys for dev/staging/production

## Next Steps

1. Test the Docker setup: `docker-compose up`
2. Verify all services start successfully
3. Test API endpoints
4. Set up CI/CD pipeline for automated deployments

## Support

For more detailed instructions, see `DOCKER_SETUP_INSTRUCTIONS.md`.
