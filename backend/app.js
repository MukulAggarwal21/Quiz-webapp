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
const corsOptions = {
  origin: 'http://localhost:3000',  // Allow requests from your React app
  credentials: true,  // Allow credentials (cookies, authentication headers)
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
};

app.use(cors(corsOptions)); // Enable CORS with the defined options // Enable CORS for all origins

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
