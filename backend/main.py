import os
from typing import List, Union

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from scraper import scrape_url
from gemini_client import summarize_text
from celery_app import celery_app

# Import tasks to ensure they're registered with Celery
import tasks
from tasks import scrape_task

from celery.result import AsyncResult

app = FastAPI(title="Minimal Async Universal Scraper")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/scrape")
async def scrape(payload: dict):
    """Synchronous scrape — waits for result."""
    urls = payload.get("urls") or payload.get("url")
    if not urls:
        raise HTTPException(status_code=400, detail="provide 'url' or 'urls' in JSON payload")

    if isinstance(urls, str):
        urls = [urls]
    if not isinstance(urls, list):
        raise HTTPException(status_code=400, detail="'urls' must be a list or string")

    results = []
    for u in urls:
        scraped = await scrape_url(u)
        if scraped.get("error"):
            results.append({"url": u, "error": scraped["error"]})
            continue

        text = scraped.get("text") or ""
        text_for_summary = text[:15000]
        summary = await summarize_text(text_for_summary)

        suggestions = []
        if scraped.get("price"):
            suggestions.append("Price detected: %s — consider comparing with other sellers." % scraped.get("price"))
        else:
            suggestions.append("No obvious price detected — might not be a product page or price is loaded dynamically.")

        if scraped.get("images"):
            suggestions.append("Page has images; consider downloading the top ones for quick preview.")

        results.append(
            {
                "url": u,
                "title": scraped.get("title"),
                "description": scraped.get("description"),
                "price": scraped.get("price"),
                "images": scraped.get("images"),
                "summary": summary,
                "suggestions": suggestions,
            }
        )

    return {"results": results}


@app.post("/scrape/async")
async def scrape_async(payload: dict):
    """Queue scrape task — returns task_id immediately."""
    urls = payload.get("urls") or payload.get("url")
    if not urls:
        raise HTTPException(status_code=400, detail="provide 'url' or 'urls' in JSON payload")

    if isinstance(urls, str):
        urls = [urls]
    if not isinstance(urls, list):
        raise HTTPException(status_code=400, detail="'urls' must be a list or string")

    # Pass API key to the task
    api_key = os.getenv("GEMINI_API_KEY")
    task = scrape_task.delay(urls, api_key=api_key)
    return {"task_id": task.id, "status": "queued"}


@app.get("/task/{task_id}")
async def get_task_status(task_id: str):
    """Check status of a queued task."""
    result = AsyncResult(task_id, app=celery_app)
    if result.state == "PENDING":
        return {"task_id": task_id, "status": "pending"}
    elif result.state == "SUCCESS":
        return {"task_id": task_id, "status": "success", "result": result.result}
    elif result.state == "FAILURE":
        return {"task_id": task_id, "status": "failed", "error": str(result.info)}
    else:
        return {"task_id": task_id, "status": result.state}


@app.get("/health")
async def health():
    return {"status": "ok"}


if __name__ == "__main__":
    import uvicorn

    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
