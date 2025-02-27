'use client';

import React, { createContext, useContext, ReactNode } from 'react';

// Context to store and provide the current client ID being viewed
type ClientContextType = {
  clientId: string | null;
};

// Create context with a default value of null
const ClientContext = createContext<ClientContextType>({ clientId: null });

// Provider component to wrap parts of the app that need access to the current client
interface ClientProviderProps {
  clientId: string | null;
  children: ReactNode;
}

export function ClientProvider({ clientId, children }: ClientProviderProps) {
  return (
    <ClientContext.Provider value={{ clientId }}>
      {children}
    </ClientContext.Provider>
  );
}

// Hook to access the client context
export function useClientContext(): ClientContextType {
  return useContext(ClientContext);
}