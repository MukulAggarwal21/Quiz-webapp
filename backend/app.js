import express from 'express'; // Import Express
import dotenv from 'dotenv'; // Import dotenv for environment variables
import cookieParser from 'cookie-parser'; // For parsing cookies
import adminRoutes from './routes/adminRoutes.js'; // Admin routes
import studentRoutes from './routes/studentRoutes.js'; // Student routes
import connectDB from './config/db.js'; // DB connection logic
import cors from 'cors'; // Import CORS

// Load environment variables from .env file
dotenv.config();

// Initialize the Express app
const app = express();

// Connect to MongoDB using the connectDB function
await connectDB();

// Middleware

// Parses incoming JSON payloads
app.use(express.json()); 

// Parses cookies attached to the client request object
app.use(cookieParser()); 

// Define CORS options
const corsOptions = {
  origin: '*',  // Frontend origin (Next.js)
  credentials: true,  // Allow credentials (cookies, auth headers)
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
};

// Enable CORS for the defined options
app.use(cors(corsOptions)); 

// Register routes
app.use('/admin', adminRoutes); // Routes for admin functionality
app.use('/student', studentRoutes); // Routes for student functionality

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack, // Show stack trace in development mode only
  });
});

// Export the Express app
export default app;
