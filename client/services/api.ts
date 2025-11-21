/**
 * API Service Layer
 * 
 * This file contains all HTTP requests to the backend server.
 * Students should implement the actual API calls using axios.
 * 
 * Base URL should be configurable via environment variables.
 * All functions should handle errors gracefully.
 */

import axios from 'axios';

// TODO: Create axios instance with base URL
// const api = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
// });

/**
 * Submit a URL for scraping and summarization
 * 
 * TODO: Implement this function to:
 * 1. Accept a URL as parameter
 * 2. Make POST request to /api/tasks/submit
 * 3. Return task ID and status
 * 4. Handle validation errors
 * 5. Handle network errors
 * 
 * @param url - The URL to submit
 * @returns Task object with id and status
 */
export const submitUrl = async (url: string) => {
  // TODO: Implement submitUrl
  // Example: return api.post('/tasks/submit', { url });
  throw new Error('submitUrl not implemented');
};

/**
 * Fetch all articles/summaries
 * 
 * TODO: Implement this function to:
 * 1. Make GET request to /api/tasks/list
 * 2. Return array of articles with their summaries
 * 3. Include status information (pending, completed, failed)
 * 4. Handle empty response
 * 
 * @returns Array of articles
 */
export const fetchArticles = async () => {
  // TODO: Implement fetchArticles
  // Example: return api.get('/tasks/list');
  throw new Error('fetchArticles not implemented');
};

/**
 * Fetch a specific article by ID
 * 
 * TODO: Implement this function to:
 * 1. Accept article ID as parameter
 * 2. Make GET request to /api/tasks/:id
 * 3. Return full article details and summary
 * 4. Handle 404 errors
 * 
 * @param id - The article ID
 * @returns Article object with full details
 */
export const fetchArticleById = async (id: string) => {
  // TODO: Implement fetchArticleById
  // Example: return api.get(`/tasks/${id}`);
  throw new Error('fetchArticleById not implemented');
};

/**
 * Delete an article
 * 
 * TODO: Implement this function to:
 * 1. Accept article ID as parameter
 * 2. Make DELETE request to /api/tasks/:id
 * 3. Return success confirmation
 * 4. Handle authorization errors
 * 
 * @param id - The article ID to delete
 * @returns Success confirmation
 */
export const deleteArticle = async (id: string) => {
  // TODO: Implement deleteArticle
  // Example: return api.delete(`/tasks/${id}`);
  throw new Error('deleteArticle not implemented');
};

/**
 * Get task status (polling)
 * 
 * TODO: Implement this function to:
 * 1. Accept task ID as parameter
 * 2. Make GET request to /api/tasks/:id/status
 * 3. Return current status and progress
 * 4. Useful for polling to update UI
 * 
 * @param id - The task ID
 * @returns Task status object
 */
export const getTaskStatus = async (id: string) => {
  // TODO: Implement getTaskStatus
  // Example: return api.get(`/tasks/${id}/status`);
  throw new Error('getTaskStatus not implemented');
};
