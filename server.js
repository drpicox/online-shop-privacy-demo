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
  
  // Two ways to track clients:
  // 1. By socket ID (for socket-specific operations)
  const activeClients = new Map();
  // 2. By client ID (for unique client identification)
  const clientsById = new Map();
  // Track all viewer connections
  const viewerClients = new Set();
  
  // Debug function to print client info
  const debugClients = () => {
    console.log("\n----------- CLIENT DEBUG INFO -----------");
    console.log(`Socket connections: ${activeClients.size}`);
    console.log(`Unique clients: ${clientsById.size}`);
    console.log("Client IDs:");
    
    for (const [id, client] of clientsById.entries()) {
      console.log(`- ID: ${id}, Name: ${client.name}, Socket: ${client.socketId}`);
    }
    console.log("----------------------------------------\n");
  };

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
    
    // Store client info by socket ID for quick lookups
    activeClients.set(socket.id, clientInfo);
    
    // Store client by client ID (keeping a unique record for each client ID)
    clientsById.set(clientId, clientInfo);
    
    // Log connection
    console.log(`Shop client connected: ${clientName} (${socket.id}) from ${socket.handshake.address}`);
    console.log(`Active shop clients: ${clientsById.size}`);
    
    // Print debug info
    debugClients();
    
    // Notify viewers about the new client
    viewerIO.emit('client_connected', clientInfo);
    
    // Broadcast the full list of clients to all viewers to ensure they're in sync
    const allClients = Array.from(clientsById.values());
    console.log(`Sending ${allClients.length} active clients to viewers`);
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
      
      console.log(`Shop client disconnecting: ${disconnectName} (ID: ${disconnectId})`);
      
      // Remove from socket-indexed map
      activeClients.delete(socket.id);
      
      // Always remove the clientID record since we're using sessionStorage 
      // for client IDs (each browser tab gets a unique ID)
      clientsById.delete(disconnectId);
      
      // Notify viewers about the disconnected client
      viewerIO.emit('client_disconnected', disconnectId);
      
      // Log disconnection
      console.log(`Shop client disconnected: ${disconnectName} (${socket.id})`);
      console.log(`Remaining active shop clients: ${clientsById.size}`);
      
      // Debug client state after disconnection
      debugClients();
      
      // Send updated client list to all viewers
      const allClients = Array.from(clientsById.values());
      console.log(`Sending updated list of ${allClients.length} clients to viewers`);
      viewerIO.emit('active_clients', allClients);
    });
  });
  
  // Handle viewer client connections
  viewerIO.on('connection', (socket) => {
    console.log(`Viewer connected: ${socket.id}`);
    viewerClients.add(socket.id);
    console.log(`Active viewers: ${viewerClients.size}`);
    
    // Send active clients immediately on connection (don't wait for request)
    const clientsList = Array.from(clientsById.values());
    console.log(`Sending ${clientsList.length} clients to newly connected viewer`);
    debugClients();
    socket.emit('active_clients', clientsList);
    
    // Also handle explicit requests for clients list
    socket.on('get_active_clients', () => {
      const updatedClientsList = Array.from(clientsById.values());
      console.log(`Viewer explicitly requested active clients - sending ${updatedClientsList.length} clients`);
      debugClients();
      socket.emit('active_clients', updatedClientsList);
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