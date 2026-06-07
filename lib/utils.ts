import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a numeric price as a Catalan euro amount, e.g. 79.99 -> "79,99 €".
 */
export function formatPrice(value: number): string {
  return value.toLocaleString("ca-ES", { style: "currency", currency: "EUR" });
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
 * Apply a Redux action to a state object by replaying it through Redux reducers
 * This is a simple utility that forwards the action to the original reducers
 */
export function applyActionToState(
  state: Record<string, unknown>, 
  action: Record<string, unknown>, 
  reducers: (state: Record<string, unknown>, action: Record<string, unknown>) => Record<string, unknown>
): Record<string, unknown> {
  if (!state || !action || !reducers) return state;
  
  try {
    // Make a deep copy of the state to avoid mutation issues
    const stateCopy = JSON.parse(JSON.stringify(state));
    
    // Apply action using the reducers
    return reducers(stateCopy, action);
  } catch (error) {
    console.error('Error applying action to state:', error);
    return state;
  }
}
