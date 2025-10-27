import chromadb
import random
import numpy as np
import os

from sentence_transformers import SentenceTransformer

# Initialize in-memory Chroma client
chroma_path = os.path.join(os.path.dirname(__file__), "chroma_data")
chroma_client = chromadb.PersistentClient(path=chroma_path)
collection = chroma_client.get_or_create_collection("designers")

# Generate random designer-style names
def random_username():
    first_names = ["Ava", "Liam", "Noah", "Emma", "Olivia", "Mia", "Ethan", "Sophia", "Lucas", "Chloe"]
    last_names = ["Designs", "Interiors", "Spaces", "Studio", "Atelier", "Concepts", "Decor"]
    return random.choice(first_names) + random.choice(last_names)

# Generate random design-style descriptions
def random_profile():
    styles = ["modern", "minimalist", "bohemian", "industrial", "mid-century", "coastal", "Japandi", "Scandinavian"]
    focus = ["living rooms", "kitchens", "offices", "luxury homes", "urban spaces", "tiny apartments"]
    vibe = ["warm textures", "natural materials", "vibrant colors", "muted tones", "sleek finishes", "artisanal touches"]
    return f"{random.choice(styles).capitalize()} interior designer specializing in {random.choice(focus)} with {random.choice(vibe)}."

# Generate and add mock data
for _ in range(10):  # create 10 mock entries
    username = random_username()
    profile = random_profile()
    image_urls = []  # empty for now
    model = SentenceTransformer('all-MiniLM-L6-v2')
    embedding = model.encode(profile)

    collection.add(
      ids=[username],
      documents=[profile],
      metadatas=[{"username": username, "image_urls": ""}],  # changed from [] to ""
      embeddings=[embedding]
    )
    

print("✅ Mock ChromaDB data inserted successfully!")