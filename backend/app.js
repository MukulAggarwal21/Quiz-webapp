import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser'; // Import cookie-parser
import adminRoutes from './routes/adminRoutes.js';
import connectDB from './config/db.js';
import cors from 'cors';

// Load environment variables
dotenv.config();

// Initialize the app
const app = express();

// Connect to database
connectDB();

// Middleware
app.use(express.json()); // For parsing JSON bodies
app.use(cookieParser()); // Middleware to parse cookies
app.use(cors()); // Enable CORS for all origins

// Routess
app.use('/admin', adminRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

export default app;
