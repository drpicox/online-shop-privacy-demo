// lib/socket.ts
import { io, Socket } from 'socket.io-client';

// Socket singleton instance
let socket: Socket | null = null;

// Initialize socket connection
export const initSocket = (): Socket => {
  if (!socket) {
    // Connect to the same URL as the browser (default)
    socket = io();
    
    // Setup connection event handlers
    socket.on('connect', () => {
      console.log('Socket connected:', socket?.id);
    });
    
    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });
    
    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });
  }
  
  return socket;
};

// Send Redux action to server
export const sendReduxAction = (action: any): void => {
  if (!socket?.connected) {
    initSocket();
  }
  
  socket?.emit('redux_action', action);
};

// Get the socket instance
export const getSocket = (): Socket | null => socket;