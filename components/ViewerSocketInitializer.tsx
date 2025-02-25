'use client';

import { useEffect, useState } from 'react';
import { initViewerSocket } from '@/lib/viewerSocket';
import { useViewerDispatch } from '@/store/viewer';
import { viewerStore } from '@/store/viewer';

// Component to initialize the socket connection for the viewer
export default function ViewerSocketInitializer() {
  const dispatch = useViewerDispatch();
  const [initialized, setInitialized] = useState(false);
  
  useEffect(() => {
    // Initialize socket connection immediately when component mounts
    console.log('Initializing viewer socket connection');
    const socket = initViewerSocket(viewerStore);
    setInitialized(true);
    
    console.log('Viewer socket connection initialized');
    
    // Cleanup on unmount
    return () => {
      console.log('Viewer socket disconnecting');
      socket.disconnect();
    };
  }, [dispatch]);
  
  // This component doesn't render anything
  return null;
}