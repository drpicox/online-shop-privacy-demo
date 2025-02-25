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

  // Initialize Socket.IO server with CORS support
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });
  
  // Create namespaces
  const shopIO = io.of('/'); // Default namespace
  const viewerIO = io.of('/viewer');
  
  // Track active clients by socket ID
  const activeClients = new Map();
  // Track clients by client ID (this helps handle reconnections with the same client ID)
  const clientsById = new Map();
  const viewerClients = new Set();

  // Handle shop client connections
  shopIO.on('connection', (socket) => {
    const clientId = socket.handshake.query.clientId || 'unknown';
    const clientName = socket.handshake.query.clientName || `unnamed-${socket.id.slice(0, 6)}`;
    
    // Create client info object
    const clientInfo = {
      id: clientId, // Using clientId as unique identifier instead of socket.id
      name: clientName,
      socketId: socket.id,
      connectedAt: new Date().toISOString(),
      ipAddress: socket.handshake.address,
      isActive: true
    };
    
    // Store client info by socket ID
    activeClients.set(socket.id, clientInfo);
    
    // Store/update client by client ID - this makes reconnections work properly
    clientsById.set(clientId, clientInfo);
    
    // Log connection
    console.log(`Shop client connected: ${clientName} (${socket.id}) from ${socket.handshake.address}`);
    console.log(`Active shop clients: ${clientsById.size}`);
    
    // Print all active clients
    if (clientsById.size > 1) {
      console.log('Current active shop clients:');
      Array.from(clientsById.values()).forEach(client => {
        console.log(`- ${client.name} (${client.socketId.slice(0, 6)}...)`);
      });
    }
    
    // Notify viewers about the new client
    viewerIO.emit('client_connected', clientInfo);
    
    // Broadcast the full list of clients to all viewers to ensure they're in sync
    const allClients = Array.from(clientsById.values());
    viewerIO.emit('active_clients', allClients);

    // Listen for Redux actions
    socket.on('redux_action', (action) => {
      const clientInfo = action.client || { name: clientName, id: clientId };
      
      // Format the log message
      console.log(`[${new Date().toISOString()}] [${clientInfo.name}] Redux Action: ${action.type}`);
      
      // Log the full action with indentation for readability
      console.log(JSON.stringify(action, null, 2));
      
      // Print a separator for better log readability
      console.log('-'.repeat(50));
      
      // Broadcast the action to all viewers
      viewerIO.emit('redux_action', action);
    });

    socket.on('disconnect', () => {
      // Get client info before removing
      const client = activeClients.get(socket.id);
      
      if (!client) return; // If client not found, just return
      
      const disconnectName = client.name;
      const disconnectId = client.id;
      
      // Remove from socket-indexed map
      activeClients.delete(socket.id);
      
      // Check if this client ID has other active connections
      let hasOtherConnections = false;
      
      // Check if there are other sockets with the same client ID still connected
      for (const [socketId, clientData] of activeClients.entries()) {
        if (clientData.id === disconnectId) {
          hasOtherConnections = true;
          break;
        }
      }
      
      // Only remove from clientsById if there are no other connections with this ID
      if (!hasOtherConnections) {
        clientsById.delete(disconnectId);
        
        // Notify viewers about the disconnected client
        viewerIO.emit('client_disconnected', disconnectId);
      }
      
      // Log disconnection
      console.log(`Shop client disconnected: ${disconnectName} (${socket.id})`);
      console.log(`Remaining active shop clients: ${clientsById.size}`);
      
      if (clientsById.size > 0) {
        console.log('Current active shop clients:');
        Array.from(clientsById.values()).forEach(client => {
          console.log(`- ${client.name} (${client.socketId.slice(0, 6)}...)`);
        });
      }
      
      // Send updated client list to all viewers
      const allClients = Array.from(clientsById.values());
      viewerIO.emit('active_clients', allClients);
    });
  });
  
  // Handle viewer client connections
  viewerIO.on('connection', (socket) => {
    console.log(`Viewer connected: ${socket.id}`);
    viewerClients.add(socket.id);
    console.log(`Active viewers: ${viewerClients.size}`);
    
    // Send current active clients list when requested
    socket.on('get_active_clients', () => {
      const clientsList = Array.from(clientsById.values());
      socket.emit('active_clients', clientsList);
    });
    
    socket.on('disconnect', () => {
      console.log(`Viewer disconnected: ${socket.id}`);
      viewerClients.delete(socket.id);
      console.log(`Remaining viewers: ${viewerClients.size}`);
    });
  });

  server.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${PORT}`);
  });
});