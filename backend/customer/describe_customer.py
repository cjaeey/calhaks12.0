# -----------------------------
# Configuration
# -----------------------------
import os
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

API_KEY = os.getenv("ASI1_API_KEY")
API_URL = "https://api.asi1.ai/v1/chat/completions"
MODEL = "asi1-mini"

if not API_KEY:
    raise ValueError("ASI1_API_KEY environment variable is required")

def generate_customer_profile(jobRequest):
    payload = {
        "model": MODEL,
        "messages": [
            {
                "role": "user",
                "content": f"Keep it short. generate keywords on interior design style, aesthetics, and personality traits wanted for the following request: \n {jobRequest}"
            }
        ],
        "max_tokens": 1000
    }

    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json",
        "User-Agent": "asi1-python-client/1.0"
    }

    response = requests.post(API_URL, json=payload, headers=headers)
    response.raise_for_status()
    return response.json()["choices"][0]["message"]["content"]


# -----------------------------
# Main:
# -----------------------------
def main():
    jobRequest = "jobRequest.txt"
    if os.path.exists(jobRequest):
        with open(jobRequest, "r", encoding="utf-8") as f:
            job_text = f.read()
        try:
            print("\nGenerating customer profile based on captions...")
            profile = generate_customer_profile(job_text)
            print("Designer Profile:", profile)
        except Exception as e:
            print(f"Error generating designer profile: {e}")

if __name__ == "__main__":
    main()