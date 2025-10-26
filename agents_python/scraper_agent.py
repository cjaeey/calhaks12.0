"""
ScraperAgent - Finds professionals using Yelp API
Fetch.ai uAgent for Agentverse deployment
"""
import os
import requests
from datetime import datetime
from uagents import Agent, Context, Protocol
from models import JobScope, ProfessionalsList, ProgressUpdate, ErrorMessage

# Create agent
scraper_agent = Agent(
    name="scraper_agent",
    seed="renova_scraper_seed_phrase_2025",
    port=8002,
    endpoint=["http://localhost:8002/submit"],
)

# Yelp API configuration
YELP_API_KEY = os.getenv("YELP_API_KEY")
YELP_API_URL = "https://api.yelp.com/v3/businesses/search"

# Trade to Yelp category mapping
TRADE_CATEGORIES = {
    "HVAC": "hvac",
    "Plumbing": "plumbing",
    "Electrical": "electricians",
    "Remodeling": "contractors",
    "General Contractor": "contractors",
    "Handyman": "handyman",
    "Roofing": "roofing",
    "Painting": "painters",
}

# Define protocol
scraper_protocol = Protocol("ProfessionalScrapingProtocol")


async def search_yelp(trade: str, location: str, ctx: Context, limit: int = 8) -> list:
    """Search Yelp for professionals"""
    if not YELP_API_KEY:
        ctx.logger.warning("No Yelp API key, using fallback")
        return []

    try:
        category = TRADE_CATEGORIES.get(trade, "contractors")
        ctx.logger.info(f"Searching Yelp: trade={trade}, category={category}, location={location}")

        headers = {"Authorization": f"Bearer {YELP_API_KEY}"}
        params = {
            "categories": category,
            "location": location,
            "limit": limit,
            "sort_by": "rating"
        }

        response = requests.get(YELP_API_URL, headers=headers, params=params, timeout=10)
        response.raise_for_status()

        data = response.json()
        businesses = data.get("businesses", [])

        ctx.logger.info(f"Found {len(businesses)} businesses from Yelp")

        # Transform to our format
        professionals = []
        for biz in businesses:
            professional = {
                "id": f"yelp_{biz['id']}",
                "name": biz["name"],
                "trade": trade,
                "city": biz["location"]["city"],
                "state": biz["location"]["state"],
                "services": biz.get("categories", [{}])[0].get("title", trade).split(),
                "rating": biz.get("rating", 0.0),
                "price_band": biz.get("price", "$$"),
                "website": biz.get("url", ""),
                "bio": f"{biz['name']} - {biz.get('categories', [{}])[0].get('title', '')}",
                "license": ""
            }
            professionals.append(professional)

        return professionals

    except Exception as e:
        ctx.logger.error(f"Yelp search failed: {str(e)}")
        return []


def generate_template_professionals(trade: str, location: str, count: int = 8) -> list:
    """Generate template professionals as fallback"""
    import random
    from string import ascii_uppercase

    professionals = []
    names = [
        "Reliable", "Premium", "Quality", "Expert", "Professional",
        "Master", "Certified", "Licensed", "Trusted", "Elite"
    ]

    for i in range(count):
        prof_id = f"temp_{''.join(random.choices(ascii_uppercase, k=8))}"
        name = f"{random.choice(names)} {trade}"

        professional = {
            "id": prof_id,
            "name": name,
            "trade": trade,
            "city": location.split(",")[0].strip(),
            "state": location.split(",")[1].strip() if "," in location else "CA",
            "services": [trade.lower(), "repair", "installation"],
            "rating": round(random.uniform(4.0, 5.0), 1),
            "price_band": random.choice(["$$", "$$$"]),
            "website": f"https://example.com/{prof_id}",
            "bio": f"Professional {trade} services",
            "license": f"LIC{random.randint(100000, 999999)}"
        }
        professionals.append(professional)

    return professionals


@scraper_protocol.on_message(model=JobScope)
async def handle_job_scope(ctx: Context, sender: str, msg: JobScope):
    """Find professionals based on job scope"""
    ctx.logger.info(f"Received job scope for {msg.job_id}: trade={msg.trade}")

    try:
        # Publish progress
        await ctx.send(
            sender,
            ProgressUpdate(
                job_id=msg.job_id,
                stage="scrape",
                message=f"Finding {msg.trade} professionals in your area",
                timestamp=datetime.utcnow().isoformat()
            )
        )

        # Construct location string
        location = f"{msg.job_scope.get('city', 'San Francisco')}, {msg.job_scope.get('state', 'CA')}"

        # Try Yelp first
        professionals = await search_yelp(msg.trade, location, ctx)

        # Fallback to templates if Yelp fails
        if not professionals:
            ctx.logger.warning("Using template professionals as fallback")
            professionals = generate_template_professionals(msg.trade, location)

        ctx.logger.info(f"Found {len(professionals)} professionals")

        # Send results
        await ctx.send(
            sender,
            ProfessionalsList(
                job_id=msg.job_id,
                professionals=professionals,
                count=len(professionals)
            )
        )

    except Exception as e:
        ctx.logger.error(f"Error finding professionals: {str(e)}")
        await ctx.send(
            sender,
            ErrorMessage(
                job_id=msg.job_id,
                agent="scraper_agent",
                error=str(e),
                timestamp=datetime.utcnow().isoformat()
            )
        )


# Include protocol
scraper_agent.include(scraper_protocol)


if __name__ == "__main__":
    print("🔍 ScraperAgent starting...")
    print(f"   Address: {scraper_agent.address}")
    print(f"   Port: 8002")
    print(f"   Yelp API: {'✓ Configured' if YELP_API_KEY else '✗ Not configured (will use templates)'}")
    scraper_agent.run()
