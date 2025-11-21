/**
 * SummaryList Component
 * 
 * TODO: Students should implement:
 * 1. Accept articles array as prop
 * 2. Display list of articles with their summaries
 * 3. Show loading states for pending articles
 * 4. Implement delete/remove functionality
 * 5. Add filtering or search capabilities
 * 6. Handle empty state (no articles)
 * 7. Format dates nicely
 * 8. Add status badges (pending, completed, failed)
 */

interface Article {
  id: string;
  url: string;
  title?: string;
  summary?: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: string;
}

interface SummaryListProps {
  articles?: Article[];
  onDelete?: (id: string) => void;
}

export default function SummaryList({ articles = [], onDelete }: SummaryListProps) {
  return (
    <div>
      <h2>Your Reading List</h2>
      
      {/* TODO: Handle empty state */}
      {articles.length === 0 && (
        <p>No articles yet. Add a URL to get started!</p>
      )}
      
      {/* TODO: Implement article list rendering */}
      {/* TODO: Show article title, summary, and status */}
      {/* TODO: Add delete button for each article */}
      {/* TODO: Show loading spinner for pending articles */}
      {/* TODO: Display error state for failed articles */}
      
      <div>
        {articles.map((article) => (
          <div key={article.id}>
            {/* TODO: Render article details here */}
            {/* TODO: Display status badge */}
            {/* TODO: Add delete button */}
            {/* TODO: Show summary when available */}
          </div>
        ))}
      </div>
    </div>
  )
}
