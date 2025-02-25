// server.js
const http = require('http');
const { Server } = require('socket.io');
const next = require('next');
const PORT = process.env.PORT || 3000;

// Detect if we are in development mode
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  // Create HTTP server
  const server = http.createServer((req, res) => {
    return handle(req, res);
  });

  // Initialize Socket.IO server
  const io = new Server(server);

  // Handle socket connections
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // Listen for Redux actions
    socket.on('redux_action', (action) => {
      console.log('Redux Action:', action);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  server.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${PORT}`);
  });
});