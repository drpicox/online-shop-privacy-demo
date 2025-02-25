// lib/socket.ts
import { io, Socket } from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';

// Socket singleton instance
let socket: Socket | null = null;

// We need to avoid hydration errors with different client IDs between server and client
// So we'll create a function to lazily initialize the client ID only on the client side
let clientId = '';
let clientName = '';

// Function to get or initialize the client ID
function getOrInitClientId(): string {
  // Only execute this on the client side
  if (typeof window === 'undefined') {
    return '';  // Return empty on server side to avoid hydration errors
  }
  
  // If we already have a client ID, return it
  if (clientId) {
    return clientId;
  }
  
  // Otherwise initialize it
  clientId = sessionStorage.getItem('shop_client_id') || uuidv4();
  sessionStorage.setItem('shop_client_id', clientId);
  return clientId;
}

// Function to get or initialize the client name
function getOrInitClientName(): string {
  // Only execute this on the client side
  if (typeof window === 'undefined') {
    return '';  // Return empty on server side to avoid hydration errors
  }
  
  // If we already have a client name, return it
  if (clientName) {
    return clientName;
  }
  
  // Generate a name using current timestamp, but only on client side
  const id = getOrInitClientId();
  clientName = `user_${new Date().getTime().toString().slice(-4)}_${id.slice(0, 4)}`;
  return clientName;
}

// This will be set when we initialize with the store
let getState: (() => any) | null = null;

// Initialize socket connection
export const initSocket = (storeGetState?: () => any): Socket => {
  // Only initialize on client side
  if (typeof window === 'undefined') {
    // Return a dummy socket object for SSR
    return {} as Socket;
  }
  
  // Get the client ID and name
  const id = getOrInitClientId();
  const name = getOrInitClientName();
  
  // Store the getState function if provided
  if (storeGetState) {
    getState = storeGetState;
  }
  
  // Always create a new connection if no socket exists
  if (!socket) {
    console.log(`Initializing shop socket for client: ${name}`);
    
    // Connect to the same URL as the browser with query params for identification
    socket = io({
      query: {
        clientId: id,
        clientName: name
      },
      // Ensure connection happens immediately
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000
    });
    
    // Setup connection event handlers
    socket.on('connect', () => {
      console.log(`Socket connected: ${name} (${socket?.id})`);
    });
    
    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${name}`);
    });
    
    socket.on('connect_error', (error) => {
      console.error(`Socket connection error for ${name}:`, error);
    });
    
    // Handle state request from viewer
    socket.on('request_state', (requestId) => {
      console.log(`Received state request with ID: ${requestId}`);
      
      if (getState) {
        // Get the current Redux state
        const state = getState();
        
        // Send the state back to the server
        socket.emit('shop_state', {
          requestId,
          clientId,
          clientName,
          state,
          timestamp: new Date().toISOString()
        });
        
        console.log('Sent state to viewer');
      } else {
        console.error('Cannot provide state: getState function not available');
      }
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
  // Only run on client side
  if (typeof window === 'undefined') {
    return;
  }
  
  // Get current client ID and name
  const id = getOrInitClientId();
  const name = getOrInitClientName();
  
  if (!socket || !socket.connected) {
    // Re-initialize the socket immediately if it's not connected
    console.log('Socket not connected, attempting to reconnect before sending action');
    const newSocket = initSocket();
    
    // Wait briefly for connection to establish before sending
    setTimeout(() => {
      if (newSocket.connected) {
        console.log('Connection established, sending delayed action');
        newSocket.emit('redux_action', {
          ...action,
          client: {
            id: id,
            name: name,
            socketId: newSocket.id
          }
        });
      }
    }, 500);
  } else {
    // Include client identification with each action
    socket.emit('redux_action', {
      ...action,
      client: {
        id: id,
        name: name,
        socketId: socket.id
      }
    });
  }
};

// Get the socket instance
export const getSocket = (): Socket | null => socket;

// Get the client ID
export const getClientId = (): string => getOrInitClientId();

// Get the client name
export const getClientName = (): string => getOrInitClientName();

// Function to request the current state
export const requestCurrentState = (): void => {
  // Only run on client side
  if (typeof window === 'undefined') {
    return;
  }
  
  // Get current client ID and name
  const id = getOrInitClientId();
  const name = getOrInitClientName();
  
  if (socket && socket.connected) {
    const state = getState ? getState() : null;
    socket.emit('shop_state', {
      clientId: id,
      clientName: name,
      state,
      timestamp: new Date().toISOString()
    });
  }
};