'use client';

import { useEffect, useState } from 'react';
import { initSocket, requestCurrentState } from '@/lib/socket';
import { shopStore } from '@/store/shop';

// Component to initialize the socket connection
export default function SocketInitializer() {
  const [initialized, setInitialized] = useState(false);
  
  useEffect(() => {
    // Initialize socket connection with the store's getState function
    const socket = initSocket(shopStore.getState);
    setInitialized(true);
    
    console.log('Shop socket connection initialized with state access');
    
    // Send initial state
    setTimeout(() => {
      requestCurrentState();
    }, 1000);
    
    // Cleanup on unmount
    return () => {
      console.log('Shop socket disconnecting');
      socket.disconnect();
    };
  }, []);
  
  // This component doesn't render anything
  return null;
}