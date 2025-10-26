# Lava Payments Integration - CalHacks 12.0

## 🎯 Overview

ReNOVA uses **Lava Payments** for usage-based billing and tracking of AI API calls. Lava acts as a transparent proxy between our application and the Anthropic Claude API, providing:

- Real-time usage tracking
- Cost monitoring and analytics
- Billing management
- API call metrics

**Team:** calhacks12.0
**Credits:** $10 available for CalHacks demo

## 🔧 Setup Instructions

### 1. Environment Configuration

Add the following to your `.env` file:

```bash
# Enable Lava proxy (set to "true" to activate)
USE_LAVA=false

# Lava authentication credentials
LAVA_FORWARD_TOKEN=your_lava_forward_token_here
LAVA_SECRET_KEY=your_lava_secret_key_here
LAVA_CONNECTION_SECRET=your_lava_connection_secret_here
LAVA_PRODUCT_SECRET=your_lava_product_secret_here

# Your Anthropic API key (still required)
ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

### 2. Activate Lava

To enable Lava tracking, simply set:

```bash
USE_LAVA=true
```

The application will automatically route all Claude API calls through Lava.

### 3. Current Credentials (CalHacks 12.0)

For the judges and reviewers, here are our live credentials:

**Forward Token:**
```
eyJzZWNyZXRfa2V5IjoiYWtzX2xpdmVfQkkxal85dC1TVzhNRHdyelNxeE0tZ3JfaW5rdGdVNTU3LXBLaHdsZG9zYUlXdjNHdHY5dWpKViIsImNvbm5lY3Rpb25fc2VjcmV0IjoiY29uc19saXZlX011akU5X09LOVRBeXczX2MtZHo0bmFON094OFoxQ2ZXaWdYdzFzaFR4SmRFQUFZWmlCLW5UNSIsInByb2R1Y3Rfc2VjcmV0IjoicHNfbGl2ZV8yRjFkb2Q1ZURISU9OY3hRLW41OTBMSC1MbG81eW8wRzF6R2hxS2pRWmhibmpEMF85TWZaWFJsYiJ9
```

**Connection Secret:**
```
cons_live_MujE9_OK9TAyw3_c-dz4naN7Ox8Z1CfWigXw1shTxJdEAAYZiB-nT5
```

**Product Secret:**
```
ps_live_2F1dod5eDHIONcxQ-n590LH-Llo5yo0G1zGhqKjQZhbnjD0_9MfZXRlb
```

## 🏗️ Architecture

### How It Works

```
┌─────────────────┐
│  ReNOVA Client  │
└────────┬────────┘
         │
         ▼
┌─────────────────────┐
│  Backend/Agents     │
│  (Node.js/Python)   │
└────────┬────────────┘
         │
         ▼
    ┌────────┐
    │  Lava  │ ◄── Tracks usage, billing
    │  Proxy │      (with auto-fallback)
    └────┬───┘
         │ ✓ Success
         │
         │ ✗ Credits exhausted/Failed
         │
         ▼
┌────────────────┐
│  Anthropic     │ ◄── Direct API fallback
│  Claude API    │
└────────────────┘
```

### Automatic Fallback System

**ReNOVA never stops working!** If Lava credits are exhausted or the proxy fails:

1. ✅ **First**: Try Lava proxy (tracks usage and billing)
2. ⚠️ **If fails**: Automatically detect error (402, 429, or credit-related)
3. 🔄 **Fallback**: Switch to direct Anthropic API seamlessly
4. ✅ **Continue**: Application works without interruption

**Zero downtime** - Users never see an error!

### Backend (Node.js)

Located in: `backend/services/claudeClient.js`

The backend uses Axios to route requests through Lava:

```javascript
// Automatically routes through Lava when USE_LAVA=true
const response = await makeClaudeRequest({
  model: 'claude-3-haiku-20240307',
  max_tokens: 1024,
  messages: [...]
});
```

### Python Agents

Located in: `agents_python/lava_client.py`

Python agents use the `LavaClaudeClient` wrapper:

```python
from lava_client import lava_claude_client

# Automatically routes through Lava when USE_LAVA=true
response = lava_claude_client.create_message(
    model="claude-3-opus-20240229",
    max_tokens=1024,
    messages=[...]
)
```

## 📊 Monitoring Usage

### View Dashboard

1. Go to: https://www.lavapayments.com/dashboard
2. Login with: `escalacarlos86@gmail.com`
3. Navigate to "Usage" to see real-time metrics

### API Endpoints That Use Claude

| Endpoint | Purpose | Model | Tokens |
|----------|---------|-------|---------|
| `POST /api/jobs` | Job analysis | claude-3-haiku | ~500 |
| Internal: Scraper | Data normalization | claude-3-haiku | ~300 |
| Internal: Matcher | Match ranking | claude-3-haiku | ~1000 |

### Estimated Costs

With $10 in credits:
- **Haiku**: ~$0.25 per million input tokens
- **Demo capacity**: ~500-1000 job requests
- **CalHacks duration**: More than sufficient for judging

## 🧪 Testing Lava Integration

### Quick Test (Backend)

```bash
cd backend
npm run test-claude
```

This will make a test call through Lava and show:
- Request routing status
- Response time
- Token usage
- Billing information

### Manual cURL Test

```bash
curl -X POST 'https://api.lavapayments.com/v1/forward?u=https://api.anthropic.com/v1/messages' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer YOUR_FORWARD_TOKEN' \
  -H 'anthropic-version: 2023-06-01' \
  -H 'x-api-key: YOUR_ANTHROPIC_KEY' \
  -d '{
    "model": "claude-3-haiku-20240307",
    "max_tokens": 100,
    "messages": [{"role": "user", "content": "Hello!"}]
  }'
```

### Python Agent Test

```bash
cd agents_python
source venv/bin/activate  # or: .\venv\Scripts\activate on Windows

# Set environment variables
export USE_LAVA=true
export LAVA_FORWARD_TOKEN=your_token
export ANTHROPIC_API_KEY=your_key

# Run intake agent
python intake_agent.py
```

## 🛡️ Automatic Fallback Protection

### What Happens When Lava Credits Run Out?

**Don't worry!** ReNOVA automatically switches to your Anthropic credits:

```bash
# Logs you'll see when Lava credits are exhausted:

[INFO] Routing Claude request through Lava proxy
[WARN] ⚠️  Lava credits exhausted or payment error - falling back to direct Anthropic API
[INFO] 🔄 Using direct Anthropic API as fallback
[INFO] ✅ Fallback request completed successfully
```

### Fallback Scenarios

The system automatically falls back in these cases:

| Scenario | HTTP Code | Behavior |
|----------|-----------|----------|
| Lava credits exhausted | 402 | Auto-fallback to Anthropic |
| Rate limit exceeded | 429 | Auto-fallback to Anthropic |
| Lava service unavailable | 5xx | Auto-fallback to Anthropic |
| Network timeout | Timeout | Auto-fallback to Anthropic |
| Any Lava error | Any | Auto-fallback to Anthropic |

### How to Know Which API is Being Used?

**Check your logs:**

```bash
# Backend logs (Node.js)
cd backend
npm run dev

# Python agent logs
cd agents_python
python intake_agent.py

# Look for these messages:
# ✅ Using Lava: "Routing Claude request through Lava proxy"
# ⚠️ Fallback: "Falling back to direct Anthropic API"
# ✓ Direct: "Using direct Anthropic API (Lava disabled)"
```

### Credit Management Strategy

For CalHacks demo:

1. **Start with Lava enabled** (`USE_LAVA=true`)
2. **Monitor dashboard** for credit usage
3. **If credits run low**, system auto-falls back
4. **Optionally disable** Lava manually by setting `USE_LAVA=false`

**No code changes needed** - it's all automatic!

## 🔍 Troubleshooting

### Lava Request Fails

**Symptom:** Requests timeout or return 408 errors

**Solutions:**
1. Verify `LAVA_FORWARD_TOKEN` is correct
2. Check if Anthropic API key is valid
3. System automatically falls back to direct API if Lava fails
4. Set `USE_LAVA=false` to disable Lava temporarily

### No Usage Showing in Dashboard

**Causes:**
- `USE_LAVA` is still set to `false`
- Using cached responses
- Requests going direct to Anthropic

**Fix:**
```bash
# Verify environment
echo $USE_LAVA  # Should print "true"

# Check logs for "Routing through Lava" message
```

### Wrong API Key Format

**Error:** `Invalid authentication header`

**Fix:** Ensure you're using the Forward Token (combined token), not individual secrets:

```bash
# Correct:
LAVA_FORWARD_TOKEN=eyJzZWNyZXRfa2V5Ij...

# Incorrect (don't use these directly):
LAVA_SECRET_KEY=aks_live_...
LAVA_CONNECTION_SECRET=cons_live_...
```

## 🏆 CalHacks Track: Lava

### Why We Use Lava

1. **Transparent Billing**: Track exactly how much our AI features cost
2. **Usage Analytics**: Understand which features consume the most tokens
3. **Cost Optimization**: Identify opportunities to reduce AI spending
4. **Production Ready**: Real billing infrastructure for when we scale

### Demo Script for Judges

1. Show `.env` with `USE_LAVA=true`
2. Create a test job request
3. Watch backend logs show "Routing through Lava"
4. Open Lava dashboard and show real-time usage spike
5. Explain cost per job analysis (~$0.001)

### Business Value

For a production contractor marketplace:
- **Per-request billing**: Pay only for what you use
- **Multi-user tracking**: Track usage by customer/contractor
- **Budget controls**: Set limits and alerts
- **Analytics**: Understand feature profitability

## 📚 Additional Resources

- **Lava Dashboard**: https://www.lavapayments.com/dashboard
- **API Docs**: https://www.lavapayments.com/docs
- **Support**: support@lavapayments.com
- **ReNOVA Docs**: See `README.md` for full project setup

## 🎉 Success Criteria

Lava integration is working correctly when:

✅ Environment variable `USE_LAVA=true` is set
✅ Backend logs show "Routing Claude request through Lava proxy"
✅ Python agents print "✅ Lava request completed - Usage: {...}"
✅ Lava dashboard shows increasing API call count
✅ Job analysis completes successfully
✅ No increase in latency (Lava adds <50ms overhead)

---

**Last Updated:** October 25, 2025
**Team:** calhacks12.0 - ReNOVA
**Contact:** escalacarlos86@gmail.com
