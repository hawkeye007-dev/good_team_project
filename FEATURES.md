# Reading List Application

## Environment Setup

Create a `.env.local` file in the root directory with:

```env
# OpenRouter API Configuration
NEXT_PUBLIC_OPENROUTER_API_KEY=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
```

## Features

- ✨ **URL Scraping**: Automatically extract content from any URL
- 🤖 **AI Summarization**: Uses OpenRouter's Kimi K2 model to generate summaries
- 🏷️ **Topic Classification**: Automatically categorize articles by topics
- 📊 **Stats Dashboard**: Track your reading progress
- 🔍 **Topic Filtering**: Filter articles by automatically detected topics
- 📱 **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- ⚡ **Async Processing**: Non-blocking URL processing with real-time status updates
- 🎨 **Production UI**: Beautiful, accessible interface with Tailwind CSS

## Project Structure

```
app/
├── api/
│   ├── scrape-url/
│   │   └── route.ts          # URL content extraction API
│   └── summarize/
│       └── route.ts           # AI summarization & topic classification
├── components/
│   ├── ui/
│   │   └── common.tsx         # Reusable UI components (spinners, alerts, badges)
│   ├── UrlInput.tsx           # URL input form component
│   └── ReadingListItem.tsx    # Reading list display component
├── hooks/
│   └── useReadingList.ts      # Custom hook for reading list logic
├── types/
│   └── reading-list.ts        # TypeScript type definitions
├── globals.css                # Global styles
├── layout.tsx                 # Root layout
└── page.tsx                   # Main reading list page
```

## How It Works

1. **User enters URL** → Input validation
2. **Scrape content** → Fetch URL and extract clean text
3. **AI Processing** → Send to OpenRouter's Kimi K2 model
4. **AI Response** → Get summary and topics
5. **Display results** → Show in reading list with filtering

## API Endpoints

### POST `/api/scrape-url`
Extracts text content from a URL.

**Request:**
```json
{
  "url": "https://example.com/article"
}
```

**Response:**
```json
{
  "success": true,
  "content": "Extracted text content..."
}
```

### POST `/api/summarize`
Summarizes content and extracts topics using AI.

**Request:**
```json
{
  "content": "Full article text...",
  "url": "https://example.com/article"
}
```

**Response:**
```json
{
  "success": true,
  "summary": "2-3 sentence summary...",
  "topics": ["topic1", "topic2", "topic3"]
}
```

## Running Locally

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
npm start
```

Navigate to `http://localhost:3000` to use the application.

## Technology Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **AI Model**: OpenRouter (Kimi K2)
- **State Management**: React Hooks
- **API**: Next.js API Routes

## Future Enhancements

- Database integration (PostgreSQL/MongoDB)
- User authentication and accounts
- Reading time estimates
- Article search functionality
- Export/share reading lists
- Browser extension
- Mobile app
- Offline support
- Dark mode toggle

## Error Handling

The application includes comprehensive error handling for:
- Invalid URLs
- Network timeouts
- API failures
- Empty content
- Duplicate URLs
- Input validation

All errors are displayed to users with helpful messages.
