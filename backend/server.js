import app from './app.js'; // Importing the Express app
import { Server } from 'socket.io'; // Importing Socket.IO
import http from 'http'; // Node.js HTTP module
import { handleSocketConnection } from './controllers/socketcontroller.js';
// Set the port, defaulting to 5000 if not set in environment variables
const PORT = process.env.PORT || 5000;

// Create an HTTP server using the Express app
const server = http.createServer(app);

// Set up the Socket.IO server
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000', // Frontend (Next.js) origin, adjust this to your frontend URL
    methods: ['GET', 'POST'],         // Allowed HTTP methods for WebSocket communication
    credentials: true,                // Enable credentials (cookies and headers)
  },
});

// Example Socket.IO connection handling
handleSocketConnection(io);

// Start the server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
