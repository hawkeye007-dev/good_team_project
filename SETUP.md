# 📋 Detailed Setup Guide

This guide provides step-by-step instructions for setting up the Universal Web Scraper on different operating systems.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Windows Setup](#windows-setup)
3. [macOS Setup](#macos-setup)
4. [Linux Setup](#linux-setup)
5. [Docker Setup (All Platforms)](#docker-setup-all-platforms)
6. [Getting a Gemini API Key](#getting-a-gemini-api-key)
7. [Verifying Installation](#verifying-installation)
8. [Running in Production](#running-in-production)

---

## Prerequisites

Before you begin, ensure you have the following installed:

| Software | Version | Download Link |
|----------|---------|---------------|
| Python | 3.10+ (3.11/3.12 recommended) | [python.org](https://www.python.org/downloads/) |
| Node.js | 18+ | [nodejs.org](https://nodejs.org/) |
| Docker | Latest | [docker.com](https://www.docker.com/products/docker-desktop/) |
| Git | Latest | [git-scm.com](https://git-scm.com/) |

---

## Windows Setup

### Step 1: Clone the Repository

Open PowerShell and run:

```powershell
git clone https://github.com/yourusername/universal-web-scraper.git
cd universal-web-scraper
```

### Step 2: Start Redis with Docker

```powershell
docker-compose up -d
```

Verify Redis is running:
```powershell
docker ps
```

You should see a container named `scraper-redis` running.

### Step 3: Setup Python Backend

```powershell
# Navigate to backend
cd backend

# Create virtual environment
python -m venv .venv

# Activate virtual environment
.\.venv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt
```

### Step 4: Set Environment Variable

```powershell
$env:GEMINI_API_KEY = "your-api-key-here"
```

> ⚠️ Replace `your-api-key-here` with your actual Gemini API key

### Step 5: Start Backend Server

```powershell
# Make sure you're in the backend folder with venv activated
uvicorn main:app --reload --port 8000
```

Keep this terminal running.

### Step 6: Start Celery Worker (New Terminal)

Open a new PowerShell window:

```powershell
cd path\to\universal-web-scraper\backend
.\.venv\Scripts\Activate.ps1
$env:GEMINI_API_KEY = "your-api-key-here"
celery -A celery_app worker --loglevel=info --pool=solo
```

> ⚠️ The `--pool=solo` flag is **required** on Windows

Keep this terminal running.

### Step 7: Setup Frontend (New Terminal)

Open another PowerShell window:

```powershell
cd path\to\universal-web-scraper\frontend
npm install
npm run dev
```

### Step 8: Access the Application

Open your browser and go to: **http://localhost:3000**

---

## macOS Setup

### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/universal-web-scraper.git
cd universal-web-scraper
```

### Step 2: Start Redis

**Option A: Using Docker**
```bash
docker-compose up -d
```

**Option B: Using Homebrew**
```bash
brew install redis
brew services start redis
```

### Step 3: Setup Python Backend

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

### Step 4: Set Environment Variable

```bash
export GEMINI_API_KEY="your-api-key-here"
```

To make it permanent, add to `~/.zshrc` or `~/.bashrc`:
```bash
echo 'export GEMINI_API_KEY="your-api-key-here"' >> ~/.zshrc
source ~/.zshrc
```

### Step 5: Start Backend Server

```bash
uvicorn main:app --reload --port 8000
```

### Step 6: Start Celery Worker (New Terminal)

```bash
cd path/to/universal-web-scraper/backend
source .venv/bin/activate
export GEMINI_API_KEY="your-api-key-here"
celery -A celery_app worker --loglevel=info
```

### Step 7: Setup Frontend (New Terminal)

```bash
cd path/to/universal-web-scraper/frontend
npm install
npm run dev
```

### Step 8: Access the Application

Open your browser: **http://localhost:3000**

---

## Linux Setup

### Step 1: Install Prerequisites (Ubuntu/Debian)

```bash
# Update package list
sudo apt update

# Install Python
sudo apt install python3 python3-pip python3-venv

# Install Node.js (using NodeSource)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install nodejs

# Install Docker
sudo apt install docker.io docker-compose
sudo systemctl start docker
sudo usermod -aG docker $USER
```

Log out and back in for Docker group changes to take effect.

### Step 2: Clone the Repository

```bash
git clone https://github.com/yourusername/universal-web-scraper.git
cd universal-web-scraper
```

### Step 3: Start Redis

**Option A: Using Docker**
```bash
docker-compose up -d
```

**Option B: Using apt**
```bash
sudo apt install redis-server
sudo systemctl start redis-server
```

### Step 4: Setup Python Backend

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

### Step 5: Set Environment Variable

```bash
export GEMINI_API_KEY="your-api-key-here"
```

To make permanent:
```bash
echo 'export GEMINI_API_KEY="your-api-key-here"' >> ~/.bashrc
source ~/.bashrc
```

### Step 6: Start Services

**Terminal 1 - Backend:**
```bash
cd backend && source .venv/bin/activate
uvicorn main:app --reload --port 8000
```

**Terminal 2 - Celery:**
```bash
cd backend && source .venv/bin/activate
celery -A celery_app worker --loglevel=info
```

**Terminal 3 - Frontend:**
```bash
cd frontend
npm install
npm run dev
```

### Step 7: Access the Application

Open browser: **http://localhost:3000**

---

## Docker Setup (All Platforms)

For a fully containerized setup, you can run everything in Docker.

### Step 1: Create a Complete Docker Compose

Create `docker-compose.full.yml`:

```yaml
version: '3.8'

services:
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 5s
      timeout: 3s
      retries: 5

  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - REDIS_URL=redis://redis:6379/0
      - GEMINI_API_KEY=${GEMINI_API_KEY}
    depends_on:
      redis:
        condition: service_healthy
    command: uvicorn main:app --host 0.0.0.0 --port 8000

  celery:
    build: ./backend
    environment:
      - REDIS_URL=redis://redis:6379/0
      - GEMINI_API_KEY=${GEMINI_API_KEY}
    depends_on:
      redis:
        condition: service_healthy
    command: celery -A celery_app worker --loglevel=info

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:8000
    depends_on:
      - backend

volumes:
  redis_data:
```

### Step 2: Create Backend Dockerfile

Create `backend/Dockerfile`:

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Step 3: Create Frontend Dockerfile

Create `frontend/Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
```

### Step 4: Run with Docker Compose

```bash
# Set your API key
export GEMINI_API_KEY="your-api-key-here"

# Build and start all services
docker-compose -f docker-compose.full.yml up --build
```

---

## Getting a Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated key
5. Keep it secure - don't commit it to version control!

### Free Tier Limits

The Gemini API free tier includes:
- 60 queries per minute (QPM)
- 1 million tokens per minute
- Sufficient for development and light usage

---

## Verifying Installation

### Check All Services

**1. Check Redis:**
```bash
# Using Docker
docker ps | grep redis

# Or test connection
redis-cli ping
# Should return: PONG
```

**2. Check Backend:**
```bash
curl http://localhost:8000/health
# Should return: {"status":"ok"}
```

**3. Check Frontend:**
```bash
curl -s http://localhost:3000 | head -20
# Should return HTML content
```

**4. Test Scraping:**
```bash
curl -X POST "http://localhost:8000/scrape" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com"}'
```

### Common Verification Issues

| Issue | Check |
|-------|-------|
| Redis not connecting | Is Docker running? Is port 6379 available? |
| Backend 500 errors | Check terminal for Python errors |
| No AI summary | Is GEMINI_API_KEY set correctly? |
| Celery tasks pending | Is Celery worker running? |
| Frontend not loading | Is npm dev server running? |

---

## Running in Production

### Recommended Setup

For production deployment:

1. **Use a process manager** like PM2 or Supervisor
2. **Use a reverse proxy** like Nginx
3. **Enable HTTPS** with Let's Encrypt
4. **Set secure CORS origins** (not `*`)
5. **Use environment files** (`.env`) instead of inline variables
6. **Add rate limiting** to prevent abuse
7. **Monitor with** logging and alerting

### Example Production Commands

```bash
# Backend with Gunicorn (instead of uvicorn --reload)
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker -b 0.0.0.0:8000

# Celery with concurrency
celery -A celery_app worker --loglevel=warning --concurrency=4

# Frontend production build
npm run build
npm start
```

---

## Need Help?

If you encounter issues:

1. Check the [Troubleshooting section](README.md#troubleshooting) in the README
2. Search existing [GitHub Issues](https://github.com/yourusername/universal-web-scraper/issues)
3. Create a new issue with:
   - Your OS and version
   - Python/Node versions
   - Full error message
   - Steps to reproduce

---

Happy Scraping! 🎉
