'use client';

import { useViewerSelector } from '@/store/viewer';
import { selectClientState } from '@/store/viewer';
import { useState, useEffect } from 'react';

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

  // Calculate if cursor is within the visible viewport area
  const cursorInView = 
    scaledCursorX >= scaledScrollX && 
    scaledCursorX <= scaledScrollX + scaledWidth &&
    scaledCursorY >= scaledScrollY && 
    scaledCursorY <= scaledScrollY + scaledHeight;

  // We need to calculate the position relative to the viewport "window"
  const cursorViewportX = cursorInView ? scaledCursorX - scaledScrollX : null;
  const cursorViewportY = cursorInView ? scaledCursorY - scaledScrollY : null;

  return (
    <div className="bg-gray-100 p-4 rounded-lg">
      <div className="mb-4">
        <h3 className="font-bold text-lg mb-2">Client Viewport Visualizer</h3>
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
        {/* This is the "page" content that scrolls */}
        <div
          className="absolute bg-gradient-to-br from-gray-50 to-gray-100"
          style={{
            width: `${scaledWidth * 3}px`, // Make content area larger than viewport
            height: `${scaledHeight * 3}px`, // to demonstrate scrolling
            top: `-${scaledScrollY}px`,
            left: `-${scaledScrollX}px`,
          }}
        >
          {/* Grid lines to help visualize scrolling */}
          <div className="grid grid-cols-12 h-full">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="border-r border-gray-200"></div>
            ))}
          </div>
          <div className="grid grid-rows-12 h-full w-full absolute top-0 left-0">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="border-b border-gray-200"></div>
            ))}
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