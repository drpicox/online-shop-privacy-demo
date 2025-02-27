import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Creates a throttled function that only invokes the provided function at most once per
 * specified wait period.
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => ReturnType<T> | undefined {
  let timeout: ReturnType<typeof setTimeout> | undefined = undefined;
  let lastTime = 0;
  
  return function(...args: Parameters<T>): ReturnType<T> | undefined {
    const now = Date.now();
    const remaining = wait - (now - lastTime);
    
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = undefined;
      }
      lastTime = now;
      return func(...args) as ReturnType<T>;
    }
    
    if (!timeout) {
      timeout = setTimeout(() => {
        lastTime = Date.now();
        timeout = undefined;
        func(...args);
      }, remaining);
    }
    
    return undefined;
  };
}

/**
 * Apply a Redux action to a state object (simplified version)
 * This function takes a client state and a Redux action and returns an updated state
 */
export function applyActionToState(state: any, action: any): any {
  if (!state || !action) return state;
  
  try {
    // Make a deep copy of the state to avoid mutation issues
    const newState = JSON.parse(JSON.stringify(state));
    
    // Extract the action type and target path from the action type
    // Example: "products/setFilter" would target state.products
    const [domain, actionType] = action.type.split('/');
    
    if (!domain || !actionType) return state;
    
    // Handle specific cases based on common Redux patterns
    if (domain === 'tracking') {
      // Handle tracking actions
      if (!newState.tracking) newState.tracking = {};
      
      if (actionType === 'setViewport' && action.payload) {
        newState.tracking.viewport = action.payload;
      } else if (actionType === 'setScroll' && action.payload) {
        newState.tracking.scroll = action.payload;
      } else if (actionType === 'setMousePosition' && action.payload) {
        newState.tracking.mousePosition = action.payload;
      } else if (actionType === 'addEvent' && action.payload) {
        if (!newState.tracking.events) newState.tracking.events = [];
        newState.tracking.events.push(action.payload);
      }
    } else if (domain === 'cart') {
      // Handle cart actions
      if (!newState.cart) newState.cart = { items: [] };
      
      if (actionType === 'addItem' && action.payload) {
        newState.cart.items.push(action.payload);
      } else if (actionType === 'removeItem' && action.payload) {
        const itemId = action.payload.id;
        newState.cart.items = newState.cart.items.filter((item: any) => item.id !== itemId);
      } else if (actionType === 'updateQuantity' && action.payload) {
        const { id, quantity } = action.payload;
        const item = newState.cart.items.find((item: any) => item.id === id);
        if (item) item.quantity = quantity;
      } else if (actionType === 'clearCart') {
        newState.cart.items = [];
      }
    } else if (domain === 'filters') {
      // Handle filter actions
      if (!newState.filters) newState.filters = {};
      
      if (actionType === 'setCategory' && action.payload) {
        newState.filters.category = action.payload;
      } else if (actionType === 'setSearch' && action.payload) {
        newState.filters.search = action.payload;
      } else if (actionType === 'clearFilters') {
        newState.filters = {};
      }
    } else if (domain === 'user') {
      // Handle user actions
      if (!newState.user) newState.user = {};
      
      if (actionType === 'setUserInfo' && action.payload) {
        newState.user = { ...newState.user, ...action.payload };
      } else if (actionType === 'clearUser') {
        newState.user = {};
      }
    }
    
    return newState;
  } catch (error) {
    console.error('Error applying action to state:', error);
    return state;
  }
}
