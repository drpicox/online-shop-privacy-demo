'use client';

import { useViewerSelector } from '@/store/viewer';
import { selectClientState } from '@/store/viewer';
import React, { useState, useEffect, useMemo } from 'react';
import { ClientProvider } from '@/store/context/ClientContext';
import Router from "@/components/Router";

interface ViewportVisualizerProps {
  clientId: string;
  compact?: boolean;
}

function ViewportVisualizer({ clientId, compact = false }: ViewportVisualizerProps) {
  const clientState = useViewerSelector((state) => selectClientState(state, clientId));
  const [isLoading, setIsLoading] = useState(true);
  const [scaleFactor, setScaleFactor] = useState(compact ? 0.3 : 0.5);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // States to hold tracking data
  const [viewport, setViewport] = useState({ width: 0, height: 0 });
  const [scroll, setScroll] = useState({ x: 0, y: 0 });
  const [cursor, setCursor] = useState({ x: 0, y: 0 });

  // Use memoized selectors to extract only needed data and prevent unnecessary re-renders
  const tracking = useMemo(() => {
    return clientState?.state?.tracking;
  }, [clientState?.state?.tracking]);
  
  useEffect(() => {
    if (tracking) {
      setViewport(tracking.viewport);
      setScroll(tracking.scroll);
      setCursor(tracking.cursor);
      setIsLoading(false);
    }
  }, [tracking]);

  // Calculate scale factor based on container width
  useEffect(() => {
    if (viewport.width === 0) return;
    
    const calculateScale = () => {
      if (!containerRef.current) return;
      
      const containerWidth = containerRef.current.clientWidth;
      // Add padding to account for container padding and border
      const paddingOffset = compact ? 24 : 48; // 12px or 24px padding on each side
      const availableWidth = containerWidth - paddingOffset;
      
      // Calculate scale that would fit the viewport in the available width
      let newScale = availableWidth / viewport.width;
      
      // For compact mode, we need to ensure it doesn't get too big or too small
      if (compact) {
        // In grid view, cap at 0.4 to ensure it stays small enough
        newScale = Math.min(newScale, 0.4); 
        newScale = Math.max(newScale, 0.2); // Don't go smaller than 20%
      } else {
        // In single view, allow more flexibility but still with caps
        newScale = Math.min(newScale, 0.75); // Don't scale larger than 75%
        newScale = Math.max(newScale, 0.3);  // Don't go smaller than 30%
      }
      
      setScaleFactor(newScale);
    };
    
    // Initial calculation
    calculateScale();
    
    // Create a ResizeObserver to watch the container size
    const resizeObserver = new ResizeObserver(() => {
      calculateScale();
    });
    
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    
    // Also listen for window resize as a fallback
    window.addEventListener('resize', calculateScale);
    
    return () => {
      if (containerRef.current) {
        resizeObserver.unobserve(containerRef.current);
      }
      resizeObserver.disconnect();
      window.removeEventListener('resize', calculateScale);
    };
  }, [viewport.width, compact]);

  if (isLoading || !clientState?.state?.tracking) {
    return (
      <div className="bg-gray-100 p-4 rounded-lg">
        <p className="text-center text-gray-600">No viewport data available</p>
      </div>
    );
  }

  const scaledWidth = viewport.width * scaleFactor;
  const scaledHeight = viewport.height * scaleFactor;
  const scaledScrollX = scroll.x * scaleFactor;
  const scaledScrollY = scroll.y * scaleFactor;
  const scaledCursorX = cursor.x * scaleFactor;
  const scaledCursorY = cursor.y * scaleFactor;

  // The cursor is already relative to the viewport (window), not the content
  // So we just need to check if it's within the viewport bounds
  const cursorInView = 
    scaledCursorX >= 0 && 
    scaledCursorX <= scaledWidth &&
    scaledCursorY >= 0 && 
    scaledCursorY <= scaledHeight;

  // No need to adjust for scroll since cursor coordinates are already viewport-relative
  const cursorViewportX = cursorInView ? scaledCursorX : null;
  const cursorViewportY = cursorInView ? scaledCursorY : null;

  // Get the current route from the navigation state
  const currentRoute = clientState?.state?.navigation?.currentRoute || 'home';
  const basePath = clientState?.state?.navigation?.basePath || '/shop';
  const params = clientState?.state?.navigation?.params || {};
  
  // Construct the URL based on the current route
  let url = basePath;
  if (currentRoute === 'product' && params.id) {
    url = `${basePath}/product/${params.id}`;
  } else if (currentRoute === 'cart') {
    url = `${basePath}/cart`;
  } else if (currentRoute === 'likes') {
    url = `${basePath}/likes`;
  } else if (currentRoute === 'checkout') {
    url = `${basePath}/checkout`;
  } else if (currentRoute === 'search') {
    url = `${basePath}/search${params.q ? `?q=${params.q}` : ''}`;
  }
  
  // Add the hostname to make it look like a real URL
  const fullUrl = `https://example.com${url}`;

  return (
    <div ref={containerRef} className={`bg-gray-100 ${compact ? 'p-2' : 'p-4'} rounded-lg`}>
      {!compact && (
        <div className="mb-4">
          <h3 className="font-bold text-lg mb-2">Client Viewport Visualizer</h3>
          
          {/* URL display */}
          <div className="flex items-center mb-3 bg-white rounded border border-gray-300 p-1 pr-2">
            <div className="flex-shrink-0 flex items-center mr-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600 mx-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-grow bg-gray-100 rounded px-2 py-1 text-xs overflow-x-auto">
              {fullUrl}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm mb-2">
            <div>
              <span className="font-medium">Viewport: </span>
              <span className="text-gray-600">{viewport.width}x{viewport.height}px</span>
            </div>
            <div>
              <span className="font-medium">Scroll: </span>
              <span className="text-gray-600">({scroll.x}, {scroll.y})</span>
            </div>
            <div>
              <span className="font-medium">Cursor: </span>
              <span className="text-gray-600">({cursor.x}, {cursor.y})</span>
            </div>
            <div>
              <span className="font-medium">Scale: </span>
              <span className="text-gray-600">{scaleFactor * 100}%</span>
            </div>
          </div>
        </div>
      )}
      
      {compact && (
        <div className="mb-2 text-xs">
          <div className="flex justify-between">
            <span>{viewport.width}x{viewport.height}px</span>
            <span>Scale: {scaleFactor * 100}%</span>
          </div>
        </div>
      )}

      {/* The document representation */}
      <div className="flex justify-center">
        <div 
          className="relative border border-gray-300 bg-white overflow-hidden"
          style={{ 
            width: scaledWidth + 'px', 
            height: scaledHeight + 'px',
          }}
        >
        {/* Actual shop content that's scaled and scrollable */}
        <div
          className="absolute overflow-hidden"
          style={{
            width: `${viewport.width}px`,
            height: `${viewport.height}px`, 
            transform: `scale(${scaleFactor})`,
            transformOrigin: '0 0',
          }}
        >
          <div 
            className="absolute overflow-hidden w-full"
            style={{
              top: `-${scroll.y}px`,
              left: `-${scroll.x}px`,
            }}
          >
            {/* The actual client shop UI rendered at full size then scaled down */}
            <div className="w-full">
              <ClientProvider clientId={clientId}>
                <Router />
              </ClientProvider>
            </div>
          </div>
        </div>

        {/* Cursor visualization (only when in view) */}
        {cursorInView && cursorViewportX !== null && cursorViewportY !== null && (
          <div
            className="absolute w-3 h-3 bg-red-500 rounded-full transform -translate-x-1/2 -translate-y-1/2 shadow-md"
            style={{
              left: `${cursorViewportX}px`,
              top: `${cursorViewportY}px`,
              zIndex: 10,
            }}
          />
        )}

        {/* Viewport frame indicator */}
        <div className="absolute inset-0 pointer-events-none border-2 border-blue-500 z-20" />
      </div>
      </div>

      {/* Scrollbars visualization */}
      <div className="flex justify-center mt-1">
        <div className="flex" style={{ width: `${scaledWidth}px` }}>
          {/* Horizontal scrollbar */}
          <div 
            className="relative mr-3 h-2 bg-gray-300 rounded-full flex-grow"
          >
          <div 
            className="absolute h-full bg-gray-500 rounded-full"
            style={{
              width: `${(scaledWidth / (scaledWidth * 3)) * 100}%`,
              left: `${(scaledScrollX / (scaledWidth * 3)) * 100}%`,
            }}
          />
        </div>
        
        {/* Vertical scrollbar */}
        <div 
          className="relative w-2 bg-gray-300 rounded-full"
          style={{ height: `${scaledHeight}px` }}
        >
          <div 
            className="absolute w-full bg-gray-500 rounded-full"
            style={{
              height: `${(scaledHeight / (scaledHeight * 3)) * 100}%`,
              top: `${(scaledScrollY / (scaledHeight * 3)) * 100}%`,
            }}
          />
        </div>
        </div>
      </div>
      
      {!compact && (
        <div className="mt-4 text-xs text-gray-500">
          <p>Last updated: {new Date(clientState?.timestamp ?? '').toLocaleTimeString()}</p>
        </div>
      )}
      {compact && (
        <div className="mt-1 text-xs text-gray-500 text-right">
          <p>{new Date(clientState?.timestamp ?? '').toLocaleTimeString()}</p>
        </div>
      )}
    </div>
  );
}

// Memoize the component to prevent re-renders when parent changes
export default React.memo(ViewportVisualizer);