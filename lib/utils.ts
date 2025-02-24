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
