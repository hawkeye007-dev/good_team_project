"use client";

import React, { useState } from "react";
import { LoadingSpinner, ErrorAlert } from "./ui/common";

interface UrlInputProps {
  onSubmit: (url: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  onErrorDismiss?: () => void;
}

export function UrlInput({
  onSubmit,
  isLoading,
  error,
  onErrorDismiss,
}: UrlInputProps) {
  const [url, setUrl] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmedUrl = url.trim();
    if (!trimmedUrl) {
      setLocalError("Please enter a URL");
      return;
    }

    // Basic URL validation
    if (!trimmedUrl.startsWith("http://") && !trimmedUrl.startsWith("https://")) {
      setLocalError("URL must start with http:// or https://");
      return;
    }

    setLocalError(null);
    try {
      await onSubmit(trimmedUrl);
      setUrl(""); // Clear input on success
    } catch (err) {
      // Error handling is done by the parent component
    }
  };

  const displayError = localError || error;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* URL Input Field */}
      <div>
        <label htmlFor="url-input" className="block text-sm font-medium text-gray-700 mb-2">
          Add Article URL
        </label>
        <div className="relative flex gap-2">
          <input
            id="url-input"
            type="text"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              setLocalError(null);
            }}
            placeholder="https://example.com/article"
            disabled={isLoading}
            className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:bg-gray-100 disabled:text-gray-500 transition-colors"
          />
          <button
            type="submit"
            disabled={isLoading || !url.trim()}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span className="hidden sm:inline">Processing...</span>
              </>
            ) : (
              <>
                <svg
                  className="h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 8.414V17a1 1 0 11-2 0V8.414L7.707 10.707a1 1 0 01-1.414-1.414l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="hidden sm:inline">Add</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Error Message */}
      {displayError && (
        <ErrorAlert
          message={displayError}
          onDismiss={() => {
            setLocalError(null);
            onErrorDismiss?.();
          }}
        />
      )}

      {/* Help Text */}
      <p className="text-xs text-gray-500">
        Enter the full URL of any article. We'll automatically extract the content, summarize it, and categorize it by topic.
      </p>
    </form>
  );
}
