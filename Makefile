.PHONY: help install up down logs seed demo clean status restart health

help:
	@echo "ReNOVA 2025 - Development Commands"
	@echo "======================================="
	@echo "make install  - Install all dependencies"
	@echo "make up       - Start all services with Docker Compose"
	@echo "make down     - Stop all services"
	@echo "make restart  - Restart all services"
	@echo "make logs     - View logs from all services"
	@echo "make status   - Check status of all services"
	@echo "make health   - Run health checks"
	@echo "make seed     - Seed database with demo professionals"
	@echo "make demo     - Run end-to-end demo"
	@echo "make clean    - Clean all data and stop services"
	@echo ""
	@echo "Quick start: ./start.sh"

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

restart:
	docker compose restart
	@echo "Services restarted!"

logs:
	docker compose logs -f

status:
	@echo "Service Status:"
	@docker compose ps

health:
	@echo "Running health checks..."
	@echo "Backend:  $$(curl -s http://localhost:3001/health | grep -q ok && echo '✅ Healthy' || echo '❌ Unhealthy')"
	@echo "Frontend: $$(curl -s -o /dev/null -w '%{http_code}' http://localhost:3000 | grep -q 200 && echo '✅ Healthy' || echo '❌ Unhealthy')"
	@echo "ChromaDB: $$(curl -s http://localhost:8000/api/v1/heartbeat | grep -q heartbeat && echo '✅ Healthy' || echo '❌ Unhealthy')"
	@echo "Redis:    $$(docker compose exec -T redis redis-cli ping | grep -q PONG && echo '✅ Healthy' || echo '❌ Unhealthy')"

seed:
	@echo "Seeding demo data..."
	docker compose exec backend node scripts/seedPros.js

demo:
	@echo "Running end-to-end demo..."
	docker compose exec backend node scripts/demoE2E.js

clean:
	docker compose down -v
	rm -rf chroma_data
	@echo "All data cleaned!"
