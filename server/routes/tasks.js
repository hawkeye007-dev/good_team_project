/**
 * Tasks Routes
 * 
 * This file handles all task-related API endpoints:
 * - POST /api/tasks/submit - Submit a new URL for processing
 * - GET /api/tasks/list - Get all tasks/articles
 * - GET /api/tasks/:id - Get a specific task
 * - GET /api/tasks/:id/status - Get task status
 * - DELETE /api/tasks/:id - Delete a task
 * 
 * TODO: Students should implement:
 * 1. Import required dependencies (express, controllers, middleware)
 * 2. Create router instance
 * 3. Implement all route handlers with proper validation
 * 4. Add error handling
 * 5. Queue tasks to Celery/Redis
 * 6. Validate incoming data
 */

// TODO: Uncomment when ready to implement
// import express from 'express';
// import Article from '../models/Article.js';
// import { submitTask, getTaskStatus } from '../controllers/taskController.js';

// const router = express.Router();

/**
 * POST /api/tasks/submit
 * Submit a URL for scraping and summarization
 * 
 * Request body:
 * {
 *   "url": "https://example.com/article"
 * }
 * 
 * TODO: Implement this endpoint to:
 * 1. Validate URL format
 * 2. Check if URL is already in database (prevent duplicates)
 * 3. Create new Article record in database
 * 4. Queue task to Celery worker
 * 5. Return task ID and status
 * 6. Handle errors (invalid URL, duplicate, database error)
 */
// router.post('/submit', async (req, res) => {
//   try {
//     // TODO: Extract and validate URL from request body
//     // TODO: Validate URL format (use URL constructor or similar)
//     // TODO: Check if URL already exists
//     // TODO: Create new Article document
//     // TODO: Queue to Celery worker via Redis
//     // TODO: Return response with task ID
//     res.status(501).json({ message: 'Not implemented yet' });
//   } catch (error) {
//     // TODO: Handle specific error types
//     res.status(500).json({ error: error.message });
//   }
// });

/**
 * GET /api/tasks/list
 * Fetch all articles/tasks for the current user
 * 
 * Query parameters:
 * - status: filter by status (pending, completed, failed)
 * - limit: number of results (default: 20)
 * - offset: pagination offset
 * 
 * TODO: Implement this endpoint to:
 * 1. Query all Article records from database
 * 2. Support pagination
 * 3. Support filtering by status
 * 4. Return sorted by creation date (newest first)
 * 5. Include summary and status for each article
 */
// router.get('/list', async (req, res) => {
//   try {
//     // TODO: Extract query parameters
//     // TODO: Build query filters
//     // TODO: Execute database query with pagination
//     // TODO: Return articles with status and summary
//     res.status(501).json({ message: 'Not implemented yet' });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

/**
 * GET /api/tasks/:id
 * Fetch a specific task/article
 * 
 * TODO: Implement this endpoint to:
 * 1. Validate task ID format
 * 2. Query Article by ID
 * 3. Check if article exists (404 if not)
 * 4. Return full article details including summary
 * 5. Handle authorization (ensure user owns task)
 */
// router.get('/:id', async (req, res) => {
//   try {
//     // TODO: Extract task ID from URL parameter
//     // TODO: Query Article by ID
//     // TODO: Check if exists
//     // TODO: Return article details
//     res.status(501).json({ message: 'Not implemented yet' });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

/**
 * GET /api/tasks/:id/status
 * Check the status of a task (useful for polling)
 * 
 * TODO: Implement this endpoint to:
 * 1. Query Article status from database
 * 2. Return current status (pending, completed, failed)
 * 3. Include progress information if available
 * 4. Handle task not found (404)
 */
// router.get('/:id/status', async (req, res) => {
//   try {
//     // TODO: Get task status from database
//     // TODO: Return status and any progress info
//     res.status(501).json({ message: 'Not implemented yet' });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

/**
 * DELETE /api/tasks/:id
 * Delete a task and its associated article
 * 
 * TODO: Implement this endpoint to:
 * 1. Validate task ID
 * 2. Check if task exists
 * 3. Delete Article from database
 * 4. Cancel any pending Celery tasks
 * 5. Return success confirmation
 * 6. Handle authorization
 */
// router.delete('/:id', async (req, res) => {
//   try {
//     // TODO: Extract task ID
//     // TODO: Query and delete Article
//     // TODO: Cancel associated Celery task if still pending
//     // TODO: Return success response
//     res.status(501).json({ message: 'Not implemented yet' });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// export default router;

console.log('Tasks routes - implement the TODO endpoints above');
