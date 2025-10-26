from .describe_customer import generate_customer_profile
import chromadb
import os
from sentence_transformers import SentenceTransformer


def matching(promt):
  print("generating profile")
  profile = generate_customer_profile(promt)
  print(profile)
  chroma_path = os.path.join(os.path.dirname(__file__), "..", "chroma_data")
  chroma_client = chromadb.PersistentClient(path=chroma_path)
  collection_names = [c.name for c in chroma_client.list_collections()]
  if "designers" not in collection_names:
      print("No 'designers' collection found. No results can be returned.")
      return {"matches": [], "count": 0}
  collection = chroma_client.get_or_create_collection("designers")
  model = SentenceTransformer('all-MiniLM-L6-v2')
  print("making_embedding")
  query_embedding = model.encode(profile)
  print("Start Query")
  results = collection.query(
    query_embeddings=[query_embedding],
    n_results=5
  )
  print ('query is done')
  print (results)

  # Format results for frontend
  matches = []
  if results and results.get('ids') and len(results['ids']) > 0:
      for i, designer_id in enumerate(results['ids'][0]):
          metadata = results['metadatas'][0][i] if results.get('metadatas') else {}
          distance = results['distances'][0][i] if results.get('distances') else 0
          document = results['documents'][0][i] if results.get('documents') else ""

          # Calculate match score (inverse of distance, normalized to 0-100)
          score = max(0, min(100, int((1 - distance) * 100)))

          match = {
              "id": designer_id,
              "name": metadata.get("username", designer_id),
              "trade": "Interior Designer",
              "city": "San Francisco",  # TODO: Extract from metadata
              "state": "CA",
              "services": ["Design Consultation", "Space Planning"],
              "rating": 4.5,
              "price_band": "medium",
              "score": score,
              "reason": f"Matched based on design style and preferences. Profile: {document[:100]}...",
              "website": f"https://instagram.com/{designer_id}"
          }
          matches.append(match)

  return {"matches": matches, "count": len(matches)}
  
def main():
  jobRequest = "jobRequest.txt"
  if os.path.exists(jobRequest):
      with open(jobRequest, "r", encoding="utf-8") as f:
          job_text = f.read()
      try:
          print("generating profile")
          matching(job_text)
        
      except Exception as e:
          print(f"Error generating designer profile: {e}")
  else:
     print("file not found")

if __name__ == "__main__":
    main()

  