# Quick Reference Guide

## Starting the Application

### Terminal 1: Infrastructure (Docker)
```bash
cd d:\good_team
docker-compose up -d
docker-compose ps  # Verify all services are running
```

### Terminal 2: Frontend (Next.js)
```bash
cd d:\good_team\client
npm install
npm run dev
# Frontend available at http://localhost:3000
```

### Terminal 3: Backend (Express)
```bash
cd d:\good_team\server
npm install
npm run dev
# Backend available at http://localhost:5000
# Health check: http://localhost:5000/health
```

### Terminal 4: Worker (Celery)
```bash
cd d:\good_team\worker

# Windows
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

celery -A celery_app worker --loglevel=info
```

---

## Service URLs

| Service | URL | Purpose |
|---------|-----|---------|
| Frontend | http://localhost:3000 | Main application UI |
| Backend | http://localhost:5000 | API endpoints |
| Redis | localhost:6379 | Task queue |
| PostgreSQL | localhost:5432 | Database |
| Prometheus | http://localhost:9090 | Metrics visualization |
| Grafana | http://localhost:3001 | Dashboard (admin/admin) |

---

## Database Connection (PostgreSQL)

```bash
# Connect to database in container
docker-compose exec postgres psql -U reading_list_user -d reading_list

# Common PostgreSQL commands
\l              # List databases
\dt             # List tables
\d articles     # Describe table
SELECT * FROM articles;  # Query data
```

---

## Redis Commands

```bash
# Connect to Redis
docker-compose exec redis redis-cli

# Redis commands
KEYS *                  # List all keys
GET key_name            # Get value
HGETALL key_name        # Get all fields in hash
LRANGE key_name 0 -1   # List range
FLUSHDB                # Clear current database
```

---

## API Endpoints Summary

### Tasks API (to be implemented)
```
POST   /api/tasks/submit      - Submit URL for scraping
GET    /api/tasks/list        - Get all tasks (with pagination)
GET    /api/tasks/:id         - Get specific task
GET    /api/tasks/:id/status  - Get task status (polling)
DELETE /api/tasks/:id         - Delete task
```

### Auth API (to be implemented)
```
POST /api/auth/register   - Register user
POST /api/auth/login      - Login user
POST /api/auth/logout     - Logout user
GET  /api/auth/profile    - Get user profile
```

---

## Monitoring Tools

### Celery Tasks Monitoring
```bash
pip install flower
celery -A celery_app flower
# Visit http://localhost:5555
```

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f redis
docker-compose logs -f postgres

# Backend logs (in terminal running backend)
# Worker logs (in terminal running worker)
```

---

## Debugging Checklist

### Issue: "Cannot connect to server"
```bash
# Check if backend is running
curl http://localhost:5000/health

# Check backend logs
cd server && npm run dev

# Verify environment variables
cat server/.env
```

### Issue: "Redis connection refused"
```bash
# Check if Redis is running
docker-compose ps

# Restart Redis
docker-compose restart redis

# Test Redis
docker-compose exec redis redis-cli ping
```

### Issue: "Database connection error"
```bash
# Check PostgreSQL status
docker-compose ps

# Test database connection
docker-compose exec postgres psql -U reading_list_user -d reading_list

# Check connection string in .env
cat server/.env
```

### Issue: "Celery task not processing"
```bash
# Check if worker is running
# (should show in terminal running worker)

# Check Redis queue
docker-compose exec redis redis-cli KEYS *

# Monitor with Flower
pip install flower
celery -A celery_app flower
```

---

## File Locations Quick Reference

### Frontend
- Main page: `client/app/page.tsx`
- Components: `client/components/`
- API service: `client/services/api.ts`
- Config: `client/.env.local`

### Backend
- Server setup: `server/server.js`
- Task routes: `server/routes/tasks.js`
- Auth routes: `server/routes/auth.js`
- Models: `server/models/Article.js`
- Config: `server/.env`

### Worker
- Configuration: `worker/celery_app.py`
- Tasks: `worker/tasks.py`
- Dependencies: `worker/requirements.txt`
- Config: `worker/.env`

---

## Common npm/pip Commands

### NPM (Frontend & Backend)
```bash
npm install              # Install dependencies
npm run dev              # Start development server
npm run build            # Build for production
npm test                 # Run tests
npm start                # Start production server
```

### Pip (Worker)
```bash
pip install -r requirements.txt    # Install dependencies
pip install package_name           # Install single package
pip freeze > requirements.txt      # Save dependencies
pip list                          # List installed packages
```

---

## Docker Commands

```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# View running services
docker-compose ps

# View logs
docker-compose logs -f

# Restart specific service
docker-compose restart redis

# View service details
docker-compose exec postgres psql --version

# Remove volumes (WARNING: deletes data)
docker-compose down -v
```

---

## TODO Priority Order

### Phase 1: Infrastructure (Foundation)
1. [ ] Setup database schema in `server/models/Article.js`
2. [ ] Configure Celery in `worker/celery_app.py`
3. [ ] Initialize Express server in `server/server.js`

### Phase 2: API (Backend Routes)
4. [ ] Implement `server/routes/tasks.js` endpoints
5. [ ] Implement `server/routes/auth.js` endpoints
6. [ ] Add error handling middleware

### Phase 3: Frontend (User Interface)
7. [ ] Implement `client/components/URLInput.tsx`
8. [ ] Implement `client/components/SummaryList.tsx`
9. [ ] Implement `client/services/api.ts`
10. [ ] Integrate in `client/app/page.tsx`

### Phase 4: Worker (Processing)
11. [ ] Implement `scrape_and_summarize()` task
12. [ ] Add retry logic and error handling
13. [ ] Add status update callbacks

### Phase 5: Integration (Testing)
14. [ ] End-to-end testing
15. [ ] Performance optimization
16. [ ] Deployment preparation

---

## Git Workflow Suggestion

```bash
# Branch naming
git checkout -b feature/task-submission
git checkout -b feature/scraping-worker
git checkout -b fix/cors-error

# Regular commits
git add .
git commit -m "Implement task submission endpoint"
git push origin feature/task-submission

# Create pull request
# Code review
# Merge to main
```

---

## Performance Tips

1. **Database**: Add indexes to frequently queried fields
2. **API**: Implement pagination for list endpoints
3. **Frontend**: Use React.memo for components
4. **Worker**: Batch process tasks when possible
5. **Cache**: Use Redis for frequently accessed data
6. **Monitoring**: Set up alerts in Prometheus/Grafana

---

## Security Reminders

- [ ] Never commit `.env` files (use `.env.example`)
- [ ] Validate all user inputs
- [ ] Use HTTPS in production
- [ ] Implement rate limiting
- [ ] Use strong JWT secrets
- [ ] Sanitize database queries
- [ ] Keep dependencies updated
- [ ] Add authentication to all endpoints

---

## Additional Resources

- Next.js: https://nextjs.org/docs
- Express: https://expressjs.com/
- Celery: https://docs.celeryproject.io/
- Docker: https://docs.docker.com/
- PostgreSQL: https://www.postgresql.org/docs/
- Redis: https://redis.io/documentation

---

**Remember: Read the TODO comments in each file for specific implementation details!**
