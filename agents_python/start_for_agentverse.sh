#!/bin/bash

# Start ReNOVA Coordinator Agent for Agentverse
echo "🚀 Starting ReNOVA Agent for Agentverse..."
echo ""

# Set ngrok URL
export NGROK_URL="https://drippily-odoriferous-gordon.ngrok-free.dev"

# Set Agentverse key
export AGENTVERSE_KEY="eyJhbGciOiJSUzI1NiJ9.eyJleHAiOjE3NjE0NDY2MTksImlhdCI6MTc2MTQ0MzAxOSwiaXNzIjoiZmV0Y2guYWkiLCJqdGkiOiJjNmZhY2E5Y2I5MWRjZDc1NDhkYjY5NDEiLCJzY29wZSI6IiIsInN1YiI6IjQ1ZjllYzdjMGFkMDZjMmE2NzA5NTBiNWYyMzAyODdlOWE4N2Q0OWYxYTA5ZTk0YiJ9.H6lvTGDwoRvld-8sl6ji7cNFE3jBGmpWwfuxaKtnDxQ3N9M_RQ9DYpbDwTkjylCuP588Xx9HXsAfutv-KOou3jvDuB1gwBZml26FU7rX2GaL2oHj7LeGDzMkMDF_EEZNh1x3rasaG-WBT1LPAJc8btCI6w_8Xni7qx2GToh3GLheC7RwjckOtZe4psNQBJcNvZobCnkSBNG8TKS3CXwYHFbODiazXWGKYXij_90dnx3hREMlaH2YefazcFmDhEU6553zxLELTPrQdlX-B1WmNgbrKkvDtF5E7uEaTPVJ-0yNdvRlTqoJETOTlIk-OIa7FGeFJghIyNlHGSiy6z5x6w"

# Set agent seed
export AGENT_SEED_PHRASE="renova_coordinator_seed_phrase_2025"

# Set API keys (optional)
export ANTHROPIC_API_KEY="${ANTHROPIC_API_KEY:-}"
export YELP_API_KEY="${YELP_API_KEY:-}"

echo "✅ Environment configured:"
echo "   Endpoint: $NGROK_URL"
echo "   Agent Address: agent1qw9dtncvja2e4t2lq8w86dwtrkwmuzwd64dcspsq8y5eet638ww82lk92fg"
echo ""
echo "🎯 Starting agent..."
echo ""

# Start the agent
python coordinator_agent.py
