"""
Message models for Fetch.ai agent communication
"""
from uagents import Model
from typing import List, Optional


class JobRequest(Model):
    """Initial job request from user"""
    job_id: str
    prompt: str
    city: str
    state: str
    zip_code: Optional[str] = None
    photo_urls: List[str] = []


class JobScope(Model):
    """Analyzed job scope from IntakeAgent"""
    job_id: str
    trade: str
    services: List[str]
    urgency: str  # low, normal, high, emergency
    project_type: str
    budget_hint: Optional[str] = None
    location_requirements: Optional[str] = None


class ProfessionalData(Model):
    """Professional contractor data"""
    id: str
    name: str
    trade: str
    city: str
    state: str
    services: List[str]
    rating: float
    price_band: str
    license: Optional[str] = None
    website: Optional[str] = None
    bio: Optional[str] = None


class ProfessionalsList(Model):
    """List of professionals from ScraperAgent"""
    job_id: str
    professionals: List[dict]  # Will be serialized ProfessionalData
    count: int


class IndexingComplete(Model):
    """Confirmation that professionals are indexed"""
    job_id: str
    count: int
    indexed_ids: List[str]


class MatchRequest(Model):
    """Request to find and rank matches"""
    job_id: str
    job_scope: dict  # Serialized JobScope
    location: dict  # {city, state}


class Match(Model):
    """A single contractor match with reasoning"""
    professional_id: str
    score: float
    reason: str
    concerns: Optional[str] = None


class MatchResults(Model):
    """Final match results from MatcherAgent"""
    job_id: str
    matches: List[dict]  # Serialized Match objects
    count: int
    success: bool


class ProgressUpdate(Model):
    """Progress update for real-time tracking"""
    job_id: str
    stage: str
    message: str
    timestamp: str


class ErrorMessage(Model):
    """Error notification"""
    job_id: str
    agent: str
    error: str
    timestamp: str
