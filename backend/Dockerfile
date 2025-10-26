FROM node:20-alpine

# Install curl for healthchecks
RUN apk add --no-cache curl

WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies
RUN npm install && npm cache clean --force

# Copy application code
COPY . .

# Create chroma_data directory
RUN mkdir -p chroma_data

EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:3001/health || exit 1

CMD ["npm", "run", "dev"]
