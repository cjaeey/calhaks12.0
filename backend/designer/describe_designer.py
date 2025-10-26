# -----------------------------
# Configuration
# -----------------------------
IMAGE_FOLDER = "instagram_images"
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

def generate_designer_profile(captions_text):
    payload = {
        "model": MODEL,
        "messages": [
            {
                "role": "user",
                "content": f"generate a designer profile of the interior designer, including style, aesthetics, and personality traits. from \n {captions_text}"
            }
        ],
        "max_tokens": 1000
    }

    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json",
        "User-Agent": "asi1-python-client/1.0"
    }
    print("waiting for reponse")
    response = requests.post(API_URL, json=payload, headers=headers)
    response.raise_for_status()
    return response.json()["choices"][0]["message"]["content"]

# -----------------------------
# Main:
# -----------------------------
def main():
    captions_file = "captions.txt"
    if os.path.exists(captions_file):
        with open(captions_file, "r", encoding="utf-8") as f:
            captions_text = f.read()
        try:
            print("\nGenerating interior designer profile based on captions...")
            profile = generate_designer_profile(captions_text)
            print("Designer Profile:", profile)
        except Exception as e:
            print(f"Error generating designer profile: {e}")

if __name__ == "__main__":
    main()