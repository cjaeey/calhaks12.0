#!/bin/bash

# 🚀 ReNOVA Fetch.ai Agents - Complete Setup & Run Script
# This script sets up everything and starts your agents

set -e

echo "=============================================="
echo "🚀 ReNOVA Fetch.ai Agent Setup"
echo "=============================================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if in correct directory
if [ ! -f "coordinator_agent.py" ]; then
    echo "❌ Error: Run this script from agents_python directory"
    echo "   cd agents_python && bash setup_and_run.sh"
    exit 1
fi

# Step 1: Check Python
echo -e "${BLUE}📋 Step 1: Checking Python...${NC}"
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 not found. Please install Python 3.8+"
    exit 1
fi
PYTHON_VERSION=$(python3 --version)
echo -e "${GREEN}✅ Found $PYTHON_VERSION${NC}"
echo ""

# Step 2: Create virtual environment
echo -e "${BLUE}📋 Step 2: Setting up Python environment...${NC}"
if [ ! -d "venv" ]; then
    python3 -m venv venv
    echo -e "${GREEN}✅ Created virtual environment${NC}"
else
    echo -e "${GREEN}✅ Virtual environment already exists${NC}"
fi
echo ""

# Step 3: Activate and install dependencies
echo -e "${BLUE}📋 Step 3: Installing dependencies...${NC}"
source venv/bin/activate
pip install -q --upgrade pip
pip install -q -r requirements.txt
echo -e "${GREEN}✅ Dependencies installed${NC}"
echo ""

# Step 4: Check environment variables
echo -e "${BLUE}📋 Step 4: Checking environment variables...${NC}"
if [ -z "$ANTHROPIC_API_KEY" ]; then
    echo -e "${YELLOW}⚠️  ANTHROPIC_API_KEY not set${NC}"
    echo "   Agents will use fallback modes"
else
    echo -e "${GREEN}✅ ANTHROPIC_API_KEY is set${NC}"
fi

if [ -z "$YELP_API_KEY" ]; then
    echo -e "${YELLOW}⚠️  YELP_API_KEY not set${NC}"
    echo "   Will use template contractors"
else
    echo -e "${GREEN}✅ YELP_API_KEY is set${NC}"
fi
echo ""

# Step 5: Get agent information
echo -e "${BLUE}📋 Step 5: Getting agent addresses...${NC}"
python get_agent_info.py 2>/dev/null | grep -A5 "Agent Address"
echo ""

# Step 6: Check ngrok
echo -e "${BLUE}📋 Step 6: Checking ngrok...${NC}"
if command -v ngrok &> /dev/null; then
    echo -e "${GREEN}✅ ngrok is installed${NC}"
else
    echo -e "${YELLOW}⚠️  ngrok not found${NC}"
    echo "   Install with: brew install ngrok"
    echo "   OR download from: https://ngrok.com/download"
fi
echo ""

# Final instructions
echo "=============================================="
echo "✅ SETUP COMPLETE!"
echo "=============================================="
echo ""
echo -e "${GREEN}🎯 NEXT STEPS:${NC}"
echo ""
echo "1️⃣  START AGENTS (this terminal):"
echo -e "   ${BLUE}python coordinator_agent.py${NC}"
echo ""
echo "2️⃣  EXPOSE WITH NGROK (new terminal):"
echo -e "   ${BLUE}ngrok http 8000${NC}"
echo "   Copy the https://xxx.ngrok.io URL"
echo ""
echo "3️⃣  REGISTER ON AGENTVERSE:"
echo "   • Go to: https://agentverse.ai"
echo "   • Create account"
echo "   • Add agent with details from AGENTVERSE_REGISTRATION.md"
echo ""
echo "=============================================="
echo ""
echo "📚 Documentation:"
echo "   • AGENTVERSE_REGISTRATION.md - Quick registration guide"
echo "   • AGENTVERSE_DEPLOYMENT.md - Full deployment docs"
echo "   • README.md - Complete agent documentation"
echo ""
echo "🎉 Ready for CalHacks! Good luck!"
echo "=============================================="
echo ""

# Ask if user wants to start agents now
read -p "Start agents now? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo "🚀 Starting ReNOVA Agents..."
    echo ""
    python coordinator_agent.py
fi
