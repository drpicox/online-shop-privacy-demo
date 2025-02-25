// store/shop/middleware/socketMiddleware.ts
import { Middleware } from '@reduxjs/toolkit';
import { sendReduxAction } from '@/lib/socket';

// Middleware to send all actions to the server via socket
const socketMiddleware: Middleware = () => (next) => (action) => {
  // Send the action to the server
  sendReduxAction({
    type: action.type,
    payload: action.payload,
    meta: action.meta,
    timestamp: new Date().toISOString(),
  });
  
  // Continue the action in the Redux pipeline
  return next(action);
};

export default socketMiddleware;