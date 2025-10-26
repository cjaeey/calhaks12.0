import requests
import json
import os
import time
from pathlib import Path
from urllib.parse import urlparse
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# BrightData API Configuration
BEARER_TOKEN = os.getenv("BRIGHTDATA_BEARER_TOKEN")
DATASET_ID = os.getenv("BRIGHTDATA_DATASET_ID", "gd_l1vikfch901nx3by4")
OUTPUT_FOLDER = "instagram_images"

if not BEARER_TOKEN:
    raise ValueError("BRIGHTDATA_BEARER_TOKEN environment variable is required")

def scrape_instagram_images(instagram_url):
    """
    Scrape images from an Instagram profile using BrightData API
    """
    headers = {
        "Authorization": f"Bearer {BEARER_TOKEN}",
        "Content-Type": "application/json",
    }

    # Initiate scraping request
    data = json.dumps({
        "input": [{"url": instagram_url}],
    })

    print(f"Initiating scrape for: {instagram_url}")

    response = requests.post(
        f"https://api.brightdata.com/datasets/v3/scrape?dataset_id={DATASET_ID}&notify=false&include_errors=true",
        headers=headers,
        data=data
    )

    if response.status_code != 200:
        print(f"Error: API request failed with status {response.status_code}")
        print(response.text)
        return None

    result = response.json()
    print(f"Scrape initiated. Response: {json.dumps(result, indent=2)}")

    # Check if snapshot_id is in the response for polling
    if 'snapshot_id' in result:
        snapshot_id = result['snapshot_id']
        print(f"Snapshot ID: {snapshot_id}")
        return poll_for_results(snapshot_id, headers)

    return result

def poll_for_results(snapshot_id, headers, max_wait=300, interval=10):
    """
    Poll BrightData API for scraping results
    """
    print(f"Polling for results (max wait: {max_wait}s)...")
    start_time = time.time()

    while time.time() - start_time < max_wait:
        response = requests.get(
            f"https://api.brightdata.com/datasets/v3/snapshot/{snapshot_id}",
            headers=headers
        )

        if response.status_code == 200:
            data = response.json()
            status = data.get('status', 'unknown')
            print(f"Status: {status}")

            if status == 'ready':
                print("Scraping completed!")
                return data
            elif status == 'failed':
                print("Scraping failed!")
                return data

        time.sleep(interval)

    print("Timeout waiting for results")
    return None

def extract_image_urls(data):
    """
    Extract all image URLs from the BrightData response
    """
    image_urls = []

    if not data:
        return image_urls

    # Handle different response structures
    if isinstance(data, list):
        items = data
    elif isinstance(data, dict):
        items = data.get('data', []) or data.get('results', []) or [data]
    else:
        return image_urls

    for item in items:
        # Check for various image field names
        if isinstance(item, dict):
            # Direct image URL
            if 'image_url' in item:
                image_urls.append(item['image_url'])
            if 'profile_pic_url' in item:
                image_urls.append(item['profile_pic_url'])

            # Post images
            if 'posts' in item:
                for post in item['posts']:
                    if isinstance(post, dict):
                        if 'display_url' in post:
                            image_urls.append(post['display_url'])
                        if 'thumbnail_url' in post:
                            image_urls.append(post['thumbnail_url'])
                        if 'image_url' in post:
                            image_urls.append(post['image_url'])

            # Media items
            if 'media' in item:
                for media in item['media']:
                    if isinstance(media, dict) and 'url' in media:
                        image_urls.append(media['url'])

    return list(set(image_urls))  # Remove duplicates

def extract_captions(data):
    """
    Extract captions from the BrightData response, including nested posts and edge_media_to_caption
    """
    captions = []

    if not data:
        return captions

    # Handle different response structures
    if isinstance(data, list):
        items = data
    elif isinstance(data, dict):
        items = data.get('data', []) or data.get('results', []) or [data]
    else:
        return captions

    for item in items:
        if isinstance(item, dict):
            # Captions directly in item
            if 'caption' in item and isinstance(item['caption'], str):
                captions.append(item['caption'])

            # Posts captions
            if 'posts' in item:
                for post in item['posts']:
                    if isinstance(post, dict):
                        # Caption field
                        if 'caption' in post and isinstance(post['caption'], str):
                            captions.append(post['caption'])
                        # edge_media_to_caption nested captions
                        edge_caption = post.get('edge_media_to_caption')
                        if edge_caption and isinstance(edge_caption, dict):
                            edges = edge_caption.get('edges', [])
                            for edge in edges:
                                node = edge.get('node')
                                if node and 'text' in node:
                                    captions.append(node['text'])

            # Media captions
            if 'media' in item:
                for media in item['media']:
                    if isinstance(media, dict):
                        if 'caption' in media and isinstance(media['caption'], str):
                            captions.append(media['caption'])
                        edge_caption = media.get('edge_media_to_caption')
                        if edge_caption and isinstance(edge_caption, dict):
                            edges = edge_caption.get('edges', [])
                            for edge in edges:
                                node = edge.get('node')
                                if node and 'text' in node:
                                    captions.append(node['text'])

    return list(set(captions))  # Remove duplicates

def save_captions_to_file(captions, output_file):
    """
    Save captions list to a .txt file, one caption per line
    """
    try:
        with open(output_file, 'w', encoding='utf-8') as f:
            for caption in captions:
                f.write(caption + '\n')
        print(f"\nCaptions saved to '{output_file}'")
    except Exception as e:
        print(f"Failed to save captions to file: {str(e)}")

def download_images(image_urls, output_folder=OUTPUT_FOLDER):
    """
    Download images to local folder
    """
    if not image_urls:
        print("No images to download")
        return

    # Create output folder
    Path(output_folder).mkdir(parents=True, exist_ok=True)

    print(f"\nDownloading {len(image_urls)} images to '{output_folder}'...")

    for idx, url in enumerate(image_urls, 1):
        try:
            # Generate filename from URL or use index
            parsed = urlparse(url)
            filename = os.path.basename(parsed.path) or f"image_{idx}.jpg"
            filepath = os.path.join(output_folder, filename)

            # Download image
            response = requests.get(url, timeout=30)
            response.raise_for_status()

            # Save to file
            with open(filepath, 'wb') as f:
                f.write(response.content)

            print(f"[{idx}/{len(image_urls)}] Downloaded: {filename}")

        except Exception as e:
            print(f"[{idx}/{len(image_urls)}] Failed to download {url}: {str(e)}")

    print(f"\nDownload complete! Images saved to '{output_folder}'")

def main():
    # Instagram URL to scrape
    instagram_url = "https://www.instagram.com/jenconnell.home/"

    # Scrape images
    data = scrape_instagram_images(instagram_url)

    if data:
        # Extract image URLs
        image_urls = extract_image_urls(data)
        print(f"\nFound {len(image_urls)} images")

        if image_urls:
            print("\nImage URLs:")
            for url in image_urls:
                print(f"  - {url}")

            # Download images
            #download_images(image_urls)
        else:
            print("\nNo images found in response. Full response:")
            print(json.dumps(data, indent=2))

        # Extract captions and save to file
        captions = extract_captions(data)
        print(f"\nFound {len(captions)} captions")
        if captions:
            save_captions_to_file(captions, "captions.txt")
        else:
            print("\nNo captions found in response.")

    else:
        print("Failed to retrieve data")

if __name__ == "__main__":
    main()