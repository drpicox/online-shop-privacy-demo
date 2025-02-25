'use client';

import { useViewerSelector } from '@/store/viewer';
import { selectActiveClients } from '@/store/viewer';
import { ClientInfo } from '@/store/viewer/slices/clientsSlice';

interface ClientsListProps {
  onSelectClient: (clientId: string) => void;
  selectedClientId?: string;
}

export default function ClientsList({ onSelectClient, selectedClientId }: ClientsListProps) {
  const activeClients = useViewerSelector(selectActiveClients);
  
  if (activeClients.length === 0) {
    return (
      <div className="p-4 bg-gray-100 rounded-lg">
        <p className="text-center text-gray-500">No active shop clients</p>
      </div>
    );
  }
  
  // Sort clients by name
  const sortedClients = [...activeClients].sort((a, b) => a.name.localeCompare(b.name));
  
  return (
    <div className="bg-gray-100 rounded-lg overflow-hidden">
      <h2 className="bg-gray-200 p-3 font-bold">Active Shop Clients ({activeClients.length})</h2>
      <ul className="divide-y divide-gray-200">
        {sortedClients.map((client: ClientInfo) => (
          <li 
            key={client.id}
            className={`p-3 cursor-pointer hover:bg-gray-200 transition-colors flex justify-between items-center ${
              selectedClientId === client.id ? 'bg-blue-100' : ''
            }`}
            onClick={() => onSelectClient(client.id)}
          >
            <div>
              <p className="font-medium">{client.name}</p>
              <p className="text-xs text-gray-500">
                Connected: {new Date(client.connectedAt).toLocaleTimeString()}
              </p>
            </div>
            <div className="h-3 w-3 bg-green-500 rounded-full"></div>
          </li>
        ))}
      </ul>
    </div>
  );
}