// lib/socket.ts
import { io, Socket } from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';

// Socket singleton instance
let socket: Socket | null = null;

// Generate a unique client ID for each browser session
// Using a random UUID for each browser instance/tab
const clientId = typeof window !== 'undefined' 
  ? sessionStorage.getItem('shop_client_id') || uuidv4() 
  : uuidv4();

// Store client ID in sessionStorage to persist only for this tab/session
if (typeof window !== 'undefined') {
  sessionStorage.setItem('shop_client_id', clientId);
}

// User-friendly identifier with timestamp + random letters
const clientName = `user_${new Date().getTime().toString().slice(-4)}_${clientId.slice(0, 4)}`;

// Initialize socket connection
export const initSocket = (): Socket => {
  // Always create a new connection if no socket exists
  if (!socket) {
    console.log(`Initializing shop socket for client: ${clientName}`);
    
    // Connect to the same URL as the browser with query params for identification
    socket = io({
      query: {
        clientId,
        clientName
      },
      // Ensure connection happens immediately
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000
    });
    
    // Setup connection event handlers
    socket.on('connect', () => {
      console.log(`Socket connected: ${clientName} (${socket?.id})`);
    });
    
    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${clientName}`);
    });
    
    socket.on('connect_error', (error) => {
      console.error(`Socket connection error for ${clientName}:`, error);
    });
    
    // Force immediate connection
    if (!socket.connected) {
      socket.connect();
    }
  }
  
  return socket;
};

// Send Redux action to server
export const sendReduxAction = (action: any): void => {
  if (!socket?.connected) {
    initSocket();
  }
  
  // Include client identification with each action
  socket?.emit('redux_action', {
    ...action,
    client: {
      id: clientId,
      name: clientName,
      socketId: socket?.id
    }
  });
};

// Get the socket instance
export const getSocket = (): Socket | null => socket;

// Get the client ID
export const getClientId = (): string => clientId;

// Get the client name
export const getClientName = (): string => clientName;