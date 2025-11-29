import { useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function Home() {
  const [urls, setUrls] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");
  const [useAsync, setUseAsync] = useState(false);
  const [taskId, setTaskId] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResults(null);
    setTaskId(null);

    const urlList = urls
      .split("\n")
      .map((u) => u.trim())
      .filter((u) => u.length > 0);

    if (urlList.length === 0) {
      setError("Please enter at least one URL");
      return;
    }

    setLoading(true);

    try {
      if (useAsync) {
        // Queue task
        const res = await fetch(`${API_URL}/scrape/async`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ urls: urlList }),
        });
        const data = await res.json();
        if (data.task_id) {
          setTaskId(data.task_id);
          pollTask(data.task_id);
        } else {
          setError("Failed to queue task");
          setLoading(false);
        }
      } else {
        // Sync request
        const res = await fetch(`${API_URL}/scrape`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ urls: urlList }),
        });
        const data = await res.json();
        setResults(data.results);
        setLoading(false);
      }
    } catch (err) {
      setError("Failed to connect to backend: " + err.message);
      setLoading(false);
    }
  };

  const pollTask = async (id) => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`${API_URL}/task/${id}`);
        const data = await res.json();
        if (data.status === "success") {
          clearInterval(interval);
          setResults(data.result?.results || []);
          setLoading(false);
        } else if (data.status === "failed") {
          clearInterval(interval);
          setError("Task failed: " + (data.error || "unknown error"));
          setLoading(false);
        }
      } catch (err) {
        clearInterval(interval);
        setError("Failed to check task status");
        setLoading(false);
      }
    }, 2000);
  };

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 20, fontFamily: "system-ui, sans-serif" }}>
      <h1 style={{ marginBottom: 10 }}>🔍 Universal Web Scraper</h1>
      <p style={{ color: "#666", marginBottom: 20 }}>
        Enter URLs (one per line) to get summaries, images, prices, and suggestions.
      </p>

      <form onSubmit={handleSubmit}>
        <textarea
          value={urls}
          onChange={(e) => setUrls(e.target.value)}
          placeholder="https://en.wikipedia.org/wiki/Python_(programming_language)&#10;https://www.amazon.com/dp/B0XXXXXXXXX"
          style={{
            width: "100%",
            height: 120,
            padding: 12,
            fontSize: 14,
            border: "1px solid #ccc",
            borderRadius: 6,
            marginBottom: 12,
            resize: "vertical",
          }}
        />
        <div style={{ marginBottom: 12 }}>
          <label style={{ cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={useAsync}
              onChange={(e) => setUseAsync(e.target.checked)}
              style={{ marginRight: 8 }}
            />
            Use background processing (Celery + Redis)
          </label>
        </div>
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "12px 24px",
            fontSize: 16,
            backgroundColor: loading ? "#999" : "#0070f3",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Processing..." : "Scrape URLs"}
        </button>
      </form>

      {taskId && loading && (
        <p style={{ marginTop: 20, color: "#666" }}>
          ⏳ Task queued: <code>{taskId}</code> — polling for results...
        </p>
      )}

      {error && (
        <div style={{ marginTop: 20, padding: 12, backgroundColor: "#fee", borderRadius: 6, color: "#c00" }}>
          {error}
        </div>
      )}

      {results && results.length > 0 && (
        <div style={{ marginTop: 30 }}>
          <h2>Results</h2>
          {results.map((r, idx) => (
            <div
              key={idx}
              style={{
                border: "1px solid #ddd",
                borderRadius: 8,
                padding: 16,
                marginBottom: 20,
                backgroundColor: "#fafafa",
              }}
            >
              {r.error ? (
                <p style={{ color: "#c00" }}>
                  ❌ <strong>{r.url}</strong>: {r.error}
                </p>
              ) : (
                <>
                  <h3 style={{ margin: "0 0 8px 0" }}>{r.title || "No title"}</h3>
                  <p style={{ color: "#666", fontSize: 13, marginBottom: 8 }}>
                    <a href={r.url} target="_blank" rel="noopener noreferrer">
                      {r.url}
                    </a>
                  </p>

                  {r.price && (
                    <p style={{ fontSize: 18, fontWeight: "bold", color: "#080" }}>
                      💰 Price: {r.price}
                    </p>
                  )}

                  {r.description && (
                    <p style={{ marginBottom: 12 }}>
                      <strong>Description:</strong> {r.description}
                    </p>
                  )}

                  <div style={{ marginBottom: 12 }}>
                    <strong>Summary:</strong>
                    <p style={{ whiteSpace: "pre-wrap", backgroundColor: "#fff", padding: 10, borderRadius: 4 }}>
                      {r.summary}
                    </p>
                  </div>

                  {r.suggestions && r.suggestions.length > 0 && (
                    <div style={{ marginBottom: 12 }}>
                      <strong>Suggestions:</strong>
                      <ul style={{ margin: "8px 0", paddingLeft: 20 }}>
                        {r.suggestions.map((s, i) => (
                          <li key={i}>{s}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {r.images && r.images.length > 0 && (
                    <div>
                      <strong>Images:</strong>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 8 }}>
                        {r.images.slice(0, 5).map((img, i) => (
                          <img
                            key={i}
                            src={img}
                            alt={`Image ${i + 1}`}
                            style={{
                              width: 120,
                              height: 80,
                              objectFit: "cover",
                              borderRadius: 4,
                              border: "1px solid #ddd",
                            }}
                            onError={(e) => (e.target.style.display = "none")}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
