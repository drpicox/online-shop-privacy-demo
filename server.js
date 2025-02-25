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
  
  // Track active clients
  const activeClients = new Map();

  // Handle socket connections
  io.on('connection', (socket) => {
    const clientId = socket.handshake.query.clientId || 'unknown';
    const clientName = socket.handshake.query.clientName || `unnamed-${socket.id.slice(0, 6)}`;
    
    // Store client info
    activeClients.set(socket.id, {
      id: clientId,
      name: clientName,
      socketId: socket.id,
      connectedAt: new Date(),
      ipAddress: socket.handshake.address
    });
    
    // Log connection
    console.log(`Client connected: ${clientName} (${socket.id}) from ${socket.handshake.address}`);
    console.log(`Active clients: ${activeClients.size}`);
    
    // Print all active clients
    if (activeClients.size > 1) {
      console.log('Current active clients:');
      Array.from(activeClients.values()).forEach(client => {
        console.log(`- ${client.name} (${client.socketId.slice(0, 6)}...)`);
      });
    }

    // Listen for Redux actions
    socket.on('redux_action', (action) => {
      const clientInfo = action.client || { name: clientName, id: clientId };
      
      // Format the log message
      console.log(`[${new Date().toISOString()}] [${clientInfo.name}] Redux Action: ${action.type}`);
      
      // Log the full action with indentation for readability
      console.log(JSON.stringify(action, null, 2));
      
      // Print a separator for better log readability
      console.log('-'.repeat(50));
    });

    socket.on('disconnect', () => {
      // Get client info before removing
      const client = activeClients.get(socket.id);
      const disconnectName = client ? client.name : clientName;
      
      // Remove from active clients
      activeClients.delete(socket.id);
      
      // Log disconnection
      console.log(`Client disconnected: ${disconnectName} (${socket.id})`);
      console.log(`Remaining active clients: ${activeClients.size}`);
      
      if (activeClients.size > 0) {
        console.log('Current active clients:');
        Array.from(activeClients.values()).forEach(client => {
          console.log(`- ${client.name} (${client.socketId.slice(0, 6)}...)`);
        });
      }
    });
  });

  server.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${PORT}`);
  });
});