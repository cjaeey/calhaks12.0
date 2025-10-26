"""
Register ReNOVA Coordinator Agent with Agentverse
"""
import os
from uagents_core.utils.registration import register_in_agentverse, AgentverseConfig
from uagents_core import Identity

# Create identity from seed phrase
seed_phrase = os.environ["AGENT_SEED_PHRASE"]
identity = Identity.from_seed(seed_phrase, 0)

# Configure Agentverse
config = AgentverseConfig(
    api_key=os.environ["AGENTVERSE_KEY"],
)

# Register the agent
print("🚀 Registering agent with Agentverse...")
print(f"Agent Address: {identity.address}")
print(f"Endpoint: https://drippily-odoriferous-gordon.ngrok-free.dev/submit")

response = register_in_agentverse(
    identity=identity,
    endpoint="https://drippily-odoriferous-gordon.ngrok-free.dev/submit",
    agentverse_token=os.environ["AGENTVERSE_KEY"],
    agent_title="ReNOVA Coordinator",
    readme="AI-powered contractor matching coordinator using multi-agent system"
)

print("✅ Agent successfully registered with Agentverse!")
print(f"Response: {response}")
