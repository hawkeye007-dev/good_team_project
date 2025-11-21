/**
 * Authentication Routes
 * 
 * This file handles authentication-related endpoints:
 * - POST /api/auth/register - Register a new user
 * - POST /api/auth/login - Login user
 * - POST /api/auth/logout - Logout user
 * - GET /api/auth/profile - Get current user profile
 * 
 * TODO: Students should implement:
 * 1. User registration with password hashing
 * 2. User login with JWT token generation
 * 3. User authentication middleware
 * 4. Logout functionality
 * 5. Profile endpoint
 */

// TODO: Uncomment when ready to implement
// import express from 'express';
// import User from '../models/User.js';

// const router = express.Router();

/**
 * POST /api/auth/register
 * Register a new user
 * 
 * Request body:
 * {
 *   "email": "user@example.com",
 *   "password": "password123",
 *   "name": "User Name"
 * }
 * 
 * TODO: Implement this endpoint to:
 * 1. Validate email format
 * 2. Check if email already exists
 * 3. Hash password using bcrypt
 * 4. Create new User document
 * 5. Generate JWT token
 * 6. Return token and user info
 */
// router.post('/register', async (req, res) => {
//   try {
//     // TODO: Validate input
//     // TODO: Check if user exists
//     // TODO: Hash password
//     // TODO: Create user
//     // TODO: Generate JWT token
//     // TODO: Return token and user data
//     res.status(501).json({ message: 'Not implemented yet' });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

/**
 * POST /api/auth/login
 * Login user and return JWT token
 * 
 * Request body:
 * {
 *   "email": "user@example.com",
 *   "password": "password123"
 * }
 * 
 * TODO: Implement this endpoint to:
 * 1. Validate email and password provided
 * 2. Query user from database
 * 3. Compare password with hash
 * 4. Generate JWT token if valid
 * 5. Return token and user info
 * 6. Handle invalid credentials
 */
// router.post('/login', async (req, res) => {
//   try {
//     // TODO: Extract email and password
//     // TODO: Query user by email
//     // TODO: Validate password
//     // TODO: Generate JWT token
//     // TODO: Return token and user data
//     res.status(501).json({ message: 'Not implemented yet' });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

/**
 * GET /api/auth/profile
 * Get current authenticated user's profile
 * 
 * Header required:
 * Authorization: Bearer <jwt_token>
 * 
 * TODO: Implement this endpoint to:
 * 1. Verify JWT token from Authorization header
 * 2. Extract user ID from token
 * 3. Query user from database
 * 4. Return user profile
 * 5. Handle invalid/expired tokens
 */
// router.get('/profile', (req, res) => {
//   try {
//     // TODO: Extract and verify JWT token
//     // TODO: Get user from token
//     // TODO: Query user details
//     // TODO: Return user profile
//     res.status(501).json({ message: 'Not implemented yet' });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

/**
 * POST /api/auth/logout
 * Logout user (invalidate token)
 * 
 * TODO: Implement this endpoint to:
 * 1. Verify JWT token
 * 2. Optionally: Add token to blacklist (if using token blacklist strategy)
 * 3. Return success confirmation
 */
// router.post('/logout', (req, res) => {
//   try {
//     // TODO: Verify token
//     // TODO: Optionally blacklist token
//     // TODO: Return success
//     res.status(501).json({ message: 'Not implemented yet' });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// export default router;

console.log('Auth routes - implement the TODO endpoints above');
