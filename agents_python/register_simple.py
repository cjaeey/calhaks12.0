"""
Simple Agentverse Registration
"""
import os
import requests

AGENTVERSE_KEY = "eyJhbGciOiJSUzI1NiJ9.eyJleHAiOjE3NjE0NDY2MTksImlhdCI6MTc2MTQ0MzAxOSwiaXNzIjoiZmV0Y2guYWkiLCJqdGkiOiJjNmZhY2E5Y2I5MWRjZDc1NDhkYjY5NDEiLCJzY29wZSI6IiIsInN1YiI6IjQ1ZjllYzdjMGFkMDZjMmE2NzA5NTBiNWYyMzAyODdlOWE4N2Q0OWYxYTA5ZTk0YiJ9.H6lvTGDwoRvld-8sl6ji7cNFE3jBGmpWwfuxaKtnDxQ3N9M_RQ9DYpbDwTkjylCuP588Xx9HXsAfutv-KOou3jvDuB1gwBZml26FU7rX2GaL2oHj7LeGDzMkMDF_EEZNh1x3rasaG-WBT1LPAJc8btCI6w_8Xni7qx2GToh3GLheC7RwjckOtZe4psNQBJcNvZobCnkSBNG8TKS3CXwYHFbODiazXWGKYXij_90dnx3hREMlaH2YefazcFmDhEU6553zxLELTPrQdlX-B1WmNgbrKkvDtF5E7uEaTPVJ-0yNdvRlTqoJETOTlIk-OIa7FGeFJghIyNlHGSiy6z5x6w"

# Agent details
agent_address = "agent1qw9dtncvja2e4t2lq8w86dwtrkwmuzwd64dcspsq8y5eet638ww82lk92fg"
agent_name = "ReNOVA Coordinator"
endpoint_url = "https://drippily-odoriferous-gordon.ngrok-free.dev/submit"

print("🚀 Registering agent with Agentverse API...")
print(f"Agent Name: {agent_name}")
print(f"Agent Address: {agent_address}")
print(f"Endpoint: {endpoint_url}")
print()

# Try to register via Agentverse API
url = "https://agentverse.ai/v1/hosting/agents"

headers = {
    "Authorization": f"Bearer {AGENTVERSE_KEY}",
    "Content-Type": "application/json"
}

payload = {
    "address": agent_address,
    "name": agent_name,
    "endpoint": endpoint_url,
    "protocols": ["CoordinatorProtocol"],
    "readme": "AI-powered contractor matching coordinator using multi-agent system"
}

try:
    response = requests.post(url, json=payload, headers=headers)
    print(f"Response Status: {response.status_code}")
    print(f"Response: {response.text}")

    if response.status_code in [200, 201]:
        print()
        print("✅ Agent successfully registered with Agentverse!")
    else:
        print()
        print("⚠️ Registration response received. Check Agentverse dashboard.")

except Exception as e:
    print(f"Error: {e}")
    print()
    print("Note: You may need to register manually via the Agentverse web interface.")
