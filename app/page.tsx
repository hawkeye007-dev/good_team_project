"use client";

import { useState, useEffect } from "react";
import { UrlInput } from "@/app/components/UrlInput";
import { ReadingList } from "@/app/components/ReadingListItem";
import { useReadingList } from "@/app/hooks/useReadingList";
import { Badge } from "@/app/components/ui/common";

export default function Home() {
  const { items, isLoading, error, addUrl, removeItem, clearItems } =
    useReadingList();
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [filterTopic, setFilterTopic] = useState<string | null>(null);

  // Extract all unique topics
  const allTopics = Array.from(
    new Set(
      items
        .filter((item) => item.status === "success")
        .flatMap((item) => item.topics)
    )
  );

  // Filter items based on selected topic
  const filteredItems = filterTopic
    ? items.filter((item) =>
        item.topics.some((topic) =>
          topic.toLowerCase().includes(filterTopic.toLowerCase())
        )
      )
    : items;

  const successCount = items.filter((item) => item.status === "success").length;
  const loadingCount = items.filter((item) => item.status === "loading").length;
  const errorCount = items.filter((item) => item.status === "error").length;

  const handleAddUrl = async (url: string) => {
    try {
      await addUrl(url);
      setSuccessMessage("Article added to your reading list!");
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      console.error("Error adding URL:", err);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white shadow-sm sticky top-0 z-10">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between flex-col sm:flex-row gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                📚 Reading List
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Automatically scrape, summarize, and organize articles
              </p>
            </div>
            {items.length > 0 && (
              <button
                onClick={clearItems}
                className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 border border-red-200 rounded-lg transition-colors"
              >
                Clear All
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Stats Cards */}
        {items.length > 0 && (
          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
              <p className="text-sm text-gray-600">Total Articles</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">
                {items.length}
              </p>
            </div>
            <div className="rounded-lg border border-green-200 bg-green-50 p-4 shadow-sm">
              <p className="text-sm text-green-700">Processed</p>
              <p className="mt-2 text-3xl font-bold text-green-900">
                {successCount}
              </p>
            </div>
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 shadow-sm">
              <p className="text-sm text-blue-700">Processing</p>
              <p className="mt-2 text-3xl font-bold text-blue-900">
                {loadingCount}
              </p>
            </div>
          </div>
        )}

        {/* Input Section */}
        <section className="mb-8 rounded-lg border-2 border-gray-200 bg-white p-6 shadow-sm">
          <UrlInput
            onSubmit={handleAddUrl}
            isLoading={isLoading}
            error={error}
            onErrorDismiss={() => {}}
          />
        </section>

        {/* Topic Filter */}
        {allTopics.length > 0 && (
          <section className="mb-8">
            <h2 className="mb-3 text-sm font-semibold text-gray-700">
              Filter by Topic
            </h2>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilterTopic(null)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  filterTopic === null
                    ? "bg-blue-600 text-white"
                    : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                All Topics
              </button>
              {allTopics.map((topic) => (
                <button
                  key={topic}
                  onClick={() => setFilterTopic(topic)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    filterTopic === topic
                      ? "bg-blue-600 text-white"
                      : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {topic}
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Reading List */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">
              {filterTopic ? `Articles: ${filterTopic}` : "Your Articles"}
            </h2>
            {filteredItems.length > 0 && (
              <span className="text-sm text-gray-500">
                {filteredItems.length} article{filteredItems.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>
          <ReadingList
            items={filteredItems}
            onRemove={removeItem}
            isEmpty={items.length === 0}
          />
        </section>
      </div>

      {/* Success Toast */}
      {showSuccess && (
        <div className="fixed bottom-4 right-4 rounded-lg border border-green-200 bg-green-50 p-4 shadow-lg animate-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-center gap-3">
            <svg
              className="h-5 w-5 text-green-600"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-sm font-medium text-green-800">
              {successMessage}
            </p>
          </div>
        </div>
      )}
    </main>
  );
}