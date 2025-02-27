'use client';

import { useViewerSelector } from '@/store/viewer';
import { selectClientState } from '@/store/viewer';
import { useState, useEffect } from 'react';
import { ClientProvider } from '@/store/context/ClientContext';
import ClientShopView from './ClientShopView';

interface ViewportVisualizerProps {
  clientId: string;
}

export default function ViewportVisualizer({ clientId }: ViewportVisualizerProps) {
  const clientState = useViewerSelector((state) => selectClientState(state, clientId));
  const [isLoading, setIsLoading] = useState(true);

  // States to hold tracking data
  const [viewport, setViewport] = useState({ width: 0, height: 0 });
  const [scroll, setScroll] = useState({ x: 0, y: 0 });
  const [cursor, setCursor] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (clientState?.state?.tracking) {
      const { viewport, scroll, cursor } = clientState.state.tracking;
      setViewport(viewport);
      setScroll(scroll);
      setCursor(cursor);
      setIsLoading(false);
    }
  }, [clientState]);

  if (isLoading || !clientState?.state?.tracking) {
    return (
      <div className="bg-gray-100 p-4 rounded-lg">
        <p className="text-center text-gray-600">No viewport data available</p>
      </div>
    );
  }

  // Define scale factor for the visualization (50%)
  const scaleFactor = 0.5;
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
    <div className="bg-gray-100 p-4 rounded-lg">
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

      {/* The document representation */}
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
            width: `${scaledWidth}px`,
            height: `${scaledHeight}px`, 
            transform: `scale(${scaleFactor})`,
            transformOrigin: '0 0',
          }}
        >
          <div 
            className="absolute overflow-hidden"
            style={{
              width: `${viewport.width}px`,
              height: `${viewport.height}px`,
              top: `-${scroll.y}px`,
              left: `-${scroll.x}px`,
            }}
          >
            {/* The actual client shop UI rendered at full size then scaled down */}
            <div className="w-full" style={{ width: `${viewport.width}px` }}>
              <ClientProvider clientId={clientId}>
                <ClientShopView />
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

      {/* Scrollbars visualization */}
      <div className="flex mt-1">
        {/* Horizontal scrollbar */}
        <div 
          className="relative mr-3 h-2 bg-gray-300 rounded-full flex-grow"
          style={{ width: `${scaledWidth}px` }}
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
      
      <div className="mt-4 text-xs text-gray-500">
        <p>Last updated: {new Date(clientState?.timestamp ?? '').toLocaleTimeString()}</p>
      </div>
    </div>
  );
}