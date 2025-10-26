"""
CoordinatorAgent - Orchestrates the entire matching pipeline
Fetch.ai uAgent for Agentverse deployment
"""
import asyncio
from datetime import datetime
from uagents import Agent, Context, Protocol, Bureau
from models import (
    JobRequest, JobScope, ProfessionalsList, IndexingComplete,
    MatchRequest, MatchResults, ProgressUpdate, ErrorMessage
)

# Import other agents
from intake_agent import intake_agent
from scraper_agent import scraper_agent
from matcher_agent import matcher_agent

# Create coordinator agent
import os

# Get ngrok URL from environment, fallback to localhost
NGROK_URL = os.getenv("NGROK_URL", "http://localhost:8000")

coordinator = Agent(
    name="ReNOVA Coordinator",
    seed="renova_coordinator_seed_phrase_2025",
    port=8000,
    endpoint=[f"{NGROK_URL}/submit"],
)

# Define protocol
coordinator_protocol = Protocol("CoordinatorProtocol")

# Store job state
job_states = {}


@coordinator_protocol.on_message(model=JobRequest)
async def handle_job_request(ctx: Context, sender: str, msg: JobRequest):
    """Coordinate the entire pipeline"""
    ctx.logger.info(f"🚀 Starting pipeline for job {msg.job_id}")

    # Initialize job state
    job_states[msg.job_id] = {
        "status": "processing",
        "sender": sender,
        "job_data": msg,
        "stage": "intake"
    }

    try:
        # Send progress
        await ctx.send(
            sender,
            ProgressUpdate(
                job_id=msg.job_id,
                stage="started",
                message="Processing your request...",
                timestamp=datetime.utcnow().isoformat()
            )
        )

        # Step 1: Send to IntakeAgent
        ctx.logger.info(f"📋 Sending to IntakeAgent...")
        await ctx.send(intake_agent.address, msg)

    except Exception as e:
        ctx.logger.error(f"Error starting pipeline: {str(e)}")
        await ctx.send(
            sender,
            ErrorMessage(
                job_id=msg.job_id,
                agent="coordinator",
                error=str(e),
                timestamp=datetime.utcnow().isoformat()
            )
        )


@coordinator_protocol.on_message(model=JobScope)
async def handle_job_scope(ctx: Context, sender: str, msg: JobScope):
    """Received job scope from IntakeAgent"""
    ctx.logger.info(f"✅ Received job scope for {msg.job_id}")

    job_state = job_states.get(msg.job_id)
    if not job_state:
        ctx.logger.error(f"No job state found for {msg.job_id}")
        return

    try:
        # Update state
        job_state["job_scope"] = msg
        job_state["stage"] = "scrape"

        # Step 2: Send to ScraperAgent
        ctx.logger.info(f"🔍 Sending to ScraperAgent...")
        await ctx.send(scraper_agent.address, msg)

    except Exception as e:
        ctx.logger.error(f"Error in job scope handling: {str(e)}")
        await ctx.send(
            job_state["sender"],
            ErrorMessage(
                job_id=msg.job_id,
                agent="coordinator",
                error=str(e),
                timestamp=datetime.utcnow().isoformat()
            )
        )


@coordinator_protocol.on_message(model=ProfessionalsList)
async def handle_professionals(ctx: Context, sender: str, msg: ProfessionalsList):
    """Received professionals from ScraperAgent"""
    ctx.logger.info(f"✅ Received {msg.count} professionals for {msg.job_id}")

    job_state = job_states.get(msg.job_id)
    if not job_state:
        ctx.logger.error(f"No job state found for {msg.job_id}")
        return

    try:
        # Update state
        job_state["professionals"] = msg.professionals
        job_state["stage"] = "match"

        # Step 3: Send to MatcherAgent
        ctx.logger.info(f"🎯 Sending to MatcherAgent...")

        # Prepare match request with candidates
        job_scope_dict = {
            "trade": job_state["job_scope"].trade,
            "services": job_state["job_scope"].services,
            "urgency": job_state["job_scope"].urgency,
            "candidates": msg.professionals  # Include for ranking
        }

        match_request = MatchRequest(
            job_id=msg.job_id,
            job_scope=job_scope_dict,
            location={
                "city": job_state["job_data"].city,
                "state": job_state["job_data"].state
            }
        )

        await ctx.send(matcher_agent.address, match_request)

    except Exception as e:
        ctx.logger.error(f"Error handling professionals: {str(e)}")
        await ctx.send(
            job_state["sender"],
            ErrorMessage(
                job_id=msg.job_id,
                agent="coordinator",
                error=str(e),
                timestamp=datetime.utcnow().isoformat()
            )
        )


@coordinator_protocol.on_message(model=MatchResults)
async def handle_match_results(ctx: Context, sender: str, msg: MatchResults):
    """Received final matches from MatcherAgent"""
    ctx.logger.info(f"✅ Received {msg.count} matches for {msg.job_id}")

    job_state = job_states.get(msg.job_id)
    if not job_state:
        ctx.logger.error(f"No job state found for {msg.job_id}")
        return

    try:
        # Update state
        job_state["matches"] = msg.matches
        job_state["status"] = "completed"
        job_state["stage"] = "done"

        # Send final results back to original sender
        await ctx.send(job_state["sender"], msg)

        # Send completion progress
        await ctx.send(
            job_state["sender"],
            ProgressUpdate(
                job_id=msg.job_id,
                stage="done",
                message=f"Found {msg.count} qualified professionals!",
                timestamp=datetime.utcnow().isoformat()
            )
        )

        ctx.logger.info(f"🎉 Pipeline complete for {msg.job_id}")

    except Exception as e:
        ctx.logger.error(f"Error sending final results: {str(e)}")


@coordinator_protocol.on_message(model=ErrorMessage)
async def handle_error(ctx: Context, sender: str, msg: ErrorMessage):
    """Handle error from any agent"""
    ctx.logger.error(f"❌ Error from {msg.agent} for job {msg.job_id}: {msg.error}")

    job_state = job_states.get(msg.job_id)
    if job_state:
        # Forward error to original sender
        await ctx.send(job_state["sender"], msg)


# Include protocol
coordinator.include(coordinator_protocol)


def create_bureau():
    """Create a bureau to run all agents together"""
    bureau = Bureau(port=8888, endpoint="http://localhost:8888/submit")

    bureau.add(coordinator)
    bureau.add(intake_agent)
    bureau.add(scraper_agent)
    bureau.add(matcher_agent)

    return bureau


if __name__ == "__main__":
    print("🎮 Starting ReNOVA Agent Bureau...")
    print("=" * 50)
    print("Agents:")
    print(f"  🎮 Coordinator:  {coordinator.address} (port 8000)")
    print(f"  📋 IntakeAgent:  {intake_agent.address} (port 8001)")
    print(f"  🔍 ScraperAgent: {scraper_agent.address} (port 8002)")
    print(f"  🎯 MatcherAgent:  {matcher_agent.address} (port 8004)")
    print("=" * 50)
    print("\n✨ All agents ready for deployment to Agentverse!")
    print("📡 Bureau endpoint: http://localhost:8888/submit\n")

    # Run all agents in a bureau
    bureau = create_bureau()
    bureau.run()
