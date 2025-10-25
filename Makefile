.PHONY: help install up down logs seed demo clean

help:
	@echo "ReNOVA 2025 - Development Commands"
	@echo "======================================="
	@echo "make install  - Install all dependencies"
	@echo "make up       - Start all services with Docker Compose"
	@echo "make down     - Stop all services"
	@echo "make logs     - View logs from all services"
	@echo "make seed     - Seed database with demo professionals"
	@echo "make demo     - Run end-to-end demo"
	@echo "make clean    - Clean all data and stop services"

install:
	@echo "Installing backend dependencies..."
	cd backend && npm install
	@echo "Installing frontend dependencies..."
	cd "frontend/Landing Page AI" && npm install
	@echo "Done!"

up:
	docker compose up --build -d
	@echo "Services started!"
	@echo "Frontend: http://localhost:3000"
	@echo "Backend: http://localhost:3001"

down:
	docker compose down

logs:
	docker compose logs -f

seed:
	docker compose exec backend node scripts/seedPros.js

demo:
	docker compose exec backend node scripts/demoE2E.js

clean:
	docker compose down -v
	rm -rf chroma_data
	@echo "All data cleaned!"
