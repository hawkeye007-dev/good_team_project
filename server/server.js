/**
 * Main Express Server File
 * 
 * TODO: Students should implement:
 * 1. Initialize Express app
 * 2. Setup CORS middleware with proper origin configuration
 * 3. Setup JSON body parser middleware
 * 4. Connect to MongoDB/Neon database
 * 5. Connect to Redis queue
 * 6. Import and register routes (tasks, auth)
 * 7. Setup global error handling middleware
 * 8. Start the server on specified port
 * 9. Setup graceful shutdown handlers
 */

// TODO: Uncomment and implement required imports
// import express from 'express';
// import cors from 'cors';
// import dotenv from 'dotenv';
// import mongoose from 'mongoose';
// import { createClient } from 'redis';

// TODO: Load environment variables
// dotenv.config();

// TODO: Initialize Express app
// const app = express();

// TODO: Setup middleware
// 1. CORS - Allow requests from frontend
// app.use(cors({
//   origin: process.env.FRONTEND_URL || 'http://localhost:3000',
//   credentials: true
// }));

// 2. JSON body parser
// app.use(express.json());

// TODO: Connect to database (Neon/PostgreSQL or MongoDB)
// async function connectDatabase() {
//   // Implement database connection
// }

// TODO: Connect to Redis
// async function connectRedis() {
//   // Implement Redis connection for queue
// }

// TODO: Import routes
// import taskRoutes from './routes/tasks.js';
// import authRoutes from './routes/auth.js';

// TODO: Register routes
// app.use('/api/tasks', taskRoutes);
// app.use('/api/auth', authRoutes);

// TODO: Health check endpoint
// app.get('/health', (req, res) => {
//   res.json({ status: 'OK', message: 'Server is running' });
// });

// TODO: Global error handling middleware
// app.use((err, req, res, next) => {
//   console.error(err);
//   res.status(err.status || 500).json({
//     error: err.message || 'Internal Server Error'
//   });
// });

// TODO: Start server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

// TODO: Graceful shutdown
// process.on('SIGTERM', () => {
//   console.log('SIGTERM received, shutting down gracefully');
//   // Close database connections, Redis connections, etc.
//   process.exit(0);
// });

console.log('Server setup incomplete - implement the TODOs above');
