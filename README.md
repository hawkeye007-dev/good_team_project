# 🔍 Universal Async Web Scraper

A powerful, AI-powered web scraper that extracts content from any website and provides intelligent summaries using Google's Gemini AI. Built with FastAPI, Celery, Redis, and Next.js.

![Python](https://img.shields.io/badge/Python-3.10+-blue?logo=python)
![FastAPI](https://img.shields.io/badge/FastAPI-0.109+-green?logo=fastapi)
![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![Redis](https://img.shields.io/badge/Redis-7+-red?logo=redis)
![License](https://img.shields.io/badge/License-MIT-yellow)

## ✨ Features

- **🌐 Universal Scraping** - Works with any website (e-commerce, Wikipedia, news, blogs, etc.)
- **🤖 AI Summarization** - Uses Google Gemini AI to generate intelligent summaries
- **💰 Price Detection** - Automatically detects and extracts prices from product pages
- **🖼️ Image Extraction** - Extracts main images from webpages
- **⚡ Async Processing** - Background task processing with Celery + Redis
- **🎨 Modern UI** - Clean Next.js frontend for easy interaction
- **📡 REST API** - Full-featured API for integration with other applications

## 📸 What It Does

| Input | Output |
|-------|--------|
| Amazon product URL | Price, product summary, images, buying suggestions |
| Wikipedia article | Comprehensive summary of the article |
| E-commerce site | Product details, prices, specifications |
| Any webpage | AI-generated summary, key information, images |

## 🏗️ Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Next.js UI    │────▶│  FastAPI Server │────▶│   Gemini AI     │
│  (Frontend)     │     │   (Backend)     │     │   (Summaries)   │
└─────────────────┘     └────────┬────────┘     └─────────────────┘
                                 │
                    ┌────────────┴────────────┐
                    ▼                         ▼
            ┌───────────────┐         ┌───────────────┐
            │    Celery     │◀───────▶│    Redis      │
            │   (Workers)   │         │   (Broker)    │
            └───────────────┘         └───────────────┘
```

## 📁 Project Structure

```
universal-web-scraper/
├── backend/
│   ├── main.py              # FastAPI application & API endpoints
│   ├── scraper.py           # Web scraping logic (httpx + BeautifulSoup)
│   ├── gemini_client.py     # Gemini AI integration
│   ├── celery_app.py        # Celery configuration
│   ├── tasks.py             # Background task definitions
│   └── requirements.txt     # Python dependencies
├── frontend/
│   ├── pages/
│   │   ├── index.js         # Main UI component
│   │   └── _app.js          # Next.js app wrapper
│   ├── package.json         # Node.js dependencies
│   └── next.config.js       # Next.js configuration
├── docker-compose.yml       # Redis container setup
├── SETUP.md                 # Detailed setup instructions
└── README.md                # This file
```

## 🚀 Quick Start

### Prerequisites

- **Python 3.10+** (3.11 or 3.12 recommended)
- **Node.js 18+**
- **Docker** (for Redis) OR Redis installed locally
- **Google Gemini API Key** ([Get one free](https://makersuite.google.com/app/apikey))

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/yourusername/universal-web-scraper.git
cd universal-web-scraper
```

### 2️⃣ Start Redis

**Option A: Using Docker (Recommended)**
```bash
docker-compose up -d
```

**Option B: Local Redis**
- Install Redis from [redis.io](https://redis.io/download)
- Start Redis server on port 6379

### 3️⃣ Setup Backend

**Windows (PowerShell):**
```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

**macOS/Linux:**
```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

### 4️⃣ Set Environment Variables

**Windows (PowerShell):**
```powershell
$env:GEMINI_API_KEY = "your-gemini-api-key-here"
```

**macOS/Linux:**
```bash
export GEMINI_API_KEY="your-gemini-api-key-here"
```

### 5️⃣ Start the Backend Server

```bash
cd backend
uvicorn main:app --reload --port 8000
```

### 6️⃣ Start Celery Worker (New Terminal)

**Windows:**
```powershell
cd backend
.\.venv\Scripts\Activate.ps1
$env:GEMINI_API_KEY = "your-gemini-api-key-here"
celery -A celery_app worker --loglevel=info --pool=solo
```

**macOS/Linux:**
```bash
cd backend
source .venv/bin/activate
export GEMINI_API_KEY="your-gemini-api-key-here"
celery -A celery_app worker --loglevel=info
```

### 7️⃣ Setup & Start Frontend (New Terminal)

```bash
cd frontend
npm install
npm run dev
```

### 8️⃣ Open the App

🎉 Visit **http://localhost:3000** in your browser!

---

## 📡 API Reference

### Base URL
```
http://localhost:8000
```

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/scrape` | Synchronous scraping (waits for results) |
| `POST` | `/scrape/async` | Queue scraping task (returns task_id) |
| `GET` | `/task/{task_id}` | Check status of background task |
| `GET` | `/health` | Health check endpoint |

### POST `/scrape`

Synchronous scraping - waits for results.

**Request:**
```json
{
  "url": "https://example.com"
}
```
or multiple URLs:
```json
{
  "urls": ["https://example1.com", "https://example2.com"]
}
```

**Response:**
```json
{
  "results": [
    {
      "url": "https://example.com",
      "title": "Page Title",
      "description": "Meta description",
      "price": "$29.99",
      "images": ["https://example.com/image1.jpg"],
      "summary": "AI-generated summary of the page...",
      "suggestions": [
        "Price detected: $29.99 — consider comparing with other sellers."
      ]
    }
  ]
}
```

### POST `/scrape/async`

Queue scraping task for background processing.

**Request:**
```json
{
  "urls": ["https://example.com"]
}
```

**Response:**
```json
{
  "task_id": "abc123-def456-...",
  "status": "queued"
}
```

### GET `/task/{task_id}`

Check status of a background task.

**Response (Pending):**
```json
{
  "task_id": "abc123-...",
  "status": "pending"
}
```

**Response (Success):**
```json
{
  "task_id": "abc123-...",
  "status": "success",
  "result": {
    "results": [...]
  }
}
```

**Response (Failed):**
```json
{
  "task_id": "abc123-...",
  "status": "failed",
  "error": "Error message"
}
```

---

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `GEMINI_API_KEY` | Google Gemini API key | Yes* | None |
| `REDIS_URL` | Redis connection URL | No | `redis://localhost:6379/0` |
| `PORT` | Backend server port | No | `8000` |

*Without a Gemini API key, the app falls back to a simple extractive summarizer.

### Frontend Configuration

Create `.env.local` in the frontend folder:
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## 📝 Usage Examples

### cURL Examples

**Scrape a Wikipedia page:**
```bash
curl -X POST "http://localhost:8000/scrape" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://en.wikipedia.org/wiki/Artificial_intelligence"}'
```

**Scrape an e-commerce page:**
```bash
curl -X POST "http://localhost:8000/scrape" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://webscraper.io/test-sites/e-commerce/allinone"}'
```

**Async scrape with task polling:**
```bash
# Queue the task
curl -X POST "http://localhost:8000/scrape/async" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com"}'

# Check status (use the task_id from response)
curl "http://localhost:8000/task/YOUR_TASK_ID"
```

### Python Example

```python
import requests

# Sync scrape
response = requests.post(
    "http://localhost:8000/scrape",
    json={"url": "https://en.wikipedia.org/wiki/Python_(programming_language)"}
)
result = response.json()
print(result["results"][0]["summary"])
```

### JavaScript Example

```javascript
const response = await fetch("http://localhost:8000/scrape", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ url: "https://example.com" })
});
const data = await response.json();
console.log(data.results[0].summary);
```

---

## ⚠️ Limitations & Notes

1. **JavaScript-rendered content**: Some websites load content via JavaScript. This scraper fetches the initial HTML, so dynamically loaded content may not be captured.

2. **Rate limiting**: The scraper doesn't implement rate limiting. Be respectful of websites' resources.

3. **robots.txt**: This scraper doesn't check robots.txt. For production use, consider respecting robots.txt directives.

4. **Price detection**: Uses heuristic patterns to detect prices. May not work for all formats or currencies.

5. **Gemini API quotas**: The free tier of Gemini API has rate limits. For heavy usage, consider upgrading your API plan.

---

## 🛠️ Troubleshooting

### Common Issues

| Problem | Solution |
|---------|----------|
| "Cannot connect to Redis" | Ensure Redis is running: `docker-compose up -d` |
| "Gemini API returns None" | Check API key is correct and not over quota |
| "Celery tasks not found" | Restart Celery worker from `backend` directory |
| Windows: Pool error | Always use `--pool=solo` with Celery on Windows |
| Frontend can't connect | Check backend is running on port 8000 |

### Checking Service Status

```bash
# Check Redis
docker ps | grep redis

# Check backend
curl http://localhost:8000/health

# Check frontend
curl http://localhost:3000
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [FastAPI](https://fastapi.tiangolo.com/) - Modern Python web framework
- [Google Gemini](https://deepmind.google/technologies/gemini/) - AI model for summarization
- [Celery](https://celeryproject.org/) - Distributed task queue
- [BeautifulSoup](https://www.crummy.com/software/BeautifulSoup/) - HTML parsing
- [Next.js](https://nextjs.org/) - React framework

---

Made with ❤️ for the developer community
