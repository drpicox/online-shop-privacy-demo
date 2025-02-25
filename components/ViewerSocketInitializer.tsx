'use client';

import { useEffect } from 'react';
import { initViewerSocket } from '@/lib/viewerSocket';
import { useViewerDispatch } from '@/store/viewer';
import { viewerStore } from '@/store/viewer';

// Component to initialize the socket connection for the viewer
export default function ViewerSocketInitializer() {
  const dispatch = useViewerDispatch();
  
  useEffect(() => {
    // Initialize socket connection when component mounts
    const socket = initViewerSocket(viewerStore);
    
    // Cleanup on unmount
    return () => {
      socket.disconnect();
    };
  }, [dispatch]);
  
  // This component doesn't render anything
  return null;
}