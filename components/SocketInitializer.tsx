'use client';

import { useEffect, useState } from 'react';
import { initSocket } from '@/lib/socket';

// Component to initialize the socket connection
export default function SocketInitializer() {
  const [initialized, setInitialized] = useState(false);
  
  useEffect(() => {
    // Initialize socket connection immediately when component mounts
    const socket = initSocket();
    setInitialized(true);
    
    console.log('Shop socket connection initialized');
    
    // Cleanup on unmount
    return () => {
      console.log('Shop socket disconnecting');
      socket.disconnect();
    };
  }, []);
  
  // This component doesn't render anything
  return null;
}