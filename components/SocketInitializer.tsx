'use client';

import { useEffect } from 'react';
import { initSocket } from '@/lib/socket';

// Component to initialize the socket connection
export default function SocketInitializer() {
  useEffect(() => {
    // Initialize socket connection when component mounts
    const socket = initSocket();
    
    // Cleanup on unmount
    return () => {
      socket.disconnect();
    };
  }, []);
  
  // This component doesn't render anything
  return null;
}