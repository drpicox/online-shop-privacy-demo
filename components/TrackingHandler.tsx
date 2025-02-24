'use client';

import { useEffect, useCallback, useMemo } from 'react';
import { useShopDispatch } from '@/store';
import { 
  initializeClientId, 
  updateViewport, 
  updateScroll, 
  updateCursor 
} from '@/store/trackingSlice';
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
  
  // Create throttled versions that we'll use for event listeners
  const throttledScrollHandler = useMemo(
    () => throttle(handleScroll, 200),
    [handleScroll]
  );
  
  const throttledMouseMoveHandler = useMemo(
    () => throttle(handleMouseMove, 200),
    [handleMouseMove]
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
  
  // Track cursor position
  useEffect(() => {
    window.addEventListener('mousemove', throttledMouseMoveHandler);
    
    return () => {
      window.removeEventListener('mousemove', throttledMouseMoveHandler);
    };
  }, [throttledMouseMoveHandler]);
  
  // Component has no UI
  return null;
}