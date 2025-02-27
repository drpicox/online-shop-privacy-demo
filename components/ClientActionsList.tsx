'use client';

import { useViewerSelector } from '@/store/viewer';
import { selectActiveClients, selectHasClientState } from '@/store/viewer';
import { ClientInfo } from '@/store/viewer/slices/clientsSlice';
import { useState } from 'react';
import ActionViewer from './ActionViewer';
import ClientStateViewer from './ClientStateViewer';

type ViewMode = 'action' | 'state' | null;

export default function ClientActionsList() {
  const activeClients = useViewerSelector(selectActiveClients);
  const [selectedClient, setSelectedClient] = useState<{ id: string, mode: ViewMode }>({ id: '', mode: null });
  // Get client states from store - get all in a single selector to avoid dependencies
  const allClientStates = useViewerSelector(state => {
    const clients = selectActiveClients(state);
    return clients.reduce((acc, client) => {
      acc[client.id] = selectHasClientState(state, client.id);
      return acc;
    }, {} as Record<string, boolean>);
  });
  
  // Sort clients by name
  const sortedClients = [...activeClients].sort((a, b) => a.name.localeCompare(b.name));
  
  if (activeClients.length === 0) {
    return (
      <div className="p-4 bg-gray-100 rounded-lg">
        <p className="text-center text-gray-500">No active shop clients</p>
      </div>
    );
  }
  
  const handleClientClick = (clientId: string, mode: ViewMode) => {
    if (selectedClient.id === clientId && selectedClient.mode === mode) {
      // Close if the same client and mode is clicked
      setSelectedClient({ id: '', mode: null });
    } else {
      // Otherwise select this client and mode
      setSelectedClient({ id: clientId, mode });
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Active Clients</h2>
      
      <div className="space-y-4">
        {sortedClients.map((client: ClientInfo) => {
          const hasState = allClientStates[client.id];
          const isSelected = selectedClient.id === client.id;
          
          return (
            <div 
              key={client.id} 
              className="bg-gray-100 rounded-lg overflow-hidden"
            >
              <div className="p-3 bg-gray-200 flex justify-between items-center">
                <div>
                  <span className="font-bold">{client.name}</span>
                  <span className="text-xs text-gray-600 ml-2">
                    Connected: {new Date(client.connectedAt).toLocaleTimeString()}
                  </span>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                  
                  <button 
                    className={`text-sm ${isSelected && selectedClient.mode === 'action' ? 'text-blue-800 font-semibold' : 'text-blue-600 hover:underline'}`}
                    onClick={() => handleClientClick(client.id, 'action')}
                  >
                    Last Action
                  </button>
                  
                  <button 
                    className={`text-sm ${isSelected && selectedClient.mode === 'state' ? 'text-blue-800 font-semibold' : 'text-blue-600 hover:underline'}`}
                    onClick={() => handleClientClick(client.id, 'state')}
                  >
                    {hasState ? 'View State' : 'Request State'}
                  </button>
                </div>
              </div>
              
              {isSelected && selectedClient.mode === 'action' && (
                <div className="border-t border-gray-200">
                  <ActionViewer clientId={client.id} showLastActionOnly={true} />
                </div>
              )}
              
              {isSelected && selectedClient.mode === 'state' && (
                <div className="border-t border-gray-200">
                  <ClientStateViewer clientId={client.id} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}