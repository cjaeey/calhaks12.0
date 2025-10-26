import logging
import chromadb
from urllib.parse import urlparse
from get_posts import scrape_instagram_images, extract_captions, save_captions_to_file, extract_image_urls
from describe_designer import generate_designer_profile

def get_designer_profile(instagram_url):
    logging.basicConfig(level=logging.INFO)
    logging.info(f"Starting scrape for Instagram URL: {instagram_url}")

    data = scrape_instagram_images(instagram_url)
    if not data:
        logging.error("Failed to scrape data from Instagram.")
        return

    captions = extract_captions(data)
    image_urls = extract_image_urls(data)
    logging.info(f"Extracted {len(captions)} captions.")

    logging.info("Generating designer profile from captions...")
    profile = generate_designer_profile(captions)
    logging.info("Designer profile generated:\n")
    print(profile)

    # Extract username from Instagram URL
    path = urlparse(instagram_url).path.strip("/")
    username = path.split("/")[0] if path else "unknown_user"

    # Initialize ChromaDB client
    chroma_client = chromadb.PersistentClient(path="chroma_data")
    collection = chroma_client.get_or_create_collection("designers")

    # Add designer record
    collection.add(
        ids=[username],
        documents=[profile],
        metadatas=[{"username": username, "image_urls": image_urls}]
    )

    logging.info(f"Designer {username} saved to ChromaDB.")
    return {"username": username, "profile": profile, "image_urls": image_urls}

def saving_test(instagram_url):

    f = open("captions.txt", "r", encoding="utf-8") 
    captions = f.read()
            
    image_urls = "url"
    profile = generate_designer_profile(captions)

    # Extract username from Instagram URL
    path = urlparse(instagram_url).path.strip("/")
    username = path.split("/")[0] if path else "unknown_user"

    # Initialize ChromaDB client
    chroma_client = chromadb.PersistentClient(path="chroma_data")
    collection = chroma_client.get_or_create_collection("designers")

    # Add designer record
    collection.add(
        ids=[username],
        documents=[profile],
        metadatas=[{"username": username, "image_urls": image_urls}]
    )

    logging.info(f"Designer {username} saved to ChromaDB.")
    return {"username": username, "profile": profile, "image_urls": image_urls}

def main():
    saving_test("https://www.instagram.com/jenconnell.home/")


if __name__ == "__main__":
    main()
