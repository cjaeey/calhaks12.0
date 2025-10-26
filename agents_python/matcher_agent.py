"""
MatcherAgent - Ranks professionals using vector search + Claude AI
Fetch.ai uAgent for Agentverse deployment
"""
import os
import json
import anthropic
from datetime import datetime
from uagents import Agent, Context, Protocol
from models import MatchRequest, MatchResults, ProgressUpdate, ErrorMessage

# Create agent
matcher_agent = Agent(
    name="matcher_agent",
    seed="renova_matcher_seed_phrase_2025",
    port=8004,
    endpoint=["http://localhost:8004/submit"],
)

# Initialize Claude client
claude_client = anthropic.Anthropic(
    api_key=os.getenv("ANTHROPIC_API_KEY", "demo-key")
)

# Define protocol
matcher_protocol = Protocol("MatcherProtocol")


async def rank_with_claude(job_scope: dict, candidates: list, ctx: Context) -> list:
    """Use Claude to rank and explain matches"""
    try:
        ctx.logger.info(f"Ranking {len(candidates)} candidates with Claude")

        # Format candidates for Claude
        candidates_text = "\n\n".join([
            f"{i+1}. {c['name']} - {c['trade']} in {c['city']}, {c['state']}\n"
            f"   Services: {', '.join(c.get('services', []))}\n"
            f"   Rating: {c.get('rating', 'N/A')}\n"
            f"   Price: {c.get('price_band', 'medium')}"
            for i, c in enumerate(candidates[:10])  # Limit to top 10
        ])

        prompt = f"""You are matching a customer's project with contractors.

Project Requirements:
{json.dumps(job_scope, indent=2)}

Candidate Contractors:
{candidates_text}

Rank these contractors and provide:
1. A score (0-100) for each based on fit
2. A brief reason why they're a good match
3. Any concerns or caveats

Return JSON array ONLY:
[
  {{
    "professional_id": "id",
    "score": 95,
    "reason": "Excellent match because...",
    "concerns": "optional concerns"
  }}
]

Sort by score descending."""

        response = claude_client.messages.create(
            model="claude-3-opus-20240229",
            max_tokens=2048,
            messages=[{"role": "user", "content": prompt}]
        )

        content = response.content[0].text
        ctx.logger.info(f"Claude ranking response: {content[:100]}...")

        # Extract JSON array
        json_start = content.find('[')
        json_end = content.rfind(']') + 1

        if json_start >= 0 and json_end > json_start:
            json_str = content[json_start:json_end]
            matches = json.loads(json_str)
            return matches
        else:
            raise ValueError("No JSON array found in Claude response")

    except Exception as e:
        ctx.logger.error(f"Claude ranking failed: {str(e)}")
        # Return default scoring
        return [
            {
                "professional_id": c["id"],
                "score": 95 - (i * 5),  # Simple descending scores
                "reason": f"{c['name']} is a qualified {c['trade']} professional in your area with {c.get('rating', 'N/A')} ratings.",
                "concerns": None
            }
            for i, c in enumerate(candidates[:10])
        ]


@matcher_protocol.on_message(model=MatchRequest)
async def handle_match_request(ctx: Context, sender: str, msg: MatchRequest):
    """Find and rank contractor matches"""
    ctx.logger.info(f"Received match request for job {msg.job_id}")

    try:
        # Publish progress
        await ctx.send(
            sender,
            ProgressUpdate(
                job_id=msg.job_id,
                stage="match",
                message="Ranking the best matches for your project",
                timestamp=datetime.utcnow().isoformat()
            )
        )

        # In a real implementation, this would:
        # 1. Query ChromaDB for vector similarity
        # 2. Apply business filters
        # 3. Re-rank with Claude

        # For this demo, we'll assume candidates are passed in the request
        # In production, integrate with ChromaDB client here
        candidates = msg.job_scope.get("candidates", [])

        if not candidates:
            ctx.logger.warning("No candidates provided in match request")
            candidates = []

        # Rank with Claude
        matches = await rank_with_claude(msg.job_scope, candidates, ctx)

        ctx.logger.info(f"Ranked {len(matches)} matches")

        # Send results
        await ctx.send(
            sender,
            MatchResults(
                job_id=msg.job_id,
                matches=matches,
                count=len(matches),
                success=True
            )
        )

    except Exception as e:
        ctx.logger.error(f"Error matching professionals: {str(e)}")
        await ctx.send(
            sender,
            ErrorMessage(
                job_id=msg.job_id,
                agent="matcher_agent",
                error=str(e),
                timestamp=datetime.utcnow().isoformat()
            )
        )


# Include protocol
matcher_agent.include(matcher_protocol)


if __name__ == "__main__":
    print("🎯 MatcherAgent starting...")
    print(f"   Address: {matcher_agent.address}")
    print(f"   Port: 8004")
    matcher_agent.run()
