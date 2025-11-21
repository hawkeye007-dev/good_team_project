# Enhancement Guide: AI Integration, Caching, and Logging

## 1. AI Integration (Summarization & Classification)

### Option A: OpenAI Integration (Easiest)

#### Step 1: Update `worker/requirements.txt`

Add to dependencies:
```
openai==1.3.0
```

#### Step 2: Create `worker/ai_service.py`

```python
"""
AI Service for summarization and topic classification
"""
import os
from openai import OpenAI

client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

def summarize_text(text: str) -> str:
    """
    Summarize text using OpenAI GPT-3.5
    
    Args:
        text: Long-form text to summarize
    
    Returns:
        Short summary
    """
    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {
                    "role": "system",
                    "content": "You are a helpful assistant that summarizes articles concisely in 2-3 sentences."
                },
                {
                    "role": "user",
                    "content": f"Please summarize this text:\n\n{text}"
                }
            ],
            max_tokens=200,
            temperature=0.7
        )
        return response.choices[0].message.content
    except Exception as e:
        raise Exception(f"Summarization failed: {str(e)}")

def classify_topics(text: str) -> list:
    """
    Classify topics in text
    
    Args:
        text: Text to classify
    
    Returns:
        List of topics/categories
    """
    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {
                    "role": "system",
                    "content": "You are a content classifier. Extract 3-5 main topics from the given text. Return as comma-separated list."
                },
                {
                    "role": "user",
                    "content": f"Classify topics in this text:\n\n{text}"
                }
            ],
            max_tokens=100,
            temperature=0.5
        )
        topics_str = response.choices[0].message.content
        return [t.strip() for t in topics_str.split(',')]
    except Exception as e:
        raise Exception(f"Classification failed: {str(e)}")
```

#### Step 3: Update `worker/tasks.py`

```python
from ai_service import summarize_text, classify_topics

@app.task(bind=True, max_retries=3)
def scrape_and_summarize(self, article_id, url):
    """
    Scrape URL, extract text, summarize, and classify topics
    """
    try:
        # 1. Fetch URL
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        
        # 2. Parse HTML
        soup = BeautifulSoup(response.content, 'html.parser')
        title = soup.title.string if soup.title else "No title"
        
        # 3. Extract text
        text_content = soup.get_text()[:5000]  # Limit to first 5000 chars
        
        # 4. AI Summarization
        summary = summarize_text(text_content)
        
        # 5. AI Classification
        topics = classify_topics(text_content)
        
        # 6. Update database
        update_article(
            article_id=article_id,
            title=title,
            summary=summary,
            topics=topics,
            status='completed'
        )
        
        return {'status': 'completed', 'article_id': article_id}
        
    except Exception as e:
        logger.error(f"Error: {str(e)}")
        if self.request.retries < self.max_retries:
            raise self.retry(exc=e, countdown=2 ** self.request.retries)
        else:
            update_article(article_id=article_id, status='failed', error=str(e))
            raise
```

#### Step 4: Update `.env.example`

```
OPENAI_API_KEY=sk-your-key-here
```

### Option B: Hugging Face (Free, Open Source)

```python
from transformers import pipeline

summarizer = pipeline("summarization", model="facebook/bart-large-cnn")
classifier = pipeline("zero-shot-classification", model="facebook/bart-large-mnli")

def summarize_text(text: str) -> str:
    try:
        result = summarizer(text[:1024], max_length=150, min_length=50)
        return result[0]['summary_text']
    except Exception as e:
        raise Exception(f"Summarization failed: {str(e)}")

def classify_topics(text: str) -> list:
    candidate_labels = [
        "technology", "business", "health", "sports", 
        "entertainment", "politics", "science", "education"
    ]
    try:
        result = classifier(text[:512], candidate_labels)
        return [label for label in result['labels'][:3]]
    except Exception as e:
        raise Exception(f"Classification failed: {str(e)}")
```

---

## 2. Redis Caching Strategy

### Add to `server/utils/cache.js`

```javascript
const redis = require('redis');
const client = redis.createClient({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379
});

// Cache configuration
const CACHE_TTL = {
  ARTICLE: 3600,        // 1 hour
  ARTICLE_LIST: 300,    // 5 minutes
  HOT_ARTICLES: 1800,   // 30 minutes
  API_RESPONSE: 600     // 10 minutes
};

/**
 * Get cached value
 */
async function getCache(key) {
  try {
    const data = await client.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Cache get error:', error);
    return null;
  }
}

/**
 * Set cached value
 */
async function setCache(key, value, ttl = CACHE_TTL.ARTICLE) {
  try {
    await client.setex(key, ttl, JSON.stringify(value));
  } catch (error) {
    console.error('Cache set error:', error);
  }
}

/**
 * Delete cache key
 */
async function deleteCache(key) {
  try {
    await client.del(key);
  } catch (error) {
    console.error('Cache delete error:', error);
  }
}

/**
 * Get list of "hot" articles (most viewed/recent)
 */
async function getHotArticles(limit = 10) {
  const cacheKey = `hot_articles:${limit}`;
  
  // Try cache first
  let data = await getCache(cacheKey);
  if (data) return data;
  
  // Query database if not cached
  data = await Article.find({status: 'completed'})
    .sort({views: -1})
    .limit(limit);
  
  // Cache result
  await setCache(cacheKey, data, CACHE_TTL.HOT_ARTICLES);
  return data;
}

module.exports = {
  getCache,
  setCache,
  deleteCache,
  getHotArticles,
  CACHE_TTL
};
```

### Update `server/routes/tasks.js` to use caching

```javascript
const { getCache, setCache, deleteCache, CACHE_TTL } = require('../utils/cache');

// In GET /api/tasks/:id endpoint
router.get('/:id', async (req, res) => {
  try {
    const cacheKey = `article:${req.params.id}`;
    
    // 1. Try to get from cache
    let article = await getCache(cacheKey);
    if (article) {
      return res.json({ ...article, source: 'cache' });
    }
    
    // 2. Query database
    article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }
    
    // 3. Cache the result
    await setCache(cacheKey, article, CACHE_TTL.ARTICLE);
    
    res.json({ ...article.toObject(), source: 'database' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// In DELETE endpoint - invalidate cache
router.delete('/:id', async (req, res) => {
  try {
    await Article.findByIdAndDelete(req.params.id);
    
    // Invalidate cache
    await deleteCache(`article:${req.params.id}`);
    await deleteCache('hot_articles:10');  // Also clear hot articles cache
    
    res.json({ message: 'Article deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

---

## 3. Logstash & ELK Stack Integration

### Update `docker-compose.yml` - Add ELK Services

```yaml
  # Elasticsearch - Data store for logs
  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:8.0.0
    container_name: reading_list_elasticsearch
    environment:
      - discovery.type=single-node
      - xpack.security.enabled=false
    ports:
      - "9200:9200"
    volumes:
      - elasticsearch_data:/usr/share/elasticsearch/data
    networks:
      - reading_list_network
    healthcheck:
      test: ["CMD-SHELL", "curl -f http://localhost:9200/_cluster/health || exit 1"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Logstash - Log processing
  logstash:
    image: docker.elastic.co/logstash/logstash:8.0.0
    container_name: reading_list_logstash
    volumes:
      - ./logstash.conf:/usr/share/logstash/pipeline/logstash.conf
    environment:
      - "LS_JAVA_OPTS=-Xmx256m -Xms256m"
    ports:
      - "5000:5000"
    depends_on:
      - elasticsearch
    networks:
      - reading_list_network

  # Kibana - Visualization
  kibana:
    image: docker.elastic.co/kibana/kibana:8.0.0
    container_name: reading_list_kibana
    ports:
      - "5601:5601"
    environment:
      ELASTICSEARCH_HOSTS: http://elasticsearch:9200
    depends_on:
      - elasticsearch
    networks:
      - reading_list_network
    healthcheck:
      test: ["CMD-SHELL", "curl -f http://localhost:5601/api/status || exit 1"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  elasticsearch_data:
```

### Create `logstash.conf`

```
input {
  # Receive logs from applications
  tcp {
    port => 5000
    codec => json
  }
  
  # File input for application logs
  file {
    path => "/var/log/application/*.log"
    start_position => "beginning"
  }
}

filter {
  # Parse JSON logs
  if [message] =~ /^\{.*\}$/ {
    json {
      source => "message"
    }
  }
  
  # Add timestamp
  date {
    match => ["timestamp", "ISO8601"]
    target => "@timestamp"
  }
}

output {
  # Send to Elasticsearch
  elasticsearch {
    hosts => ["elasticsearch:9200"]
    index => "logs-%{+YYYY.MM.dd}"
  }
  
  # Also output to stdout for debugging
  stdout {
    codec => rubydebug
  }
}
```

### Update `server/server.js` to send logs

```javascript
const winston = require('winston');
const { ElasticsearchTransport } = require('winston-elasticsearch');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new ElasticsearchTransport({
      level: 'info',
      clientOpts: {
        node: process.env.ELASTICSEARCH_URL || 'http://localhost:9200'
      },
      index: 'logs-app'
    })
  ]
});

// Use logger throughout
logger.info('Server started', { port: PORT });
logger.error('Error occurred', { error: err.message });
```

### Access Kibana

Once running:
```bash
# View logs
http://localhost:5601

# Create index pattern: logs-*
# View logs in Kibana UI
# Create dashboards and alerts
```

---

## Implementation Checklist

### Week 1: AI Integration
- [ ] Choose AI provider (OpenAI vs Hugging Face)
- [ ] Set up API credentials
- [ ] Create AI service module
- [ ] Update requirements.txt
- [ ] Test summarization locally
- [ ] Test classification locally
- [ ] Integrate into worker task
- [ ] Add error handling

### Week 2: Caching
- [ ] Create Redis cache utility
- [ ] Implement caching in GET endpoints
- [ ] Add cache invalidation on updates
- [ ] Test cache hits/misses
- [ ] Monitor cache performance
- [ ] Set appropriate TTLs
- [ ] Document cache strategy

### Week 3: Logging (ELK)
- [ ] Add ELK services to docker-compose
- [ ] Create logstash.conf
- [ ] Configure log forwarding in apps
- [ ] Test log ingestion
- [ ] Create Kibana index patterns
- [ ] Build monitoring dashboards
- [ ] Set up alerts for errors

---

## Testing the Enhancements

### Test AI Integration
```bash
# Manual test
python -c "from ai_service import summarize_text; print(summarize_text('test text'))"
```

### Test Caching
```bash
# Monitor Redis
docker-compose exec redis redis-cli
MONITOR  # Watch cache operations
```

### Test Logging
```bash
# View Kibana logs
http://localhost:5601
# Search for errors, performance issues
```

---

**Your skeleton is now truly production-ready with these enhancements!** 🚀
