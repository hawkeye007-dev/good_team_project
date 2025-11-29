import asyncio
import os
from celery_app import celery_app
from scraper import scrape_url
from gemini_client import summarize_text


def run_async(coro):
    """Helper to run async code in sync context."""
    try:
        loop = asyncio.get_event_loop()
        if loop.is_running():
            # Create new loop if current is running
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
    except RuntimeError:
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
    
    try:
        return loop.run_until_complete(coro)
    finally:
        pass  # Don't close the loop to allow reuse


@celery_app.task(bind=True, name="tasks.scrape_task")
def scrape_task(self, urls: list, api_key: str = None):
    """Background task to scrape multiple URLs and summarize."""
    # Get API key from parameter or environment
    gemini_key = api_key or os.getenv("GEMINI_API_KEY")
    
    results = []
    for url in urls:
        try:
            scraped = run_async(scrape_url(url))
            if scraped.get("error"):
                results.append({"url": url, "error": scraped["error"]})
                continue

            text = scraped.get("text") or ""
            text_for_summary = text[:15000]
            summary = run_async(summarize_text(text_for_summary, api_key=gemini_key))

            suggestions = []
            if scraped.get("price"):
                suggestions.append(f"Price detected: {scraped.get('price')} — consider comparing with other sellers.")
            else:
                suggestions.append("No obvious price detected — might not be a product page or price is loaded dynamically.")

            if scraped.get("images"):
                suggestions.append("Page has images; consider downloading the top ones for quick preview.")

            results.append({
                "url": url,
                "title": scraped.get("title"),
                "description": scraped.get("description"),
                "price": scraped.get("price"),
                "images": scraped.get("images"),
                "summary": summary,
                "suggestions": suggestions,
            })
        except Exception as e:
            results.append({"url": url, "error": str(e)})

    return {"results": results}
