"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { ReadingItem, ScrapeResponse, SummarizeResponse } from "@/app/types/reading-list";

interface UseReadingListProps {
  onItemAdd?: (item: ReadingItem) => void;
}

export function useReadingList({ onItemAdd }: UseReadingListProps = {}) {
  const [items, setItems] = useState<ReadingItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const processUrl = useCallback(
    async (url: string): Promise<ReadingItem | null> => {
      const id = `item-${Date.now()}`;
      const newItem: ReadingItem = {
        id,
        url,
        title: new URL(url).hostname,
        summary: "",
        topics: [],
        status: "loading",
        addedAt: Date.now(),
      };

      setItems((prev) => [newItem, ...prev]);
      onItemAdd?.(newItem);

      try {
        // Step 1: Scrape content
        const scrapeRes = await fetch("/api/scrape-url", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url }),
          signal: abortControllerRef.current?.signal,
        });

        if (!scrapeRes.ok) {
          const data: ScrapeResponse = await scrapeRes.json();
          throw new Error(data.error || `Scrape failed: ${scrapeRes.status}`);
        }

        const scrapeData: ScrapeResponse = await scrapeRes.json();
        if (!scrapeData.success || !scrapeData.content) {
          throw new Error(scrapeData.error || "Failed to extract content");
        }

        // Step 2: Summarize content
        const summarizeRes = await fetch("/api/summarize", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: scrapeData.content, url }),
          signal: abortControllerRef.current?.signal,
        });

        if (!summarizeRes.ok) {
          const data: SummarizeResponse = await summarizeRes.json();
          throw new Error(data.error || `Summarization failed: ${summarizeRes.status}`);
        }

        const summarizeData: SummarizeResponse = await summarizeRes.json();
        if (!summarizeData.success) {
          throw new Error(summarizeData.error || "Failed to summarize content");
        }

        // Update item with results
        const updatedItem: ReadingItem = {
          ...newItem,
          summary: summarizeData.summary || "",
          topics: summarizeData.topics || [],
          status: "success",
          content: scrapeData.content,
        };

        setItems((prev) =>
          prev.map((item) => (item.id === id ? updatedItem : item))
        );

        return updatedItem;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An error occurred";

        if (errorMessage === "The operation was aborted.") {
          setItems((prev) => prev.filter((item) => item.id !== id));
          return null;
        }

        const errorItem: ReadingItem = {
          ...newItem,
          status: "error",
          error: errorMessage,
        };

        setItems((prev) =>
          prev.map((item) => (item.id === id ? errorItem : item))
        );

        return null;
      }
    },
    []
  );

  const addUrl = useCallback(
    async (url: string) => {
      // Validate URL
      try {
        new URL(url);
      } catch {
        setError("Invalid URL format");
        return;
      }

      // Check for duplicates
      if (items.some((item) => item.url === url)) {
        setError("URL already in reading list");
        return;
      }

      setError(null);
      setIsLoading(true);
      abortControllerRef.current = new AbortController();

      try {
        await processUrl(url);
      } finally {
        setIsLoading(false);
      }
    },
    [items, processUrl]
  );

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const clearItems = useCallback(() => {
    setItems([]);
  }, []);

  const cancelProcessing = useCallback(() => {
    abortControllerRef.current?.abort();
    setIsLoading(false);
  }, []);

  return {
    items,
    isLoading,
    error,
    addUrl,
    removeItem,
    clearItems,
    cancelProcessing,
  };
}
