import { ReactNode } from "react";

export interface ReadingItem {
  id: string;
  url: string;
  title: string;
  summary: string;
  topics: string[];
  status: "loading" | "success" | "error";
  error?: string;
  content?: string;
  addedAt: number;
}

export interface ScrapeRequest {
  url: string;
}

export interface ScrapeResponse {
  success: boolean;
  content?: string;
  error?: string;
}

export interface SummarizeRequest {
  content: string;
  url: string;
}

export interface SummarizeResponse {
  success: boolean;
  summary?: string;
  topics?: string[];
  error?: string;
}

export interface LoadingState {
  isScraperLoading: boolean;
  scraperProgress: string;
}
