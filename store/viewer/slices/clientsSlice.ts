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

export interface ClientsState {
  clients: Record<string, ClientInfo>;
  actions: Record<string, ReduxAction[]>;
  lastAction: ReduxAction | null;
  connected: boolean;
}

const initialState: ClientsState = {
  clients: {},
  actions: {},
  lastAction: null,
  connected: false,
};

export const clientsSlice = createSlice({
  name: 'clients',
  initialState,
  reducers: {
    setConnected: (state, action: PayloadAction<boolean>) => {
      state.connected = action.payload;
    },
    
    addClient: (state, action: PayloadAction<ClientInfo>) => {
      const client = action.payload;
      
      console.log(`Adding client: ${client.name} (${client.id})`);
      
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
      
      // For debugging, log how many active clients there are now
      const activeCount = Object.values(state.clients).filter(c => c.isActive).length;
      console.log(`Viewer store: ${activeCount} active clients after update`);
    },
    
    clearHistory: (state) => {
      Object.keys(state.actions).forEach(clientId => {
        state.actions[clientId] = [];
      });
      state.lastAction = null;
    }
  },
});

// Export actions
export const { 
  setConnected,
  addClient, 
  removeClient, 
  addAction, 
  setActiveClients,
  clearHistory
} = clientsSlice.actions;

// Selectors
export const selectClientsState = (state: ViewerRootState) => state.clients;
export const selectAllClients = (state: ViewerRootState) => state.clients.clients;
export const selectActiveClients = (state: ViewerRootState) => {
  const clients = state.clients.clients;
  
  // Filter to only active clients
  const activeClients = Object.values(clients).filter(client => client.isActive);
  
  // Log the count for debugging
  console.log(`Selector found ${activeClients.length} active clients`);
  
  return activeClients;
};
export const selectClientActions = (state: ViewerRootState, clientId: string) => 
  state.clients.actions[clientId] || [];
export const selectLastAction = (state: ViewerRootState) => state.clients.lastAction;
export const selectIsConnected = (state: ViewerRootState) => state.clients.connected;
export const selectActiveClientCount = (state: ViewerRootState) => {
  return Object.values(state.clients.clients).filter(client => client.isActive).length;
};

export default clientsSlice.reducer;