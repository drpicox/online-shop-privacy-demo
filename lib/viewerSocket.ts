// lib/viewerSocket.ts
import { io, Socket } from 'socket.io-client';
import { addAction, addClient, removeClient, setConnected, setActiveClients } from '@/store/viewer';
import { Store } from '@reduxjs/toolkit';
import { ViewerRootState } from '@/store/viewer';

// Socket singleton instance
let socket: Socket | null = null;
let store: Store | null = null;

// Initialize socket connection for the viewer
export const initViewerSocket = (reduxStore: Store<ViewerRootState>): Socket => {
  store = reduxStore;
  
  if (!socket) {
    console.log('Creating new viewer socket connection');
    
    // Connect to the viewer namespace with connection options
    socket = io('/viewer', {
      // Ensure connection happens immediately
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000
    });
    
    // Setup connection event handlers
    socket.on('connect', () => {
      console.log('Viewer socket connected:', socket?.id);
      store?.dispatch(setConnected(true));
      
      // Request initial active clients list
      console.log('Requesting active clients list from server');
      socket.emit('get_active_clients');
    });
    
    socket.on('disconnect', () => {
      console.log('Viewer socket disconnected');
      store?.dispatch(setConnected(false));
    });
    
    socket.on('connect_error', (error) => {
      console.error('Viewer socket connection error:', error);
      store?.dispatch(setConnected(false));
    });
    
    // Handle incoming events from server
    socket.on('active_clients', (clients) => {
      console.log(`Received ${clients.length} active clients from server`);
      store?.dispatch(setActiveClients(clients));
    });
    
    socket.on('client_connected', (client) => {
      console.log(`Client connected: ${client.name}`);
      store?.dispatch(addClient(client));
    });
    
    socket.on('client_disconnected', (clientId) => {
      console.log(`Client disconnected: ${clientId}`);
      store?.dispatch(removeClient(clientId));
    });
    
    socket.on('redux_action', (action) => {
      // Only log certain actions to avoid console spam
      if (action.type.includes('tracking')) {
        console.log(`Received action: ${action.type} from ${action.client.name}`);
      }
      store?.dispatch(addAction(action));
    });
    
    // Force immediate connection
    if (!socket.connected) {
      console.log('Forcing viewer socket connection');
      socket.connect();
    }
  }
  
  return socket;
};

// Get the socket instance
export const getViewerSocket = (): Socket | null => socket;