// store/shop/middleware/socketMiddleware.ts
import { Middleware } from '@reduxjs/toolkit';
import { sendReduxAction } from '@/lib/socket';

// Define a type for Redux actions
interface ReduxAction {
  type: string;
  payload?: unknown;
  meta?: unknown;
}

// Middleware to send all actions to the server via socket
const socketMiddleware: Middleware = () => (next) => (action: unknown) => {
  // Type guard to check if action has the expected structure
  const isReduxAction = (act: unknown): act is ReduxAction => 
    typeof act === 'object' && 
    act !== null && 
    'type' in act && 
    typeof (act as ReduxAction).type === 'string';
  
  if (isReduxAction(action)) {
    // Send the action to the server
    sendReduxAction({
      type: action.type,
      payload: action.payload,
      meta: action.meta,
      timestamp: new Date().toISOString(),
    });
  }
  
  // Continue the action in the Redux pipeline
  return next(action);
};

export default socketMiddleware;