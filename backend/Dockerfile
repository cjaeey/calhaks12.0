FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY requirements.txt requirement.txt* ./

# Install Python dependencies
RUN pip install --no-cache-dir \
    flask \
    flask-cors \
    chromadb \
    sentence-transformers \
    python-dotenv \
    requests \
    python-multipart

# Copy application code
COPY . .

# Create chroma_data directory
RUN mkdir -p chroma_data

# Expose port
EXPOSE 8080

# Run the application
CMD ["python", "api_bridge.py"]
