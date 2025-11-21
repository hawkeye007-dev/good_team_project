# Reading List Application - Project Skeleton

A full-stack application for scraping and summarizing URLs asynchronously. This project skeleton is designed for beginners to learn full-stack development with modern technologies.

**Stack:**
- **Frontend**: Next.js 14 with TypeScript
- **Backend**: Node.js/Express with MongoDB/PostgreSQL
- **Worker**: Python with Celery for async task processing
- **Queue**: Redis for task queue management
- **Database**: PostgreSQL (local) / Neon (production)
- **Monitoring**: Prometheus & Grafana

## Project Structure

```
reading_list_app/
├── client/                 # Next.js frontend
│   ├── app/                # App Router pages
│   ├── components/         # React components
│   ├── services/           # API client services
│   ├── package.json
│   └── .env.local.example
├── server/                 # Express backend
│   ├── routes/             # API route handlers
│   ├── models/             # Database schemas
│   ├── middleware/         # Custom middleware
│   ├── server.js           # Main server file
│   ├── package.json
│   └── .env.example
├── worker/                 # Celery worker
│   ├── celery_app.py       # Celery configuration
│   ├── tasks.py            # Task definitions
│   ├── requirements.txt
│   └── .env.example
├── docker-compose.yml      # Container orchestration
├── prometheus.yml          # Monitoring config
└── README.md               # This file
```

## Prerequisites

Ensure you have the following installed on your system:

- **Node.js 18+** and npm/yarn
- **Python 3.9+**
- **Docker** and **Docker Compose**
- **Git**

## Quick Start

### 1. Start Infrastructure (Docker)

First, spin up Redis, PostgreSQL, Prometheus, and Grafana:

```bash
docker-compose up -d
```

Verify services are running:
```bash
docker-compose ps
```

**Access monitoring dashboards:**
- Prometheus: http://localhost:9090
- Grafana: http://localhost:3001 (default: admin/admin)

### 2. Setup Frontend (Next.js)

```bash
cd client
npm install
cp .env.local.example .env.local

# Start development server
npm run dev
```

Frontend will be available at: **http://localhost:3000**

### 3. Setup Backend (Node/Express)

```bash
cd server
npm install
cp .env.example .env

# Start development server with auto-reload
npm run dev
```

Backend will be available at: **http://localhost:5000**

### 4. Setup Worker (Python/Celery)

```bash
cd worker
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
cp .env.example .env

# Start Celery worker
celery -A celery_app worker --loglevel=info
```

## Architecture Overview

### Data Flow

```
User Interface (Next.js)
        ↓
    REST API (Express)
        ↓
  Redis Queue
        ↓
  Celery Worker (Python)
        ↓
  Database (PostgreSQL)
        ↓
  Back to Frontend
```

### How It Works

1. **User submits URL** via frontend (URLInput component)
2. **Frontend sends request** to backend API (`/api/tasks/submit`)
3. **Backend validates and queues** the URL as a Celery task
4. **Task is stored in Redis** queue
5. **Celery worker picks up** the task asynchronously
6. **Worker scrapes the URL**, extracts content, and generates summary
7. **Results are saved** to PostgreSQL database
8. **Frontend polls** for updates or uses webhooks to display results
9. **User sees** the scraped content and AI-generated summary

## Development Guide

### Client-Side Tasks

**Files to implement:**
- `client/components/URLInput.tsx` - Form for URL input
- `client/components/SummaryList.tsx` - Display list of articles
- `client/services/api.ts` - API client functions
- `client/app/page.tsx` - Main page layout

**TODOs:**
- Create React hooks for managing articles state
- Implement form validation
- Add loading states and error handling
- Integrate with backend API
- Add polling for task status updates

### Backend Tasks

**Files to implement:**
- `server/server.js` - Express app setup with middleware
- `server/routes/tasks.js` - Task submission and retrieval endpoints
- `server/routes/auth.js` - User authentication endpoints
- `server/models/Article.js` - Mongoose schema for articles

**TODOs:**
- Setup database connection
- Implement task submission endpoint with validation
- Add Redis queue integration
- Implement article retrieval with pagination
- Add user authentication and authorization
- Add error handling middleware

### Worker Tasks

**Files to implement:**
- `worker/celery_app.py` - Celery configuration
- `worker/tasks.py` - Scraping and summarization logic

**TODOs:**
- Configure Redis connection
- Implement URL scraping using BeautifulSoup
- Choose and implement summarization library
- Add retry logic with exponential backoff
- Add error handling and logging
- Update database with results
- Add monitoring and metrics

## Environment Variables

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### Backend (.env)
```
PORT=5000
FRONTEND_URL=http://localhost:3000
DATABASE_URL=postgresql://user:password@localhost:5432/reading_list
REDIS_URL=redis://localhost:6379/0
JWT_SECRET=your_secret_key_here
CELERY_BROKER_URL=redis://localhost:6379/0
```

### Worker (.env)
```
CELERY_BROKER_URL=redis://localhost:6379/0
DATABASE_URL=postgresql://user:password@localhost:5432/reading_list
API_BASE_URL=http://localhost:5000
```

## Database Setup

### PostgreSQL (Local Development)

Connect to the PostgreSQL container:
```bash
docker-compose exec postgres psql -U reading_list_user -d reading_list
```

### Create Tables

Once connected to PostgreSQL, run SQL commands to create necessary tables. Students should implement this as part of the backend setup.

Example (PostgreSQL):
```sql
CREATE TABLE articles (
    id SERIAL PRIMARY KEY,
    url VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(255),
    summary TEXT,
    content TEXT,
    status VARCHAR(50),
    task_id VARCHAR(100),
    user_id INTEGER,
    error TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_user_created ON articles(user_id, created_at);
CREATE INDEX idx_status ON articles(status);
CREATE INDEX idx_url ON articles(url);
```

## Monitoring & Debugging

### Check Redis
```bash
docker-compose exec redis redis-cli
> KEYS *
> HGETALL celery-task-meta-<task_id>
```

### Check Celery Tasks
```bash
# In another terminal, start Celery Flower (monitoring UI)
pip install flower
celery -A celery_app flower
```

Then visit: http://localhost:5555

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f redis
docker-compose logs -f postgres

# Backend
npm run dev  # Logs shown in terminal

# Worker
celery -A celery_app worker --loglevel=debug
```

## Common Issues & Solutions

### Redis Connection Error
**Problem**: `Error: connect ECONNREFUSED 127.0.0.1:6379`
**Solution**: Ensure Redis container is running: `docker-compose ps`

### Database Connection Error
**Problem**: `Error: connect ECONNREFUSED 127.0.0.1:5432`
**Solution**: Ensure PostgreSQL container is running and environment variables are correct

### Celery Task Not Processing
**Problem**: Tasks stuck in queue
**Solution**: 
1. Check Celery worker is running: `celery -A celery_app inspect active`
2. Check Redis has tasks: `redis-cli KEYS *`
3. Review worker logs for errors

### CORS Errors
**Problem**: Frontend can't reach backend
**Solution**: Check `CORS_ORIGIN` in backend .env matches frontend URL

## Production Considerations

### For Production Deployment:

1. **Use Neon** for managed PostgreSQL (instead of local container)
   - Create account at https://neon.tech
   - Update `DATABASE_URL` with Neon connection string

2. **Use managed Redis** (e.g., Redis Cloud, AWS ElastiCache)
   - Update `REDIS_URL` with managed instance

3. **Deploy backend** to cloud platform:
   - Heroku, Railway, Vercel, AWS, GCP, Azure

4. **Deploy frontend** to CDN:
   - Vercel, Netlify, AWS S3 + CloudFront

5. **Deploy worker** separately:
   - Keep separate from backend for independent scaling
   - Use managed services like AWS SQS or cloud-based Celery

6. **Setup proper logging**:
   - CloudWatch, DataDog, ELK stack

7. **Enable authentication**:
   - Implement JWT properly
   - Use HTTPS only

## Testing

Add test files in each folder:
- `client/__tests__/`
- `server/__tests__/`
- `worker/tests/`

Run tests:
```bash
# Frontend
cd client && npm test

# Backend
cd server && npm test

# Worker
cd worker && pytest
```

## Learning Resources

### Frontend
- [Next.js Documentation](https://nextjs.org/docs)
- [React Hooks Guide](https://react.dev/reference/react)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

### Backend
- [Express.js Guide](https://expressjs.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [REST API Best Practices](https://restfulapi.net/)

### Worker
- [Celery Documentation](https://docs.celeryproject.io/)
- [BeautifulSoup Guide](https://www.crummy.com/software/BeautifulSoup/bs4/doc/)
- [Python Async Programming](https://docs.python.org/3/library/asyncio.html)

### DevOps
- [Docker Documentation](https://docs.docker.com/)
- [Kubernetes Basics](https://kubernetes.io/docs/tutorials/)

## Troubleshooting Checklist

- [ ] All Docker containers running: `docker-compose ps`
- [ ] Frontend accessible: http://localhost:3000
- [ ] Backend accessible: http://localhost:5000/health
- [ ] Redis working: `docker-compose exec redis redis-cli ping`
- [ ] Database connected: Check backend logs
- [ ] Celery worker running: Check worker terminal
- [ ] Environment variables copied: Check `.env` files
- [ ] All dependencies installed: `npm install` and `pip install -r requirements.txt`

## Team Workflow

1. **Assign TODOs** from code comments to team members
2. **Work on features** following the TODO structure
3. **Test individually** before integration
4. **Regular code reviews** to ensure quality
5. **Update documentation** as you implement features

## Contributing

This is a learning project. Each student should:
1. Pick uncompleted TODOs from the codebase
2. Implement the required functionality
3. Test their implementation
4. Submit for review
5. Integrate with team's code

## License

MIT License - Feel free to use this for learning and projects.

## Support

For questions or issues:
1. Check the troubleshooting section
2. Review the learning resources
3. Check Docker/service logs
4. Ask team members or instructors

---

**Happy coding! 🚀**

Remember: This skeleton is intentionally incomplete. The TODOs throughout the codebase are your assignment. Don't hesitate to research and experiment - that's how you learn!
