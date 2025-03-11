'use client';

import { useViewerSelector } from '@/store/viewer';
import { 
  selectActiveClients
} from '@/store/viewer/slices/clientsSlice';
import ViewportVisualizer from './ViewportVisualizer';
import { useState, useEffect } from 'react';

export default function AllClientsVisualizer() {
  const activeClients = useViewerSelector(selectActiveClients);
  const [clientsInView, setClientsInView] = useState<string[]>([]);
  const [expandedClient, setExpandedClient] = useState<string | null>(null);

  useEffect(() => {
    // Update the list of clients to show when activeClients changes
    setClientsInView(activeClients.map(client => client.id));
  }, [activeClients]);

  if (activeClients.length === 0) {
    return (
      <div className="bg-gray-100 p-6 rounded-lg">
        <p className="text-center text-gray-600">No active clients connected</p>
      </div>
    );
  }

  // Handle expanding a client view
  const handleExpandClient = (clientId: string) => {
    setExpandedClient(expandedClient === clientId ? null : clientId);
  };

  return (
    <div className="bg-gray-100 p-4 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-bold">All Connected Clients</h2>
          <p className="text-sm text-gray-600">
            Showing all {activeClients.length} active client sessions
          </p>
        </div>
        {expandedClient && (
          <button
            onClick={() => setExpandedClient(null)}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
          >
            Show All Clients
          </button>
        )}
      </div>
      
      {expandedClient ? (
        <div className="border border-gray-200 rounded-lg shadow-sm bg-white p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold">
              Client: {expandedClient.substring(0, 8)}...
            </h3>
            <button
              onClick={() => setExpandedClient(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          <div className="max-w-5xl mx-auto">
            <ViewportVisualizer clientId={expandedClient} />
            <div className="mt-4 flex justify-end">
              <button 
                onClick={() => window.dispatchEvent(new CustomEvent('viewerSwitchTab', { detail: { mode: 'clientHistory', clientId: expandedClient } }))}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors text-sm"
              >
                View Client History
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {clientsInView.map((clientId) => {
            const client = activeClients.find(c => c.id === clientId);
            
            return (
              <div 
                key={clientId} 
                className="border border-gray-200 rounded-lg shadow-sm bg-white p-2 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleExpandClient(clientId)}
              >
                <div className="flex justify-between items-center mb-2">
                  <div className="text-sm font-medium truncate">
                    {client?.name || clientId.substring(0, 8)}...
                  </div>
                  <div className="flex items-center">
                    <span className="h-2 w-2 rounded-full bg-green-500 mr-1"></span>
                    <span className="text-xs text-gray-500">
                      {new Date(client?.lastSeen || '').toLocaleTimeString()}
                    </span>
                  </div>
                </div>
                <ViewportVisualizer clientId={clientId} compact={true} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}