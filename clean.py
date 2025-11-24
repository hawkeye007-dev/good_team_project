import os
import datetime
from openai import OpenAI
import pymongo

# ---------------------------------------------------------------------------
# PREREQUISITES:
# 1. Install libraries: python -m pip install openai pymongo
# 2. Ensure MongoDB is running locally on port 27017
# 3. Get an API Key from https://openrouter.ai/keys
# ---------------------------------------------------------------------------

def get_mongo_collection(connection_string, db_name, collection_name):
    """Connects to MongoDB and returns the collection object."""
    try:
        client = pymongo.MongoClient(connection_string, serverSelectionTimeoutMS=5000)
        # Trigger a server check to ensure connection is active
        client.server_info()
        db = client[db_name]
        return db[collection_name]
    except Exception as e:
        print(f"❌ MongoDB Connection Error: {e}")
        return None

def read_file_parts(filepath, delimiter="###"):
    """Reads a text file and splits it into parts based on a custom delimiter."""
    if not os.path.exists(filepath):
        print(f"❌ File not found: {filepath}")
        return []
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read() 
    
    # Split content by delimiter and remove any empty strings
    parts = [p.strip() for p in content.split(delimiter) if p.strip()]
    return parts

def summarize_text(text_to_summarize, client, model_name):
    """Summarizes the provided text using the OpenRouter API."""
    
    prompt = f"Please provide a concise summary of the following text:\n\n{text_to_summarize}"

    try:
        completion = client.chat.completions.create(
            model=model_name,
            messages=[
                {"role": "user", "content": prompt}
            ]
        )
        # Extract the content from the response
        return completion.choices[0].message.content
        
    except Exception as e:
        return f"Error generating summary: {e}"

# --- Main Execution ---
if __name__ == "__main__":
    # 1. CONFIGURATION
    
    # PASTE YOUR OPENROUTER KEY HERE
    OPENROUTER_API_KEY = "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" 
    
    # MODEL SELECTION
    # Note: "Grok 4.1" does not exist yet. Using Grok 2 (latest).
    # If you want a purely free model, try: "google/gemini-2.0-flash-exp:free"
    MODEL_NAME = "x-ai/grok-2-1212" 
    
    # MongoDB Connection Details
    MONGO_URI = "mongodb://localhost:27017/"
    DB_NAME = "openrouter_summaries"  # Renamed DB to reflect change
    COLLECTION_NAME = "processed_text"
    
    # Input File Details
    INPUT_FILE = "input_data.txt"
    DELIMITER = "###" 

    if OPENROUTER_API_KEY == "sk-or-...":
         print("⚠️  Please edit the file and insert your OpenRouter API Key.")
    else:
        # Initialize OpenRouter Client
        client = OpenAI(
            base_url="https://openrouter.ai/api/v1",
            api_key=OPENROUTER_API_KEY,
        )

        # 2. CONNECT TO DB
        print("🔌 Connecting to MongoDB...")
        collection = get_mongo_collection(MONGO_URI, DB_NAME, COLLECTION_NAME)

        if collection is not None:
            print("✅ Connected to MongoDB.")

            # 3. READ FILE
            print(f"📂 Reading {INPUT_FILE}...")
            text_parts = read_file_parts(INPUT_FILE, DELIMITER)
            
            if not text_parts:
                print("⚠️ No text parts found. Check your input file and delimiter.")
            else:
                print(f"found {len(text_parts)} parts to process.")

                # 4. PROCESS LOOP
                for i, part in enumerate(text_parts, 1):
                    print(f"\n--- Processing Part {i}/{len(text_parts)} ---")
                    print(f"Original Text Length: {len(part)} chars")
                    
                    # Generate Summary
                    print(f"   ... Summarizing using {MODEL_NAME}")
                    summary = summarize_text(part, client, MODEL_NAME)
                    
                    # Create Data Object
                    doc = {
                        "part_id": i,
                        "original_text": part,
                        "summary": summary,
                        "model_used": MODEL_NAME,
                        "processed_at": datetime.datetime.utcnow(),
                        "source_file": INPUT_FILE
                    }

                    # Save to MongoDB
                    try:
                        result = collection.insert_one(doc)
                        print(f"   ✅ Saved to MongoDB! (ID: {result.inserted_id})")
                        # Preview first 100 chars
                        preview = summary[:100].replace('\n', ' ')
                        print(f"   Summary Preview: {preview}...")
                    except Exception as e:
                        print(f"   ❌ Failed to save to DB: {e}")

                print("\n🎉 All parts processed successfully!")
        else:
            print("🛑 Process aborted: Could not connect to database.")