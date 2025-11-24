
# ---------------------------------------------------------------------------
# TEAM INTEGRATION SUMMARY:
# This script is modular for easy integration:
# - Reads input from a .txt file, splits by delimiter.
# - Summarizes each part using OpenRouter API.
# - Writes all summaries to an output .txt file (one per part, clearly separated).
# - MongoDB saving is optional (toggle with SAVE_TO_MONGODB flag).
# - All logic is modular for easy integration with other team modules.
# ---------------------------------------------------------------------------

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

def write_summaries_to_txt(summaries, output_file, delimiter="\n---SUMMARY END---\n"):
    """
    Writes a list of summaries to a .txt file, separated by a delimiter.
    Each summary is labeled with its part number for clarity.
    """
    with open(output_file, 'w', encoding='utf-8') as f:
        for i, summary in enumerate(summaries, 1):
            f.write(f"Summary for Part {i}:\n{summary}{delimiter}")

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
    # CONFIGURATION
    OPENROUTER_API_KEY = "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" 
    MODEL_NAME = "x-ai/grok-2-1212" 
    MONGO_URI = "mongodb://localhost:27017/"
    DB_NAME = "openrouter_summaries"
    COLLECTION_NAME = "processed_text"
    INPUT_FILE = "input_data.txt"  # Input .txt file
    OUTPUT_FILE = "summaries_output.txt"  # Output .txt file
    DELIMITER = "###"
    SAVE_TO_MONGODB = False  # Set to True to enable MongoDB saving

    if OPENROUTER_API_KEY == "sk-or-...":
        print("⚠️  Please edit the file and insert your OpenRouter API Key.")
    else:
        # Initialize OpenRouter Client
        client = OpenAI(
            base_url="https://openrouter.ai/api/v1",
            api_key=OPENROUTER_API_KEY,
        )

        # Optionally connect to MongoDB
        collection = None
        if SAVE_TO_MONGODB:
            print("🔌 Connecting to MongoDB...")
            collection = get_mongo_collection(MONGO_URI, DB_NAME, COLLECTION_NAME)
            if collection is not None:
                print("✅ Connected to MongoDB.")
            else:
                print("🛑 Could not connect to database. MongoDB saving will be skipped.")

        # Read input file
        print(f"📂 Reading {INPUT_FILE}...")
        text_parts = read_file_parts(INPUT_FILE, DELIMITER)
        if not text_parts:
            print("⚠️ No text parts found. Check your input file and delimiter.")
        else:
            print(f"Found {len(text_parts)} parts to process.")
            summaries = []
            for i, part in enumerate(text_parts, 1):
                print(f"\n--- Processing Part {i}/{len(text_parts)} ---")
                print(f"Original Text Length: {len(part)} chars")
                print(f"   ... Summarizing using {MODEL_NAME}")
                summary = summarize_text(part, client, MODEL_NAME)
                summaries.append(summary)

                # Optionally save to MongoDB
                if SAVE_TO_MONGODB and collection is not None:
                    doc = {
                        "part_id": i,
                        "original_text": part,
                        "summary": summary,
                        "model_used": MODEL_NAME,
                        "processed_at": datetime.datetime.utcnow(),
                        "source_file": INPUT_FILE
                    }
                    try:
                        result = collection.insert_one(doc)
                        print(f"   ✅ Saved to MongoDB! (ID: {result.inserted_id})")
                    except Exception as e:
                        print(f"   ❌ Failed to save to DB: {e}")
                # Preview first 100 chars
                preview = summary[:100].replace('\n', ' ')
                print(f"   Summary Preview: {preview}...")

            # Write all summaries to output .txt file
            write_summaries_to_txt(summaries, OUTPUT_FILE)
            print(f"\n📝 All summaries written to {OUTPUT_FILE}")
            print("\n🎉 All parts processed successfully!")
