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
    // Connect to the same URL as the browser (default)
    socket = io('/viewer');
    
    // Setup connection event handlers
    socket.on('connect', () => {
      console.log('Viewer socket connected:', socket?.id);
      store?.dispatch(setConnected(true));
      
      // Request initial active clients list
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
      store?.dispatch(setActiveClients(clients));
    });
    
    socket.on('client_connected', (client) => {
      store?.dispatch(addClient(client));
    });
    
    socket.on('client_disconnected', (clientId) => {
      store?.dispatch(removeClient(clientId));
    });
    
    socket.on('redux_action', (action) => {
      store?.dispatch(addAction(action));
    });
  }
  
  return socket;
};

// Get the socket instance
export const getViewerSocket = (): Socket | null => socket;