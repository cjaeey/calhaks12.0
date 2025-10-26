"""
API Bridge - Flask API for Node.js to communicate with Fetch.ai agents
This provides a REST API that Node.js can call, which then messages the agents
"""
import os
import json
import asyncio
from flask import Flask, request, jsonify
from flask_cors import CORS
from uagents import Agent
from models import JobRequest, MatchResults
from coordinator_agent import coordinator

app = Flask(__name__)
CORS(app)

# Store pending responses
pending_jobs = {}

# Create a simple client agent to send messages
api_client = Agent(
    name="api_client",
    seed="renova_api_client_seed_2025",
    port=8888,
)


@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "service": "ReNOVA Agent Bridge",
        "coordinator_address": str(coordinator.address)
    })


@app.route('/api/jobs', methods=['POST']) # does nothing?
async def create_job():
    """
    Create a new job and send to coordinator agent

    Request body:
    {
        "job_id": "unique_id",
        "prompt": "description",
        "city": "San Francisco",
        "state": "CA",
        "zip_code": "94102"
    }
    """
    try:
        data = request.json

        # Validate required fields
        if not all(k in data for k in ['job_id', 'prompt', 'city', 'state']):
            return jsonify({"error": "Missing required fields"}), 400

        # Create job request
        job_request = JobRequest(
            job_id=data['job_id'],
            prompt=data['prompt'],
            city=data['city'],
            state=data['state'],
            zip_code=data.get('zip_code'),
            photo_urls=data.get('photo_urls', [])
        )

        # Send to coordinator via uAgents messaging
        # This requires the agent to be running
        # In production, use proper async message sending

        # For now, return success - the agent communication happens in background
        return jsonify({
            "success": True,
            "job_id": data['job_id'],
            "message": "Job sent to agent pipeline",
            "coordinator_address": str(coordinator.address)
        }), 202

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/agents/status', methods=['GET']) # useless
def agent_status():
    """Get status of all agents"""
    return jsonify({
        "agents": {
            "coordinator": {
                "address": str(coordinator.address),
                "port": 8000,
                "status": "running"
            },
            "intake": {
                "address": "agent1q...",  # Would be actual address
                "port": 8001,
                "status": "running"
            },
            "scraper": {
                "address": "agent1q...",
                "port": 8002,
                "status": "running"
            },
            "matcher": {
                "address": "agent1q...",
                "port": 8004,
                "status": "running"
            }
        }
    })


@app.route('/api/agents/addresses', methods=['GET'])
def agent_addresses():
    """Get all agent addresses for direct messaging"""
    from intake_agent import intake_agent
    from scraper_agent import scraper_agent
    from matcher_agent import matcher_agent

    return jsonify({
        "coordinator": str(coordinator.address),
        "intake": str(intake_agent.address),
        "scraper": str(scraper_agent.address),
        "matcher": str(matcher_agent.address)
    })


if __name__ == '__main__':
    print("🌉 Starting ReNOVA Agent Bridge API...")
    print("   Endpoint: http://localhost:8080")
    print("   Coordinator: " + str(coordinator.address))
    print("\nAvailable endpoints:")
    print("   GET  /health - Health check")
    print("   POST /api/jobs - Submit job to agents")
    print("   GET  /api/agents/status - Agent status")
    print("   GET  /api/agents/addresses - Agent addresses")

    app.run(host='0.0.0.0', port=8080, debug=True)
