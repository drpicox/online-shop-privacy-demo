'use client';

import { useEffect, useState } from 'react';
import { getClientName } from '@/lib/socket';

// Component to display the client identifier in the UI
export default function ClientIdentifier() {
  const [clientName, setClientName] = useState<string>('');
  
  useEffect(() => {
    // Set client name after mount (client-side only)
    setClientName(getClientName());
  }, []);
  
  if (!clientName) return null;
  
  return (
    <div className="fixed bottom-2 right-2 bg-black/80 text-white px-3 py-1 rounded-md text-xs z-50 opacity-70 hover:opacity-100">
      Client ID: {clientName}
    </div>
  );
}