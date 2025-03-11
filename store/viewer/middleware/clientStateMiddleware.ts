// store/viewer/middleware/clientStateMiddleware.ts
import { Middleware } from '@reduxjs/toolkit';
import { updateClientState, addAction, ReduxAction } from '../slices/clientsSlice';
import shopReducers from '../reducers/shopReducers';
import { applyActionToState } from '@/lib/utils';

interface ActionWithType {
  type: string;
  payload?: unknown;
}

// Type guard to check if action has the needed properties
const isAddAction = (action: unknown): action is ActionWithType =>
  typeof action === 'object' && 
  action !== null && 
  'type' in action &&
  typeof (action as ActionWithType).type === 'string';

// Middleware to apply client actions to their respective states
const clientStateMiddleware: Middleware = store => next => action => {
  // Process the action normally first
  const result = next(action);
  
  // If this is an addAction action that contains a client action
  if (isAddAction(action) && action.type === addAction.type) {
    const clientAction = action.payload as ReduxAction;
    const clientId = clientAction.client.id;
    const state = store.getState();
    
    // Check if we have a state for this client
    if (state.clients.updatedClientStates[clientId]) {
      try {
        // Get the current client state
        const clientState = state.clients.updatedClientStates[clientId].state;
        
        // Apply the action to the client state using the shop reducers
        const updatedClientState = applyActionToState(
          clientState,
          { 
            type: clientAction.type,
            payload: clientAction.payload,
            meta: clientAction.meta
          },
          // Cast the shopReducers to the expected type
          shopReducers as unknown as (
            state: Record<string, unknown>,
            action: Record<string, unknown>
          ) => Record<string, unknown>
        );
        
        // Dispatch an action to update the client state
        if (updatedClientState) {
          store.dispatch(updateClientState({
            clientId,
            reduxAction: clientAction,
            updatedState: updatedClientState
          }));
        }
      } catch (error) {
        console.error('Error in client state middleware:', error);
      }
    }
  }
  
  return result;
};

export default clientStateMiddleware;