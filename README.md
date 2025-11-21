# 📚 Reading List - AI-Powered Article Summarizer

A modern, production-ready web application that automatically scrapes URLs, summarizes articles using AI, and intelligently categorizes content by topics.

## ✨ Features

- **🔗 URL Scraping**: Extract clean text content from any webpage
- **🤖 AI Summarization**: Generate concise 2-3 sentence summaries powered by OpenRouter's Kimi K2 model
- **🏷️ Auto Topic Classification**: Intelligently categorize articles with relevant tags
- **📊 Dashboard Stats**: Track your reading progress with real-time statistics
- **🔍 Smart Filtering**: Filter articles by automatically detected topics
- **📱 Fully Responsive**: Optimized for desktop, tablet, and mobile devices
- **⚡ Async Processing**: Non-blocking URL processing with real-time status updates
- **🎨 Beautiful UI**: Modern, accessible interface built with Tailwind CSS
- **⚙️ Production-Ready**: Comprehensive error handling, validation, and optimized performance

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- OpenRouter API key (get one free at [openrouter.ai](https://openrouter.ai))

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd url_scrapper
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_OPENROUTER_API_KEY=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
```

4. **Run the development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 📖 How It Works

1. **Enter a URL** → Paste any article URL into the input field
2. **Content Extraction** → The app fetches and extracts clean text from the webpage
3. **AI Processing** → Content is sent to OpenRouter's Kimi K2 model
4. **Smart Analysis** → AI generates a summary and identifies relevant topics
5. **View Results** → See the summary, topics, and read the full article

## 🏗️ Project Structure

```
app/
├── api/
│   ├── scrape-url/route.ts      # Content extraction endpoint
│   └── summarize/route.ts        # AI summarization endpoint
├── components/
│   ├── ui/common.tsx             # Reusable UI components
│   ├── UrlInput.tsx              # URL input form
│   └── ReadingListItem.tsx       # List display component
├── hooks/
│   └── useReadingList.ts         # Custom React hook
├── types/
│   └── reading-list.ts           # TypeScript definitions
├── globals.css                   # Global styling
├── layout.tsx                    # Root layout
└── page.tsx                      # Main page
```

## 🔌 API Endpoints

### POST `/api/scrape-url`
Extracts text content from a webpage.

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
  "content": "Extracted article text..."
}
```

### POST `/api/summarize`
Generates summaries and identifies topics.

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
  "summary": "A concise 2-3 sentence summary...",
  "topics": ["technology", "ai", "productivity"]
}
```

## 🛠️ Available Commands

```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

## 🎯 Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **AI Model**: OpenRouter (GPT-3.5 Turbo)
- **State Management**: React Hooks
- **API**: Next.js API Routes

## 📊 Performance Features

- **Content Limit**: 10,000 characters max (optimized for API efficiency)
- **Request Timeout**: 10-second limit to prevent hanging
- **Error Recovery**: Graceful error handling with user-friendly messages
- **Async Processing**: Non-blocking operations with real-time feedback
- **Responsive Design**: Mobile-first approach with Tailwind CSS

## 🔒 Error Handling

The application handles:
- ❌ Invalid URL formats
- ❌ Network timeouts
- ❌ API failures
- ❌ Empty content
- ❌ Duplicate URLs
- ❌ Invalid input

## 🚀 Future Enhancements

- Database integration (PostgreSQL/MongoDB)
- User authentication and accounts
- Reading time estimates
- Search functionality
- Export reading lists (PDF, Markdown)
- Browser extension
- Mobile app
- Dark mode toggle
- Offline mode with service workers
- Advanced filtering and sorting

## 📝 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🤝 Contributing

Contributions are welcome! Feel free to submit issues and pull requests.

## 📞 Support

For issues, questions, or suggestions, please open an issue on GitHub.

---

**Made with ❤️ using Next.js and AI**

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
