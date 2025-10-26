import chromadb
from chromadb.config import Settings

# Initialize Chroma
client = chromadb.PersistentClient(
    path="chroma_data"  # path to your Chroma DB=
)

# List all collections
collections = client.list_collections()
print("Collections:", [c.name for c in collections])

# Access a specific collection
collection = client.get_collection("designers")  # replace with your collection name

# Get all metadata
metadata = collection.get(include=["metadatas"])["metadatas"]
print("Metadata:", metadata)

# Get all documents/texts
documents = collection.get(include=["documents"])["documents"]
print("Documents:", documents)

embeding = collection.get(include=["embeddings"])["embeddings"]
print("Documents:", embeding)

