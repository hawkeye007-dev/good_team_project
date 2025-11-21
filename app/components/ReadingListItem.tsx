"use client";

import React from "react";
import { ReadingItem } from "@/app/types/reading-list";
import { LoadingSpinner, Badge } from "@/app/components/ui/common";

interface ReadingListItemProps {
  item: ReadingItem;
  onRemove: (id: string) => void;
}

export function ReadingListItem({ item, onRemove }: ReadingListItemProps) {
  const getStatusColor = (status: ReadingItem["status"]) => {
    switch (status) {
      case "loading":
        return "bg-blue-50 border-blue-200";
      case "success":
        return "bg-white border-green-200";
      case "error":
        return "bg-red-50 border-red-200";
      default:
        return "bg-white border-gray-200";
    }
  };

  const getDomain = (url: string) => {
    try {
      return new URL(url).hostname.replace("www.", "");
    } catch {
      return url;
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div
      className={`rounded-lg border-2 p-5 transition-all duration-300 hover:shadow-md ${getStatusColor(
        item.status
      )}`}
    >
      {/* Header */}
      <div className="mb-3 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div className="flex-1 min-w-0">
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group block"
          >
            <h3 className="truncate text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
              {getDomain(item.url)}
            </h3>
          </a>
          <p className="mt-1 truncate text-sm text-gray-500">
            {item.url}
          </p>
          <p className="mt-1 text-xs text-gray-400">
            Added {formatDate(item.addedAt)}
          </p>
        </div>
        <button
          onClick={() => onRemove(item.id)}
          className="flex-shrink-0 rounded-lg bg-red-100 p-2.5 text-red-600 hover:bg-red-200 transition-colors"
          aria-label="Remove item"
        >
          <svg
            className="h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {/* Content based on status */}
      {item.status === "loading" && (
        <div className="py-6 flex justify-center">
          <LoadingSpinner size="md" message="Processing URL..." />
        </div>
      )}

      {item.status === "error" && (
        <div className="rounded-lg bg-red-100 p-4 border border-red-300">
          <p className="text-sm font-medium text-red-800">Processing Failed</p>
          <p className="mt-1 text-sm text-red-700">{item.error}</p>
        </div>
      )}

      {item.status === "success" && (
        <div className="space-y-4">
          {/* Summary */}
          {item.summary && (
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2">
                Summary
              </h4>
              <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
                {item.summary}
              </p>
            </div>
          )}

          {/* Topics */}
          {item.topics && item.topics.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2">
                Topics
              </h4>
              <div className="flex flex-wrap gap-2">
                {item.topics.map((topic) => (
                  <Badge key={topic} variant="primary" size="sm">
                    {topic}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-2 flex-wrap">
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100 transition-colors border border-blue-200"
            >
              <svg
                className="h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.343a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM15.657 14.657a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM10 18a1 1 0 011-1h1a1 1 0 110 2h-1a1 1 0 01-1-1zM5.343 15.657a1 1 0 00-1.414 1.414l.707.707a1 1 0 001.414-1.414l-.707-.707zM5 10a1 1 0 01-1-1V8a1 1 0 012 0v1a1 1 0 01-1 1zM5.343 5.343a1 1 0 00-1.414-1.414L3.222 4.636a1 1 0 001.414 1.414l.707-.707z" />
              </svg>
              Read Full Article
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

interface ReadingListProps {
  items: ReadingItem[];
  onRemove: (id: string) => void;
  isEmpty?: boolean;
}

export function ReadingList({ items, onRemove, isEmpty }: ReadingListProps) {
  if (isEmpty && items.length === 0) {
    return (
      <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 6.253v13m0-13C6.5 6.253 2 10.998 2 17s4.5 10.747 10 10.747c5.5 0 10-4.998 10-10.747S17.5 6.253 12 6.253z"
          />
        </svg>
        <h3 className="mt-4 text-lg font-semibold text-gray-900">
          No articles yet
        </h3>
        <p className="mt-2 text-sm text-gray-500">
          Add a URL above to get started with your reading list
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.length === 0 ? (
        <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
          <p className="text-gray-500">No articles added yet</p>
        </div>
      ) : (
        items.map((item) => (
          <ReadingListItem
            key={item.id}
            item={item}
            onRemove={onRemove}
          />
        ))
      )}
    </div>
  );
}
