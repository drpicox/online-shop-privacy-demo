'use client';

import { useViewerSelector } from '@/store/viewer';
import { selectClientState, selectHasClientState, selectIsPendingStateRequest } from '@/store/viewer';
import { requestShopClientState } from '@/lib/viewerSocket';
import { useState, useCallback, useMemo } from 'react';
import React from 'react';

interface ClientStateViewerProps {
  clientId: string;
}

function ClientStateViewer({ clientId }: ClientStateViewerProps) {
  // Use a single selector to get all needed state to minimize re-renders
  const { 
    clientState, 
    hasState, 
    isPending, 
    clientActions 
  } = useViewerSelector((state) => ({
    clientState: selectClientState(state, clientId),
    hasState: selectHasClientState(state, clientId),
    isPending: selectIsPendingStateRequest(state, clientId),
    clientActions: state.clients.actions[clientId] || []
  }));
  
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  
  // Function to request the state - memoized with useCallback
  const handleRequestState = useCallback(() => {
    requestShopClientState(clientId);
  }, [clientId]);
  
  // Helper to toggle a section - memoized with useCallback
  const toggleSection = useCallback((section: string) => {
    setExpandedSection(prev => prev === section ? null : section);
  }, []);
  
  // Function to format the state - memoized to prevent recreation on every render
  const renderStateObject = useCallback((obj: any, path: string = '') => {
    if (!obj || typeof obj !== 'object') {
      return (
        <pre className="text-xs mt-1 bg-gray-800 text-green-400 p-2 rounded overflow-x-auto">
          {JSON.stringify(obj, null, 2)}
        </pre>
      );
    }
    
    return (
      <div className="pl-4 border-l border-gray-300">
        {Object.keys(obj).map((key) => {
          const value = obj[key];
          const currentPath = path ? `${path}.${key}` : key;
          const isObject = value && typeof value === 'object';
          
          return (
            <div key={currentPath} className="mt-2">
              {isObject ? (
                <div>
                  <button
                    className="flex items-center text-blue-600 hover:text-blue-800 font-medium"
                    onClick={() => toggleSection(currentPath)}
                  >
                    <span className="inline-block w-4 text-center mr-1">
                      {expandedSection === currentPath ? '−' : '+'}
                    </span>
                    <span>{key}</span>
                    <span className="text-gray-500 text-xs ml-2">
                      {Array.isArray(value) ? `Array(${value.length})` : 'Object'}
                    </span>
                  </button>
                  
                  {expandedSection === currentPath && renderStateObject(value, currentPath)}
                </div>
              ) : (
                <div className="flex">
                  <span className="font-medium">{key}:</span>
                  <span className="ml-2 break-all text-gray-700">
                    {typeof value === 'string' ? `"${value}"` : String(value)}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  }, [expandedSection, toggleSection]);

  if (isPending) {
    return (
      <div className="bg-gray-100 p-4 rounded-lg">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-2"></div>
          <p>Requesting state from client...</p>
        </div>
      </div>
    );
  }
  
  if (!hasState) {
    return (
      <div className="bg-gray-100 p-4 rounded-lg">
        <p className="text-center text-gray-600 mb-4">No state available for this client</p>
        <div className="flex justify-center">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
            onClick={handleRequestState}
          >
            Request Current State
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-gray-100 rounded-lg overflow-hidden">
      <div className="bg-gray-200 p-3 flex justify-between items-center">
        <h3 className="font-bold">Redux State</h3>
        <div className="text-xs text-gray-500 flex items-center">
          <span>
            Last updated: {new Date(clientState?.timestamp ?? '').toLocaleTimeString()}
            {clientActions.length > 0 && (
              <span className="ml-2 text-green-600">
                ({clientActions.length} action{clientActions.length !== 1 ? 's' : ''} applied since request)
              </span>
            )}
          </span>
          <button
            className="ml-4 bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700 transition-colors"
            onClick={handleRequestState}
          >
            Refresh
          </button>
        </div>
      </div>
      
      <div className="p-4 overflow-y-auto max-h-[60vh]">
        {renderStateObject(clientState?.state)}
      </div>
    </div>
  );
}

// Export a memoized version of the component to prevent unnecessary re-renders
export default React.memo(ClientStateViewer);