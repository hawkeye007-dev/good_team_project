# Architecture Overview

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                                 │
└────────────────────────────────┬────────────────────────────────────┘
                                 │
                    HTTP/REST API │ (Port 3000)
                                 │
                    ┌────────────▼────────────┐
                    │   NEXT.JS FRONTEND      │
                    │  (client/app/page.tsx)  │
                    │                         │
                    │ ┌─────────────────────┐ │
                    │ │   URLInput.tsx      │ │
                    │ └──────────┬──────────┘ │
                    │            │            │
                    │ ┌──────────▼──────────┐ │
                    │ │  SummaryList.tsx    │ │
                    │ └─────────────────────┘ │
                    │                         │
                    │ ┌─────────────────────┐ │
                    │ │  services/api.ts    │ │
                    │ │  (Axios HTTP calls) │ │
                    │ └──────────┬──────────┘ │
                    └────────────┬────────────┘
                                 │
                    HTTP/REST API │ (Port 5000)
                                 │
                    ┌────────────▼────────────┐
                    │  EXPRESS.JS BACKEND     │
                    │   (server/server.js)    │
                    │                         │
                    │ ┌─────────────────────┐ │
                    │ │  Middleware         │ │
                    │ │  - CORS             │ │
                    │ │  - JSON Parser      │ │
                    │ │  - Auth Check       │ │
                    │ └────────────┬────────┘ │
                    │              │          │
                    │ ┌────────────▼────────┐ │
                    │ │  routes/            │ │
                    │ │  - tasks.js         │ │
                    │ │  - auth.js          │ │
                    │ └────────┬────────┬───┘ │
                    │          │        │     │
                    └──────────┼────────┼─────┘
                               │        │
        ┌──────────────────────┘        │
        │                               │
   Store/Query          Enqueue Tasks   │
        │                               │
┌───────▼──────────┐            ┌──────▼──────────┐
│  POSTGRESQL DB   │            │   REDIS QUEUE   │
│  (Port 5432)     │            │  (Port 6379)    │
│                  │            │                 │
│ ┌──────────────┐ │            │ ┌────────────┐  │
│ │  articles    │ │            │ │   Tasks    │  │
│ │  - url       │ │            │ │  - pending │  │
│ │  - title     │ │            │ │  - running │  │
│ │  - summary   │ │            │ │  - done    │  │
│ │  - status    │ │            │ └──────▲─────┘  │
│ │  - content   │ │            └────────┼────────┘
│ └──────────────┘ │                     │
└──────────────────┘                     │
                                         │
                                    Pick Tasks
                                         │
                    ┌────────────────────┘
                    │
        ┌───────────▼───────────┐
        │  CELERY WORKER        │
        │  (Python)             │
        │                       │
        │ ┌───────────────────┐ │
        │ │  celery_app.py    │ │  (Worker Config)
        │ └───────────────────┘ │
        │                       │
        │ ┌───────────────────┐ │
        │ │  tasks.py         │ │
        │ │                   │ │
        │ │  scrape_and_      │ │
        │ │  summarize()      │ │
        │ │  - Get URL        │ │
        │ │  - Fetch content  │ │
        │ │  - Parse HTML     │ │
        │ │  - Extract text   │ │
        │ │  - Summarize      │ │
        │ │  - Update DB      │ │
        │ │                   │ │
        │ └─────────┬─────────┘ │
        └───────────┬───────────┘
                    │
                    │ Updates
                    │
                    ▼
        (Database updated with results)
        ┌──────────────────┐
        │   POSTGRESQL DB  │
        │ article status   │
        │ now "completed"  │
        │ with summary     │
        └──────────────────┘


Frontend polls for updates
(or receives via websocket)
                    │
                    ▼
        ┌──────────────────────┐
        │  Updated UI shows    │
        │  - Completed article │
        │  - Title             │
        │  - Summary           │
        │  - Original content  │
        └──────────────────────┘
```

---

## Data Flow Sequence

```
1. USER SUBMITS URL
   ├─ Opens browser
   ├─ Types URL in URLInput component
   └─ Clicks "Submit"

2. FRONTEND PROCESSING
   ├─ Validates URL format
   ├─ Calls api.submitUrl(url)
   └─ Sends POST to http://localhost:5000/api/tasks/submit

3. BACKEND RECEIVES REQUEST
   ├─ Validates URL
   ├─ Checks if URL already exists
   ├─ Creates Article in PostgreSQL (status: pending)
   ├─ Enqueues task to Redis queue
   └─ Returns task ID to frontend

4. FRONTEND WAITS FOR RESULT
   ├─ Polls /api/tasks/:id/status every 2-5 seconds
   └─ Or listens for WebSocket updates (TODO: implement)

5. CELERY WORKER PICKS UP TASK
   ├─ Monitors Redis queue
   ├─ Detects new task
   └─ Starts processing

6. WORKER PROCESSES (scrape_and_summarize task)
   ├─ Fetches URL with requests.get()
   ├─ Parses HTML with BeautifulSoup
   ├─ Extracts text content
   ├─ Generates summary with NLP
   ├─ Handles errors with retry logic
   └─ Updates database: Article.status = "completed"

7. FRONTEND DETECTS COMPLETION
   ├─ Polling detects status change
   ├─ Fetches full article details
   ├─ Updates SummaryList component
   └─ Displays summary to user

8. USER SEES RESULT
   ├─ Article appears in list
   ├─ Shows title and summary
   ├─ Shows "Completed" badge
   └─ Can delete or view details
```

---

## Component Dependency Tree

```
App (Next.js)
│
├─ Layout (app/layout.tsx)
│  └─ Children
│
├─ Page (app/page.tsx)
│  ├─ URLInput Component
│  │  ├─ Form Input
│  │  ├─ Submit Button
│  │  ├─ Loading State
│  │  └─ Error Message
│  │
│  └─ SummaryList Component
│     ├─ Article Cards
│     │  ├─ Title
│     │  ├─ Summary
│     │  ├─ Status Badge
│     │  ├─ Delete Button
│     │  └─ Timestamp
│     │
│     └─ Empty State Message
│
└─ Services
   └─ api.ts (Axios)
      ├─ submitUrl()
      ├─ fetchArticles()
      ├─ fetchArticleById()
      ├─ deleteArticle()
      └─ getTaskStatus()
```

---

## Database Schema

```
ARTICLES Table
┌─────────────┬──────────────┬─────────────────┐
│ Field       │ Type         │ Constraints     │
├─────────────┼──────────────┼─────────────────┤
│ id          │ SERIAL       │ PRIMARY KEY     │
│ url         │ VARCHAR(255) │ UNIQUE, NOT NULL│
│ title       │ VARCHAR(255) │ NULLABLE        │
│ summary     │ TEXT         │ NULLABLE        │
│ content     │ TEXT         │ NULLABLE        │
│ status      │ VARCHAR(50)  │ NOT NULL        │
│             │              │ (pending,       │
│             │              │  completed,     │
│             │              │  failed)        │
│ task_id     │ VARCHAR(100) │ NULLABLE        │
│ user_id     │ INTEGER      │ FOREIGN KEY     │
│ error       │ TEXT         │ NULLABLE        │
│ created_at  │ TIMESTAMP    │ DEFAULT NOW()   │
│ updated_at  │ TIMESTAMP    │ DEFAULT NOW()   │
└─────────────┴──────────────┴─────────────────┘

Indexes:
- idx_user_created (user_id, created_at DESC)
- idx_status (status)
- idx_url (url)
```

---

## Redis Queue Structure

```
Redis Data Structure
├─ celery-task-meta-<task_id>
│  ├─ status (PENDING, STARTED, SUCCESS, FAILURE)
│  ├─ result (task result)
│  └─ traceback (error traceback if failed)
│
├─ celery (main queue)
│  └─ [Task 1, Task 2, Task 3, ...]
│
└─ celery-task-set-<timestamp>
   └─ List of task IDs
```

---

## Service Monitoring (Prometheus/Grafana)

```
Prometheus Scrape Targets
├─ http://localhost:9090 (Prometheus itself)
├─ http://localhost:5000/metrics (Express - TODO: implement)
├─ http://localhost:8000 (Celery Flower - TODO: add)
└─ http://localhost:6379 (Redis - TODO: export metrics)

Grafana Dashboards
├─ System Metrics
│  ├─ CPU Usage
│  ├─ Memory Usage
│  └─ Disk Usage
│
├─ Application Metrics
│  ├─ API Response Times
│  ├─ Error Rates
│  └─ Request Count
│
├─ Task Queue Metrics
│  ├─ Pending Tasks
│  ├─ Completed Tasks
│  ├─ Failed Tasks
│  └─ Average Task Duration
│
└─ Database Metrics
   ├─ Query Response Time
   ├─ Connection Pool
   └─ Database Size
```

---

## Deployment Architecture (Production)

```
┌─────────────────────────────────────────────────────────┐
│                    CDN / Load Balancer                   │
│              (Vercel, Netlify, or Cloudflare)            │
└────────────────────────┬────────────────────────────────┘
                         │
         ┌───────────────┴───────────────┐
         │                               │
    ┌────▼──────┐               ┌───────▼────┐
    │ Frontend   │               │  Frontend   │
    │ (Instance  │               │ (Instance   │
    │    1)      │               │    2)       │
    └─────┬──────┘               └────┬────────┘
          │                           │
          └─────────────┬─────────────┘
                        │
            ┌───────────▼──────────┐
            │  API Gateway /       │
            │  Load Balancer       │
            │  (AWS ALB, nginx)    │
            └───────────┬──────────┘
                        │
        ┌───────────────┴───────────────┐
        │                               │
   ┌────▼──────┐               ┌───────▼────┐
   │ Backend    │               │  Backend    │
   │(Instance 1)│               │(Instance 2) │
   └─────┬──────┘               └────┬────────┘
         │                           │
         └─────────────┬─────────────┘
                       │
        ┌──────────────▼──────────────┐
        │  Managed PostgreSQL (Neon)  │
        │  or AWS RDS                 │
        └──────────────────────────────┘
                       │
        ┌──────────────▼──────────────┐
        │  Managed Redis              │
        │  (Redis Cloud, AWS          │
        │  ElastiCache)               │
        └──────────────────────────────┘
                       │
        ┌──────────────▼──────────────┐
        │  Celery Workers             │
        │  (Auto-scaling group)       │
        │  - Multiple instances       │
        │  - Auto-scale based on      │
        │    queue depth              │
        └──────────────────────────────┘

Additional Services:
├─ Logging: CloudWatch / ELK Stack
├─ Monitoring: Prometheus / DataDog
├─ Tracing: Jaeger / AWS X-Ray
└─ Security: SSL/TLS, WAF, DDoS Protection
```

---

## Folder Structure (Detailed)

```
reading_list_app/
│
├── client/                           # FRONTEND
│   ├── app/
│   │   ├── layout.tsx               # Root layout
│   │   ├── page.tsx                 # Main page
│   │   └── globals.css              # Global styles
│   ├── components/
│   │   ├── URLInput.tsx             # Form for URL submission
│   │   └── SummaryList.tsx          # List display component
│   ├── services/
│   │   └── api.ts                   # API client
│   ├── public/                       # Static assets
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env.local.example
│   └── next.config.ts
│
├── server/                           # BACKEND
│   ├── routes/
│   │   ├── tasks.js                 # Task endpoints
│   │   └── auth.js                  # Auth endpoints
│   ├── models/
│   │   ├── Article.js               # Article schema
│   │   └── User.js                  # User schema (TODO)
│   ├── middleware/
│   │   ├── authMiddleware.js        # Auth middleware (TODO)
│   │   └── errorHandler.js          # Error handling (TODO)
│   ├── controllers/                 # (TODO) Add controllers
│   ├── utils/                       # (TODO) Add utilities
│   ├── server.js                    # Main server file
│   ├── package.json
│   ├── .env.example
│   └── .gitignore
│
├── worker/                           # PYTHON WORKER
│   ├── celery_app.py                # Celery config
│   ├── tasks.py                     # Task definitions
│   ├── requirements.txt             # Dependencies
│   ├── .env.example
│   └── .gitignore
│
├── docker-compose.yml                # Docker config
├── prometheus.yml                    # Monitoring config
├── README.md                         # Main documentation
├── STRUCTURE.md                      # Structure documentation
├── QUICKSTART.md                     # Quick start guide
├── ARCHITECTURE.md                   # This file
│
└── .gitignore                        # Git ignore
```

---

**This architecture is designed for learning and scalability!**
