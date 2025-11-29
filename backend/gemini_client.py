import os
from typing import Optional

import httpx


async def call_gemini_generate(prompt: str, api_key: str, model: str = "gemini-2.5-flash") -> Optional[str]:
    """Call the Google Gemini API to generate content."""
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent"
    headers = {"Content-Type": "application/json"}
    payload = {
        "contents": [
            {
                "parts": [
                    {"text": prompt}
                ]
            }
        ],
        "generationConfig": {
            "temperature": 0.4,
            "maxOutputTokens": 2048,
        }
    }
    params = {"key": api_key}
    try:
        async with httpx.AsyncClient(timeout=90) as client:
            r = await client.post(url, json=payload, params=params, headers=headers)
            if r.status_code != 200:
                return None
            data = r.json()
            # Extract text from Gemini response
            if "candidates" in data and len(data["candidates"]) > 0:
                candidate = data["candidates"][0]
                if "content" in candidate and "parts" in candidate["content"]:
                    parts = candidate["content"]["parts"]
                    if parts and "text" in parts[0]:
                        return parts[0]["text"]
            return None
    except Exception:
        return None


def simple_local_summarize(text: str, max_sentences: int = 8) -> str:
    """Simple extractive summarizer as fallback."""
    import re

    # Clean up text
    text = re.sub(r'\s+', ' ', text.strip())
    
    # Split into sentences
    sents = re.split(r'(?<=[.!?])\s+', text)
    if not sents:
        return "No content available to summarize."
    
    # Filter out very short sentences
    sents = [s for s in sents if len(s) > 20]
    
    if not sents:
        return text[:500] + "..." if len(text) > 500 else text
    
    chosen = sents[:max_sentences]
    return " ".join(chosen)


async def summarize_text(text: str, api_key: Optional[str] = None) -> str:
    """Summarize text using Gemini API or fallback to local summarizer."""
    # Try to get API key from parameter or environment variable
    api_key = api_key or os.getenv("GEMINI_API_KEY")
    
    if not text or len(text.strip()) < 50:
        return "Not enough content to summarize."
    
    if api_key:
        # Build a clear prompt
        prompt = f"""Summarize this webpage content in 4-6 complete sentences. Include all key facts, what the page is about, and any important details like prices, features, or dates. Make sure to write complete sentences.

Webpage content:
{text[:8000]}

Provide a complete summary:"""

        result = await call_gemini_generate(prompt, api_key)
        if result:
            return result

    # Fallback to local summarizer
    return simple_local_summarize(text, max_sentences=8)
