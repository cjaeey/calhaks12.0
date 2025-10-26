"""
IntakeAgent - Analyzes job requests using Claude AI
Fetch.ai uAgent for Agentverse deployment
"""
import os
import json
import anthropic
from datetime import datetime
from uagents import Agent, Context, Protocol
from models import JobRequest, JobScope, ProgressUpdate, ErrorMessage

# Create agent
intake_agent = Agent(
    name="intake_agent",
    seed="renova_intake_seed_phrase_2025",
    port=8001,
    endpoint=["http://localhost:8001/submit"],
)

# Initialize Claude client
claude_client = anthropic.Anthropic(
    api_key=os.getenv("ANTHROPIC_API_KEY", "demo-key")
)

# Define protocol
intake_protocol = Protocol("JobIntakeProtocol")


async def analyze_job_with_claude(prompt: str, ctx: Context) -> dict:
    """Call Claude API to analyze job request"""
    try:
        ctx.logger.info(f"Analyzing job with Claude: {prompt[:50]}...")

        message = f"""Analyze this job request and extract structured information.

Job Description: {prompt}

Extract:
1. The primary trade/profession needed
2. Specific services required
3. Project urgency level
4. Budget tier if mentioned
5. Type of project

Respond with ONLY a JSON object matching this schema:
{{
  "trade": "primary trade category",
  "services": ["service1", "service2"],
  "urgency": "low|normal|high|emergency",
  "budget_hint": "low|medium|high|premium",
  "project_type": "installation|repair|maintenance|renovation",
  "location_requirements": "any specific location notes"
}}"""

        response = claude_client.messages.create(
            model="claude-3-opus-20240229",
            max_tokens=1024,
            messages=[{"role": "user", "content": message}]
        )

        content = response.content[0].text
        ctx.logger.info(f"Claude response: {content[:100]}...")

        # Extract JSON
        json_start = content.find('{')
        json_end = content.rfind('}') + 1

        if json_start >= 0 and json_end > json_start:
            json_str = content[json_start:json_end]
            result = json.loads(json_str)
            return result
        else:
            raise ValueError("No JSON found in Claude response")

    except Exception as e:
        ctx.logger.error(f"Claude analysis failed: {str(e)}")
        # Return fallback scope
        return {
            "trade": "General Contractor",
            "services": ["general services"],
            "urgency": "normal",
            "project_type": "general",
            "budget_hint": "medium"
        }


@intake_protocol.on_message(model=JobRequest)
async def handle_job_request(ctx: Context, sender: str, msg: JobRequest):
    """Process incoming job request"""
    ctx.logger.info(f"Received job request {msg.job_id} from {sender}")

    try:
        # Publish progress update
        await ctx.send(
            sender,
            ProgressUpdate(
                job_id=msg.job_id,
                stage="intake",
                message="Analyzing your project requirements with AI",
                timestamp=datetime.utcnow().isoformat()
            )
        )

        # Analyze with Claude
        analysis = await analyze_job_with_claude(msg.prompt, ctx)

        # Create job scope
        job_scope = JobScope(
            job_id=msg.job_id,
            trade=analysis.get("trade", "General Contractor"),
            services=analysis.get("services", ["general services"]),
            urgency=analysis.get("urgency", "normal"),
            project_type=analysis.get("project_type", "general"),
            budget_hint=analysis.get("budget_hint"),
            location_requirements=analysis.get("location_requirements")
        )

        ctx.logger.info(f"Job scope created: trade={job_scope.trade}, services={job_scope.services}")

        # Send to coordinator (sender)
        await ctx.send(sender, job_scope)

    except Exception as e:
        ctx.logger.error(f"Error processing job request: {str(e)}")
        await ctx.send(
            sender,
            ErrorMessage(
                job_id=msg.job_id,
                agent="intake_agent",
                error=str(e),
                timestamp=datetime.utcnow().isoformat()
            )
        )


# Include protocol
intake_agent.include(intake_protocol)


if __name__ == "__main__":
    print("🤖 IntakeAgent starting...")
    print(f"   Address: {intake_agent.address}")
    print(f"   Port: 8001")
    print(f"   Endpoint: http://localhost:8001/submit")
    intake_agent.run()
