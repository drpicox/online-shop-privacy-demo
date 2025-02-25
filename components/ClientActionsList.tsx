'use client';

import { useViewerSelector } from '@/store/viewer';
import { selectActiveClients, selectClientLastAction } from '@/store/viewer';
import { ClientInfo, ReduxAction } from '@/store/viewer/slices/clientsSlice';
import { useState } from 'react';
import ActionViewer from './ActionViewer';

export default function ClientActionsList() {
  const activeClients = useViewerSelector(selectActiveClients);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  
  // Sort clients by name
  const sortedClients = [...activeClients].sort((a, b) => a.name.localeCompare(b.name));
  
  if (activeClients.length === 0) {
    return (
      <div className="p-4 bg-gray-100 rounded-lg">
        <p className="text-center text-gray-500">No active shop clients</p>
      </div>
    );
  }
  
  const handleClientClick = (clientId: string) => {
    setSelectedClientId(clientId === selectedClientId ? null : clientId);
  };
  
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Active Clients with Last Actions</h2>
      
      <div className="space-y-4">
        {sortedClients.map((client: ClientInfo) => (
          <div 
            key={client.id} 
            className="bg-gray-100 rounded-lg overflow-hidden"
          >
            <div 
              className="p-3 bg-gray-200 cursor-pointer hover:bg-gray-300 transition-colors flex justify-between items-center"
              onClick={() => handleClientClick(client.id)}
            >
              <div>
                <span className="font-bold">{client.name}</span>
                <span className="text-xs text-gray-600 ml-2">
                  Connected: {new Date(client.connectedAt).toLocaleTimeString()}
                </span>
              </div>
              
              <div className="flex items-center">
                <div className="h-3 w-3 bg-green-500 rounded-full mr-2"></div>
                <span 
                  className="text-sm text-blue-600 hover:underline"
                >
                  {selectedClientId === client.id ? 'Hide' : 'Show'} Last Action
                </span>
              </div>
            </div>
            
            {selectedClientId === client.id && (
              <div className="border-t border-gray-200">
                <ActionViewer clientId={client.id} showLastActionOnly={true} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}