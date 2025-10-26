# 🚀 Deploying ReNOVA Agents to Agentverse

Complete guide for deploying your Fetch.ai uAgents to Agentverse for CalHacks demo.

## 📋 What You Have

✅ **4 Production-Ready Fetch.ai uAgents:**
- `coordinator_agent.py` - Orchestrator (port 8000)
- `intake_agent.py` - Claude AI analysis (port 8001)
- `scraper_agent.py` - Yelp contractor search (port 8002)
- `matcher_agent.py` - AI ranking (port 8004)

✅ **Complete Infrastructure:**
- Message models (`models.py`)
- API bridge (`api_bridge.py`)
- Requirements (`requirements.txt`)
- Documentation (`README.md`)

## 🎯 Quick Demo (Local)

Perfect for presenting at CalHacks before full deployment:

```bash
cd agents_python

# 1. Install
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# 2. Set environment
export ANTHROPIC_API_KEY="your_key"
export YELP_API_KEY="your_key"

# 3. Run all agents
python coordinator_agent.py
```

This starts ALL agents in a Bureau - perfect for live demos!

**Demo URLs:**
- Coordinator: http://localhost:8000
- IntakeAgent: http://localhost:8001
- ScraperAgent: http://localhost:8002
- MatcherAgent: http://localhost:8004

## 🌐 Full Agentverse Deployment

### Step 1: Prepare Agents

Each agent needs a unique seed for production:

```python
# Use environment variables
Agent(
    name="intake_agent",
    seed=os.getenv("INTAKE_AGENT_SEED", "default_dev_seed"),
    port=8001,
    endpoint=[os.getenv("INTAKE_ENDPOINT", "http://localhost:8001/submit")]
)
```

### Step 2: Deploy to Cloud

Deploy each agent to a cloud server (AWS, GCP, DigitalOcean, etc.):

```bash
# Example: AWS EC2
ssh ubuntu@your-server

# Install Python + dependencies
sudo apt update
sudo apt install python3-pip
git clone your-repo
cd agents_python
pip3 install -r requirements.txt

# Run with systemd
sudo systemctl enable renova-intake-agent
sudo systemctl start renova-intake-agent
```

### Step 3: Register on Agentverse

1. Go to https://agentverse.ai
2. Sign up / Log in
3. Click "Create Agent"
4. Fill in details:

```
Agent Name: ReNOVA Intake Agent
Address: agent1q... (from agent.address)
Endpoint: https://your-domain.com:8001/submit
Protocols: JobIntakeProtocol
Description: AI-powered contractor matching intake agent
```

5. Repeat for each agent
6. Publish to marketplace!

### Step 4: Configure Communication

Update agent addresses in your code:

```python
# After registration, use actual Agentverse addresses
COORDINATOR_ADDRESS = "agent1qf5gfqm48k9acegez4tqzmk5r8xdvddyds50l3h4p9cdv9f6lxhgn3a4tz0"
INTAKE_ADDRESS = "agent1q2dhtu0a0c3q5y6hx8g3nj9hz5sj5t84nz8m5f95q4z6j8k9l3m5n6p7q8r9"
# etc...
```

### Step 5: Test End-to-End

```bash
# Send test message via Agentverse
curl -X POST https://agentverse.ai/v1/submit \
  -H "Authorization: Bearer YOUR_AGENTVERSE_API_KEY" \
  -d '{
    "target": "agent1q...",
    "message": {
      "job_id": "demo123",
      "prompt": "Fix bathroom sink",
      "city": "San Francisco",
      "state": "CA"
    }
  }'
```

## 🎬 CalHacks Demo Strategy

### Option 1: Local Demo (Easiest)

**What to Say:**
> "Our agents run on Fetch.ai's uAgents SDK. Here they are running locally, but they're designed to deploy to Agentverse for decentralized operation."

**Show:**
1. Terminal with all agents running
2. Agent addresses
3. Message logs
4. Live job processing

### Option 2: Hybrid (Impressive)

**What to Say:**
> "Our coordinator runs on Agentverse (show dashboard), while specialized agents run on our servers. This demonstrates how agents can be distributed across the network."

**Show:**
1. Agentverse dashboard
2. One agent on Agentverse
3. Others local
4. Messages flowing between them

### Option 3: Full Cloud (Most Impressive)

**What to Say:**
> "All our agents are deployed to Agentverse, running autonomously on the Fetch.ai network. Anyone can discover and use them through the agent marketplace."

**Show:**
1. Agentverse marketplace listing
2. Agent discovery
3. Live message flow
4. Autonomous operation

## 📊 Demo Script

### 1. Introduction (30 seconds)

"ReNOVA uses Fetch.ai's uAgents SDK to create autonomous contractor-matching agents that can run on Agentverse. Let me show you..."

### 2. Show Agents (30 seconds)

```bash
# Terminal 1
python coordinator_agent.py
```

Point out:
- Agent addresses
- Ports
- Bureau endpoint

### 3. Submit Job (30 seconds)

Use the API bridge or frontend:

```bash
# Send test job
curl localhost:5000/api/jobs -d '{...}'
```

### 4. Show Message Flow (1 minute)

Watch the logs:
```
🚀 Coordinator: Received job abc123
📋 IntakeAgent: Analyzing with Claude...
✅ IntakeAgent: Job scope created
🔍 ScraperAgent: Searching Yelp...
✅ ScraperAgent: Found 8 professionals
🎯 MatcherAgent: Ranking with Claude...
✅ MatcherAgent: Top 10 matches ready
🎉 Pipeline complete!
```

### 5. Show Results (30 seconds)

Display matched contractors with AI reasoning.

### 6. Agentverse Potential (30 seconds)

"These agents are ready to deploy to Agentverse where they can:
- Run 24/7 autonomously
- Be discovered by other agents
- Participate in the agent economy
- Scale independently"

## 🏆 Key Talking Points

1. **"Real Fetch.ai uAgents"**
   - Not just a design pattern
   - Using actual uAgents SDK
   - Deploy to Agentverse ready

2. **"Autonomous & Decentralized"**
   - Each agent runs independently
   - No single point of failure
   - Scalable architecture

3. **"Production Quality"**
   - Type-safe message models
   - Error handling
   - Fallback modes
   - Logging & monitoring

4. **"AI-Powered"**
   - Claude for analysis & ranking
   - Vector search (ChromaDB)
   - Real contractor data (Yelp)

## 🐛 Troubleshooting

### Agents Won't Start

```bash
# Check Python version
python3 --version  # Need 3.8+

# Check dependencies
pip list | grep uagents

# Check ports
lsof -i :8000-8004
```

### Messages Not Flowing

```bash
# Verify agent addresses
python -c "from coordinator_agent import coordinator; print(coordinator.address)"

# Check logs
tail -f logs/*.log
```

### API Key Issues

```bash
# Verify environment
echo $ANTHROPIC_API_KEY
echo $YELP_API_KEY

# Test Claude
python -c "import anthropic; print('OK')"
```

## 📈 After CalHacks

To actually deploy to Agentverse:

1. ✅ Secure agent seeds (generate with `uagents.generate_seed()`)
2. ✅ Deploy to cloud (AWS/GCP/Azure)
3. ✅ Configure HTTPS endpoints
4. ✅ Register on Agentverse
5. ✅ Test inter-agent messaging
6. ✅ Publish to marketplace
7. ✅ Monitor performance
8. ✅ Scale as needed

## 🎓 Learning Resources

- **Fetch.ai Docs**: https://docs.fetch.ai
- **uAgents Guide**: https://fetch.ai/docs/guides/agents/getting-started
- **Agentverse Tutorial**: https://fetch.ai/docs/guides/agentverse
- **Example Agents**: https://github.com/fetchai/uAgents/tree/main/python/examples

## 💡 Tips for Judges

**Highlight:**
- ✨ Real Fetch.ai integration (not just buzzwords)
- ✨ Agentverse deployment ready
- ✨ Autonomous operation
- ✨ Scalable architecture
- ✨ Production quality code
- ✨ Complete documentation

**Demo:**
- Live agents running
- Message flow visualization
- Real-time processing
- Agent addresses & protocols

**Explain:**
- Why agents vs monolith
- How Agentverse works
- Future potential
- Decentralization benefits

---

## 🚀 Ready to Impress!

You now have **REAL Fetch.ai uAgents** that can:
- ✅ Run locally for demo
- ✅ Deploy to cloud servers
- ✅ Register on Agentverse
- ✅ Operate autonomously
- ✅ Scale independently

**This is exactly what Fetch.ai wants to see at CalHacks!** 🏆

Good luck with your presentation! 🎉
