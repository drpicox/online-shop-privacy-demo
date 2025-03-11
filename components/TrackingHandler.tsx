'use client';

import { useEffect, useCallback, useMemo } from 'react';
import { useShopDispatch } from '@/store';
import { 
  initializeClientId, 
  updateViewport, 
  updateScroll, 
  updateCursor 
} from '@/store/shop/slices/trackingSlice';
import { throttle } from '@/lib/utils';

export default function TrackingHandler() {
  const dispatch = useShopDispatch();
  
  // Initialize client ID on mount
  useEffect(() => {
    dispatch(initializeClientId());
  }, [dispatch]);
  
  // Track viewport size
  useEffect(() => {
    const handleResize = () => {
      dispatch(updateViewport({
        width: window.innerWidth,
        height: window.innerHeight
      }));
    };
    
    // Set initial viewport size
    handleResize();
    
    // Add resize listener
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [dispatch]);
  
  // Create handlers that use throttling internally
  const handleScroll = useCallback(() => {
    dispatch(updateScroll({
      x: window.scrollX,
      y: window.scrollY
    }));
  }, [dispatch]);
  
  const handleMouseMove = useCallback((e: MouseEvent) => {
    dispatch(updateCursor({
      x: e.clientX,
      y: e.clientY
    }));
  }, [dispatch]);

  // Touch handler for cursor tracking
  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (e.touches.length > 0) {
      const touch = e.touches[0]; // Get the first touch point
      dispatch(updateCursor({
        x: touch.clientX,
        y: touch.clientY
      }));
    }
  }, [dispatch]);
  
  // Create throttled versions that we'll use for event listeners
  // Reduced frequency for cursor updates to minimize re-renders (300ms instead of 200ms)
  const throttledScrollHandler = useMemo(
    () => throttle<typeof handleScroll>(handleScroll, 300),
    [handleScroll]
  );
  
  // Need to use type assertion since handleMouseMove is specifically for MouseEvent
  // Use higher throttle for mouse movements since they happen very frequently
  const throttledMouseMoveHandler = useMemo(
    () => throttle(handleMouseMove as (...args: unknown[]) => unknown, 300),
    [handleMouseMove]
  );

  // Throttled touch handler (same as mouse move)
  const throttledTouchMoveHandler = useMemo(
    () => throttle(handleTouchMove as (...args: unknown[]) => unknown, 300),
    [handleTouchMove]
  );
  
  // Track scroll position
  useEffect(() => {
    // Set initial scroll position
    throttledScrollHandler();
    
    // Add scroll listener
    window.addEventListener('scroll', throttledScrollHandler);
    
    return () => {
      window.removeEventListener('scroll', throttledScrollHandler);
    };
  }, [throttledScrollHandler]);
  
  // Track cursor position with mouse
  useEffect(() => {
    window.addEventListener('mousemove', throttledMouseMoveHandler);
    
    return () => {
      window.removeEventListener('mousemove', throttledMouseMoveHandler);
    };
  }, [throttledMouseMoveHandler]);
  
  // Track cursor position with touch
  useEffect(() => {
    window.addEventListener('touchmove', throttledTouchMoveHandler);
    window.addEventListener('touchstart', throttledTouchMoveHandler);
    
    return () => {
      window.removeEventListener('touchmove', throttledTouchMoveHandler);
      window.removeEventListener('touchstart', throttledTouchMoveHandler);
    };
  }, [throttledTouchMoveHandler]);
  
  // Component has no UI
  return null;
}