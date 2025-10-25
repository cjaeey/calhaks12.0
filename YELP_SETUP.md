# 🔥 Get REAL Professionals from Yelp

Your system now finds **REAL contractors from Yelp** instead of generating fake data!

## How It Works

The system tries this priority order:
1. **Yelp Fusion API** → Get real contractors with ratings, reviews, phone numbers
2. **Fallback** → Generate sample data if Yelp is unavailable

## Setup (5 minutes, FREE)

### Step 1: Get Your FREE Yelp API Key

1. Go to: https://www.yelp.com/developers/v3/manage_app
2. Sign in or create account (free)
3. Click "Create New App"
4. Fill in:
   - **App Name**: "ReNOVA"
   - **Industry**: "Home Services"
   - **Company**: Your name
   - **Website**: http://localhost:3001
   - **Description**: "Contractor matching platform"
5. Accept Terms & Submit
6. Copy your **API Key** (looks like: `abcd1234...xyz`)

### Step 2: Add to Your .env File

```bash
# In /backend/.env
YELP_API_KEY=your_api_key_here
```

### Step 3: Restart Backend

```bash
cd backend
npm run dev
```

## Testing

### Test 1: HVAC Contractors
```bash
curl -X POST http://localhost:3001/api/jobs \
  -H 'Content-Type: application/json' \
  -d '{"prompt":"Need HVAC repair urgently","city":"Oakland","state":"CA"}'
```

### Test 2: Plumbing
```bash
curl -X POST http://localhost:3001/api/jobs \
  -H 'Content-Type: application/json' \
  -d '{"prompt":"Plumbing emergency","city":"San Francisco","state":"CA"}'
```

### Test 3: Electrical
```bash
curl -X POST http://localhost:3001/api/jobs \
  -H 'Content-Type: application/json' \
  -d '{"prompt":"Need electrician","city":"Berkeley","state":"CA"}'
```

## What You'll Get from Yelp

**Real Data**:
- Business names
- Real ratings (1-5 stars)
- Review counts
- Phone numbers
- Actual addresses
- Price levels ($ to $$$$)
- Yelp profile URLs
- Distance from search location

## Limits

- **Free Tier**: 500 API calls/day
- **Rate Limit**: Plenty for development/testing
- **Upgrade**: $0 for more calls if needed

## Example Response (REAL Data)

```json
{
  "matches": [
    {
      "name": "Bay Area Air Conditioning",
      "rating": 4.8,
      "reviewCount": 156,
      "phone": "+15105551234",
      "address": "123 Main St",
      "city": "Oakland",
      "state": "CA",
      "yelpUrl": "https://www.yelp.com/biz/bay-area-air...",
      "priceLevel": "$$",
      "distance": 1245.8  // meters
    }
  ]
}
```

## Troubleshooting

### "Yelp API key not configured"
- Make sure `YELP_API_KEY=...` is in `/backend/.env`
- Restart the backend

### "Yelp API authentication failed"
- Double-check your API key is correct
- No spaces before/after the key

### Still getting generated data?
- Check backend logs: should see "REAL professionals found from Yelp"
- If you see "Generated professionals (Yelp unavailable)", the API key isn't working

## Frontend Usage

Just use the app normally at http://localhost:3005

- Enter any project description
- Enter location (city, state)
- Click "Get Matched Now"
- You'll get REAL contractors from Yelp!

## Why This is Better Than LinkedIn

✅ **Legal**: Yelp API is designed for this
✅ **Free**: 500 calls/day
✅ **Accurate**: Real ratings, real reviews
✅ **Complete**: Phone, address, website
✅ **Fast**: Returns in < 1 second
❌ LinkedIn: Scraping violates ToS, will get banned

## Trade Categories Supported

- HVAC
- Plumbing
- Electrical
- Remodeling
- Handyman
- General Contractor

## Need More?

Want to use fetch.ai agents? They can:
- Aggregate from multiple sources (Yelp + Google + Angie's List)
- Verify licenses automatically
- Compare pricing across platforms
- Check real-time availability

Let me know if you want to set that up!
