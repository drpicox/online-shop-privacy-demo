// store/viewer/slices/clientsSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ViewerRootState } from '@/store/viewer';

// Define the client types
export interface ClientInfo {
  id: string;
  name: string;
  socketId: string;
  connectedAt: string;
  ipAddress?: string;
  lastSeen: string;
  isActive: boolean;
}

export interface ReduxAction {
  type: string;
  payload?: any;
  meta?: any;
  timestamp: string;
  client: {
    id: string;
    name: string;
    socketId?: string;
  };
}

export interface ClientState {
  clientId: string;
  state: any;
  timestamp: string;
}

export interface ClientsState {
  clients: Record<string, ClientInfo>;
  actions: Record<string, ReduxAction[]>;
  lastAction: ReduxAction | null;
  connected: boolean;
  clientStates: Record<string, ClientState>;
  pendingStateRequests: Record<string, string>; // Maps requestId to clientId
  updatedClientStates: Record<string, ClientState>;
}

const initialState: ClientsState = {
  clients: {},
  actions: {},
  lastAction: null,
  connected: false,
  clientStates: {},
  pendingStateRequests: {},
  updatedClientStates: {},
};

export const clientsSlice = createSlice({
  name: 'clients',
  initialState,
  reducers: {
    setConnected: (state, action: PayloadAction<boolean>) => {
      state.connected = action.payload;
    },
    
    requestClientState: (state, action: PayloadAction<{clientId: string, requestId: string}>) => {
      const { clientId, requestId } = action.payload;
      state.pendingStateRequests[requestId] = clientId;
    },
    
    receiveClientState: (state, action: PayloadAction<ClientState>) => {
      const { clientId, state: clientState, timestamp } = action.payload;
      
      // Store the client state
      state.clientStates[clientId] = {
        clientId,
        state: clientState,
        timestamp
      };
      
      // Also store in the updated state as our new baseline
      state.updatedClientStates[clientId] = {
        clientId,
        state: JSON.parse(JSON.stringify(clientState)), // Deep clone to avoid reference issues
        timestamp
      };
      
      // Remove any pending requests for this client
      Object.keys(state.pendingStateRequests).forEach(requestId => {
        if (state.pendingStateRequests[requestId] === clientId) {
          delete state.pendingStateRequests[requestId];
        }
      });
    },
    
    addClient: (state, action: PayloadAction<ClientInfo>) => {
      const client = action.payload;
      
      // Client added
      
      // Store by client.id which should be unique per browser tab
      state.clients[client.id] = {
        ...client,
        lastSeen: new Date().toISOString(),
        isActive: true,
      };
      
      // Initialize actions array for this client if it doesn't exist
      if (!state.actions[client.id]) {
        state.actions[client.id] = [];
      }
    },
    
    removeClient: (state, action: PayloadAction<string>) => {
      const clientId = action.payload;
      if (state.clients[clientId]) {
        state.clients[clientId].isActive = false;
        
        // Also set any older instances of this client to inactive
        Object.keys(state.clients).forEach(id => {
          if (id === clientId || state.clients[id].id === clientId) {
            state.clients[id].isActive = false;
          }
        });
      }
    },
    
    addAction: (state, action: PayloadAction<ReduxAction>) => {
      const reduxAction = action.payload;
      const clientId = reduxAction.client.id;
      
      // Update the client's last seen timestamp
      if (state.clients[clientId]) {
        state.clients[clientId].lastSeen = new Date().toISOString();
        state.clients[clientId].isActive = true;
      } else {
        // If client doesn't exist yet, create a basic entry
        state.clients[clientId] = {
          id: clientId,
          name: reduxAction.client.name,
          socketId: reduxAction.client.socketId || 'unknown',
          connectedAt: new Date().toISOString(),
          lastSeen: new Date().toISOString(),
          isActive: true,
        };
      }
      
      // Initialize actions array if it doesn't exist
      if (!state.actions[clientId]) {
        state.actions[clientId] = [];
      }
      
      // Add action to client's action history (limit to 50 most recent)
      state.actions[clientId] = [
        reduxAction,
        ...state.actions[clientId]
      ].slice(0, 50);
      
      // Update last action
      state.lastAction = reduxAction;
    },
    
    setActiveClients: (state, action: PayloadAction<ClientInfo[]>) => {
      // Reset all clients to inactive first
      Object.keys(state.clients).forEach(id => {
        if (state.clients[id]) {
          state.clients[id].isActive = false;
        }
      });
      
      // Update with active clients
      action.payload.forEach(client => {
        // Create or update client
        state.clients[client.id] = {
          ...client,
          lastSeen: new Date().toISOString(),
          isActive: true,
        };
        
        // Initialize actions array if needed
        if (!state.actions[client.id]) {
          state.actions[client.id] = [];
        }
      });
      
      // Count active clients
      const activeCount = Object.values(state.clients).filter(c => c.isActive).length;
    },
    
    clearHistory: (state) => {
      Object.keys(state.actions).forEach(clientId => {
        state.actions[clientId] = [];
      });
      state.lastAction = null;
    },
    
    // New action to update client state with a Redux action
    // This will be used by the middleware
    updateClientState: (state, action: PayloadAction<{
      clientId: string, 
      reduxAction: ReduxAction,
      updatedState: any
    }>) => {
      const { clientId, reduxAction, updatedState } = action.payload;
      
      // Only apply if we have a state to update
      if (state.updatedClientStates[clientId]) {
        state.updatedClientStates[clientId] = {
          ...state.updatedClientStates[clientId],
          state: updatedState,
          timestamp: new Date().toISOString()
        };
      }
    }
  },
});

// Export actions
export const { 
  setConnected,
  requestClientState,
  receiveClientState,
  addClient, 
  removeClient, 
  addAction, 
  setActiveClients,
  clearHistory,
  updateClientState
} = clientsSlice.actions;

// Selectors
export const selectClientsState = (state: ViewerRootState) => state.clients;
export const selectAllClients = (state: ViewerRootState) => state.clients.clients;
export const selectActiveClients = (state: ViewerRootState) => {
  const clients = state.clients.clients;
  
  // Filter to only active clients
  return Object.values(clients).filter(client => client.isActive);
};
export const selectClientActions = (state: ViewerRootState, clientId: string) => 
  state.clients.actions[clientId] || [];
  
export const selectClientLastAction = (state: ViewerRootState, clientId: string) => {
  const actions = state.clients.actions[clientId] || [];
  return actions.length > 0 ? actions[0] : null;
};
export const selectLastAction = (state: ViewerRootState) => state.clients.lastAction;
export const selectIsConnected = (state: ViewerRootState) => state.clients.connected;
export const selectActiveClientCount = (state: ViewerRootState) => {
  return Object.values(state.clients.clients).filter(client => client.isActive).length;
};

export const selectClientState = (state: ViewerRootState, clientId: string) => {
  // Return the updated state if available, otherwise fall back to the original state
  return state.clients.updatedClientStates[clientId] || state.clients.clientStates[clientId] || null;
};

export const selectHasClientState = (state: ViewerRootState, clientId: string) => {
  return !!state.clients.updatedClientStates[clientId] || !!state.clients.clientStates[clientId];
};

export const selectIsPendingStateRequest = (state: ViewerRootState, clientId: string) => {
  return Object.values(state.clients.pendingStateRequests).includes(clientId);
};

export default clientsSlice.reducer;