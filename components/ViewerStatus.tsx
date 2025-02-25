'use client';

import { useViewerSelector } from '@/store/viewer';
import { selectIsConnected, selectActiveClientCount } from '@/store/viewer';

export default function ViewerStatus() {
  const isConnected = useViewerSelector(selectIsConnected);
  const activeClientCount = useViewerSelector(selectActiveClientCount);
  
  return (
    <div className="flex items-center space-x-4">
      <div className="flex items-center">
        <div className={`h-3 w-3 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
        <span className="text-sm font-medium">{isConnected ? 'Connected' : 'Disconnected'}</span>
      </div>
      
      <div className="text-sm">
        <span className="font-medium">{activeClientCount}</span> active shop client(s)
      </div>
    </div>
  );
}