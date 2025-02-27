'use client';

import { useViewerSelector } from '@/store/viewer';
import { selectClientActions, selectLastAction, selectClientLastAction } from '@/store/viewer';
import { ReduxAction } from '@/store/viewer/slices/clientsSlice';
import { useEffect, useState } from 'react';

interface ActionViewerProps {
  clientId?: string; 
  showLastActionOnly?: boolean;
}

export default function ActionViewer({ clientId, showLastActionOnly = false }: ActionViewerProps) {
  // Always call hooks unconditionally at the top level
  const lastAction = useViewerSelector(selectLastAction);
  const [actions, setActions] = useState<ReduxAction[]>([]);
  
  // Use selectors with null checks inside the selector function instead of conditional hook calls
  const clientActions = useViewerSelector((state) => 
    clientId ? selectClientActions(state, clientId) : []
  );
  const clientLastAction = useViewerSelector((state) => 
    clientId ? selectClientLastAction(state, clientId) : null
  );
  
  // Use either the selected client's actions or the last action across all clients
  useEffect(() => {
    if (clientId) {
      if (showLastActionOnly && clientLastAction) {
        // Show only the last action for this client
        setActions([clientLastAction]);
      } else {
        // Show all actions for this client
        setActions(clientActions);
      }
    } else if (lastAction) {
      // Show the most recent action across all clients
      setActions([lastAction]);
    } else {
      setActions([]);
    }
  }, [clientId, clientActions, lastAction, clientLastAction, showLastActionOnly]);
  
  if (actions.length === 0) {
    return (
      <div className="p-4 bg-gray-100 rounded-lg">
        <p className="text-center text-gray-500">No actions recorded yet</p>
      </div>
    );
  }
  
  return (
    <div className="bg-gray-100 rounded-lg overflow-hidden">
      <h2 className="bg-gray-200 p-3 font-bold">
        {clientId 
          ? showLastActionOnly 
            ? `Latest Action for ${actions[0]?.client?.name || clientId}` 
            : `Actions for ${actions[0]?.client?.name || clientId}`
          : 'Latest Action'
        }
      </h2>
      <div className="overflow-y-auto max-h-[60vh]">
        {actions.map((action, index) => (
          <div key={index} className="p-4 border-b border-gray-200">
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold text-blue-600">{action.type}</span>
              <span className="text-xs text-gray-500">
                {new Date(action.timestamp).toLocaleTimeString()}
              </span>
            </div>
            
            <div className="flex justify-between text-xs mb-2">
              <span className="bg-gray-200 px-2 py-1 rounded">
                Client: {action.client.name}
              </span>
            </div>
            
            {action.payload && (
              <div className="mt-2">
                <p className="text-xs font-bold text-gray-600">Payload:</p>
                <pre className="bg-gray-800 text-green-400 p-2 rounded text-xs mt-1 overflow-x-auto">
                  {JSON.stringify(action.payload, null, 2)}
                </pre>
              </div>
            )}
            
            {action.meta && (
              <div className="mt-2">
                <p className="text-xs font-bold text-gray-600">Meta:</p>
                <pre className="bg-gray-800 text-green-400 p-2 rounded text-xs mt-1 overflow-x-auto">
                  {JSON.stringify(action.meta, null, 2)}
                </pre>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}