"""
Chat Agent Wrapper for Agentverse
Wraps the ReNOVA Coordinator to make it compatible with Chat Agent registration
"""
from uagents import Agent, Context, Protocol, Model
from typing import Optional
import os

# Get configuration
NGROK_URL = os.getenv("NGROK_URL", "https://drippily-odoriferous-gordon.ngrok-free.dev")

# Define chat message model
class ChatMessage(Model):
    text: str
    sender: Optional[str] = "user"

# Create chat agent with same seed to get same address
chat_agent = Agent(
    name="ReNOVA Coordinator",
    seed="renova_coordinator_seed_phrase_2025",
    port=8000,
    endpoint=[f"{NGROK_URL}/submit"],
)

# Simple chat protocol
@chat_agent.on_message(model=ChatMessage)
async def handle_chat(ctx: Context, sender: str, msg: ChatMessage):
    """Handle chat messages and respond"""
    ctx.logger.info(f"Received chat message: {msg.text}")

    # Simple response
    response = f"ReNOVA Coordinator received your message: '{msg.text}'. This is a contractor matching service agent. To submit a job, please use the full JobRequest protocol."

    await ctx.send(sender, ChatMessage(text=response, sender="agent"))

# Add an interval to show it's alive
@chat_agent.on_interval(period=60.0)
async def heartbeat(ctx: Context):
    ctx.logger.info("Chat agent heartbeat")

if __name__ == "__main__":
    print("🎮 Starting Chat Wrapper for ReNOVA Coordinator")
    print(f"Agent Address: {chat_agent.address}")
    print(f"Endpoint: {NGROK_URL}/submit")
    chat_agent.run()
