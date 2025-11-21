# Deployment & Configuration Guide

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# OpenRouter API Configuration
NEXT_PUBLIC_OPENROUTER_API_KEY=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
```

## Local Development

### Prerequisites
- Node.js 18.17 or later
- npm, yarn, pnpm, or bun

### Setup Steps

1. **Install dependencies**
```bash
npm install
```

2. **Run development server**
```bash
npm run dev
```

3. **Open in browser**
Navigate to [http://localhost:3000](http://localhost:3000)

### Development Server Features
- Fast refresh on code changes
- Integrated TypeScript checking
- Environment variable hot reload

## Production Build

### Build Process

```bash
npm run build
npm start
```

### Production Optimizations

The build process includes:
- Code splitting and minification
- Static site generation where possible
- Image optimization
- Font optimization
- CSS minification
- JavaScript tree-shaking

### Build Output

```
.next/
├── static/      # Static assets
├── server/      # Server-side code
└── standalone/  # Standalone server (if configured)
```

## Deployment Options

### Vercel (Recommended)

Vercel is the easiest way to deploy Next.js applications:

1. Push your code to GitHub/GitLab/Bitbucket
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard
4. Vercel automatically deploys on push

[Deploy to Vercel](https://vercel.com/new?utm_source=github&utm_medium=readme&utm_campaign=next-example)

### Docker Deployment

Create a `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY .next ./.next
COPY public ./public

EXPOSE 3000

CMD ["npm", "start"]
```

Build and run:

```bash
docker build -t reading-list .
docker run -p 3000:3000 -e NEXT_PUBLIC_OPENROUTER_API_KEY=your-key reading-list
```

### Self-Hosted VPS

```bash
# SSH into your server
ssh user@your-domain.com

# Clone the repository
git clone <repo-url>
cd url_scrapper

# Install dependencies
npm install

# Build the project
npm run build

# Use PM2 for process management
npm install -g pm2
pm2 start npm --name "reading-list" -- start
pm2 save
pm2 startup
```

### Render.com

1. Push to GitHub
2. Connect repository to Render
3. Set build command: `npm install && npm run build`
4. Set start command: `npm start`
5. Add environment variables
6. Deploy

### Railway.app

1. Connect GitHub repository
2. Add environment variables
3. Railway auto-detects Next.js
4. Automatic deploys on push

## Environment-Specific Configuration

### Development
```env
NEXT_PUBLIC_OPENROUTER_API_KEY=your-dev-key
NODE_ENV=development
```

### Production
```env
NEXT_PUBLIC_OPENROUTER_API_KEY=your-prod-key
NODE_ENV=production
```

## Performance Tuning

### API Optimization

**Request Timeout**: 10 seconds (configurable in `route.ts`)

```typescript
const timeoutId = setTimeout(() => controller.abort(), 10000);
```

**Content Limit**: 10,000 characters (prevents large payloads)

```typescript
content: content.slice(0, 10000)
```

**Response Caching**: Add to API routes for static content

```typescript
export const revalidate = 3600; // Cache for 1 hour
```

### Frontend Optimization

- **Code Splitting**: Automatic with Next.js App Router
- **Image Optimization**: Use `next/image` for images
- **Font Loading**: System fonts (fast loading)
- **CSS**: Tailwind CSS with PurgeCSS (removes unused styles)

## Monitoring & Logging

### Application Logs

In development:
```bash
npm run dev
```

In production with PM2:
```bash
pm2 logs reading-list
```

### Error Tracking

To add error tracking, install a service like Sentry:

```bash
npm install @sentry/nextjs
```

### Performance Monitoring

Use Next.js built-in Web Vitals:

```typescript
import { CLS, FID, FCP, LCP, TTFB } from 'web-vitals';

function sendToAnalytics(metric) {
  console.log(metric);
}

export function reportWebVitals(metric) {
  sendToAnalytics(metric);
}
```

## Security Best Practices

1. **API Keys**
   - Never commit `.env.local`
   - Use `.env.local.example` for documentation
   - Rotate keys regularly

2. **Input Validation**
   - URLs are validated before fetching
   - Content length is limited
   - User input is sanitized

3. **CORS & Headers**
   - Add security headers in `next.config.ts`:
   ```typescript
   async headers() {
     return [{
       source: '/(.*)',
       headers: [
         {
           key: 'X-Content-Type-Options',
           value: 'nosniff'
         },
         {
           key: 'X-Frame-Options',
           value: 'DENY'
         }
       ]
     }]
   }
   ```

4. **Rate Limiting**
   - Implement rate limiting for API endpoints
   - Use libraries like `ratelimit` or `express-rate-limit`

## Database Setup (Future)

When integrating a database:

### PostgreSQL Setup

```bash
npm install @prisma/client
npm install -D prisma

npx prisma init
```

Create `.env.local`:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/reading_list"
```

### MongoDB Setup

```bash
npm install mongoose
```

Create `.env.local`:
```env
MONGODB_URI="mongodb+srv://user:password@cluster.mongodb.net/reading_list"
```

## Troubleshooting

### Build Fails
- Clear `.next` directory: `rm -rf .next`
- Clear node_modules: `rm -rf node_modules && npm install`
- Check Node.js version: `node --version` (should be 18+)

### API Errors
- Check OpenRouter API key is correct
- Verify network connectivity
- Check API key usage limits on OpenRouter dashboard

### Performance Issues
- Use `next/image` for images
- Enable API route caching
- Use CDN for static assets
- Consider serverless functions for heavy computation

## Scaling Considerations

1. **Horizontal Scaling**
   - Use load balancer (nginx, HAProxy)
   - Run multiple instances with PM2 cluster mode
   - Share session state (Redis)

2. **Database Scaling**
   - Add read replicas for PostgreSQL
   - Use MongoDB sharding
   - Implement caching layer (Redis)

3. **API Rate Limiting**
   - Per-user rate limits
   - Per-IP rate limits
   - Queue for long-running tasks

## Backup & Recovery

```bash
# Backup database
pg_dump reading_list > backup.sql

# Restore database
psql reading_list < backup.sql

# Backup application files
tar -czf app-backup.tar.gz .
```

## Maintenance

### Regular Tasks
- Monitor API usage and costs
- Update dependencies: `npm outdated`, `npm update`
- Review error logs
- Optimize database queries
- Clean up old data

### Dependency Updates
```bash
# Check for updates
npm outdated

# Update minor and patch versions
npm update

# Update major versions (manual)
npm install next@latest
```

---

For more information, see:
- [Next.js Deployment Docs](https://nextjs.org/docs/deployment)
- [OpenRouter Documentation](https://openrouter.ai/docs)
- [Vercel Documentation](https://vercel.com/docs)
