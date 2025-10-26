"""
Get agent addresses and registration info for Agentverse
Run this to get all the details you need to register on agentverse.ai
"""
import sys
import os

# Add current directory to path
sys.path.insert(0, os.path.dirname(__file__))

from coordinator_agent import coordinator
from intake_agent import intake_agent
from scraper_agent import scraper_agent
from matcher_agent import matcher_agent

print("=" * 70)
print("🚀 RENOVA AGENT INFORMATION FOR AGENTVERSE")
print("=" * 70)
print()

agents = [
    {
        "name": "Coordinator Agent",
        "agent": coordinator,
        "port": 8000,
        "protocol": "CoordinatorProtocol",
        "description": "Orchestrates the entire contractor matching pipeline"
    },
    {
        "name": "Intake Agent",
        "agent": intake_agent,
        "port": 8001,
        "protocol": "JobIntakeProtocol",
        "description": "Analyzes job requests using Claude AI"
    },
    {
        "name": "Scraper Agent",
        "agent": scraper_agent,
        "port": 8002,
        "protocol": "ProfessionalScrapingProtocol",
        "description": "Finds professionals using Yelp API"
    },
    {
        "name": "Matcher Agent",
        "agent": matcher_agent,
        "port": 8004,
        "protocol": "MatcherProtocol",
        "description": "Ranks professionals using Claude AI"
    }
]

print("📋 STEP 1: Copy these agent details")
print("-" * 70)
print()

for info in agents:
    print(f"🤖 {info['name']}")
    print(f"   Address: {info['agent'].address}")
    print(f"   Port: {info['port']}")
    print(f"   Protocol: {info['protocol']}")
    print(f"   Description: {info['description']}")
    print(f"   Local Endpoint: http://localhost:{info['port']}/submit")
    print()

print("=" * 70)
print()
print("📋 STEP 2: Go to https://agentverse.ai")
print("   - Create account or login")
print("   - Click 'My Agents' → '+ New Agent'")
print()
print("📋 STEP 3: For each agent above, fill in:")
print("   - Agent Name: (copy from above)")
print("   - Agent Address: (copy the full address)")
print("   - Description: (copy from above)")
print("   - Endpoint URL: Use ngrok URL (see below)")
print()
print("=" * 70)
print()
print("🌐 STEP 4: Expose agents with ngrok (for demo)")
print("-" * 70)
print()
print("Install ngrok: brew install ngrok  (or from https://ngrok.com)")
print()
print("Then run these commands in separate terminals:")
print()

for info in agents:
    print(f"Terminal {info['port']}: ngrok http {info['port']}")
    print(f"  → Copy the https://xxx.ngrok.io URL for {info['name']}")
    print()

print("=" * 70)
print()
print("✅ QUICK START: Run all agents now!")
print("-" * 70)
print()
print("Run this command:")
print("  python coordinator_agent.py")
print()
print("This starts ALL agents in a Bureau.")
print()
print("=" * 70)
print()
print("💡 TIP: For CalHacks demo, you only need to register ONE agent")
print("   Register the Coordinator and show it working locally!")
print()
print("🎉 Ready to impress the judges!")
print("=" * 70)
