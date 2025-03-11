'use client';

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { QRCodeSVG } from 'qrcode.react';
import ViewerSocketInitializer from "@/components/ViewerSocketInitializer";
import ViewerStatus from "@/components/ViewerStatus";
import ClientsList from "@/components/ClientsList";
import ActionViewer from "@/components/ActionViewer";
import ClientActionsList from "@/components/ClientActionsList";
import AllClientsVisualizer from "@/components/AllClientsVisualizer";
import { initViewerSocket } from "@/lib/viewerSocket";
import { viewerStore } from "@/store/viewer";

type ViewMode = 'lastActions' | 'clientHistory' | 'allClients';

export default function ViewerPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('lastActions');
  const [selectedClientId, setSelectedClientId] = useState<string | undefined>(undefined);
  const [baseUrl, setBaseUrl] = useState<string>('http://localhost:3000');
  
  // Use ngrok URL if available
  useEffect(() => {
    import('@/lib/ngrokUrl').then(module => {
      if (module.NGROK_URL) {
        setBaseUrl(module.NGROK_URL);
        console.log('Using ngrok URL for QR code:', module.NGROK_URL);
      }
    }).catch(err => {
      // If there's an error importing (file not found or invalid), ignore it
      console.log('No ngrok URL configured, using default');
    });
  }, []);
  
  // Handle tab switching
  const handleTabChange = React.useCallback((mode: ViewMode) => {
    setViewMode(mode);
    if (mode === 'clientHistory' && !selectedClientId) {
      setSelectedClientId("");
    } else if (mode !== 'clientHistory') {
      setSelectedClientId(undefined);
    }
  }, [selectedClientId]);
  
  // Initialize socket connection in the page component as well
  useEffect(() => {
    console.log("Viewer page mounted - ensuring socket connection");
    
    // Initialize viewer socket directly
    initViewerSocket(viewerStore);
    
    // Listen for tab switch events from components
    const handleTabSwitch = (event: CustomEvent) => {
      const { mode, clientId } = event.detail;
      handleTabChange(mode as ViewMode);
      if (clientId) {
        setSelectedClientId(clientId);
      }
    };
    
    window.addEventListener('viewerSwitchTab', handleTabSwitch as EventListener);
    
    return () => {
      // We don't disconnect on unmount to maintain the connection
      window.removeEventListener('viewerSwitchTab', handleTabSwitch as EventListener);
    };
  }, [handleTabChange]);
  
  return (
    <div className="min-h-screen flex flex-col p-6">
      {/* Initialize socket connection (kept for backward compatibility) */}
      <ViewerSocketInitializer />
      
      {/* Header */}
      <header className="mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Shop Viewer</h1>
          <ViewerStatus />
        </div>
        <p className="mt-2 text-gray-600">
          This viewer demonstrates how user actions in e-commerce platforms can be tracked and monitored.
        </p>
        <div className="mt-4 flex items-center space-x-4">
          <div className="flex-1">
            <div className="flex items-center">
              <label htmlFor="baseUrl" className="mr-2 whitespace-nowrap">Shop URL:</label>
              <input
                id="baseUrl"
                type="text"
                value={baseUrl}
                onChange={(e) => setBaseUrl(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter base URL"
              />
            </div>
            <p className="mt-1 text-sm text-gray-500">QR Code points to: {baseUrl}/shop</p>
          </div>
          <div className="bg-white p-2 rounded-lg border border-gray-300">
            <QRCodeSVG value={`${baseUrl}/shop`} size={100} />
          </div>
        </div>
      </header>
      
      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <ul className="flex -mb-px">
            <li className="mr-1">
              <button 
                onClick={() => handleTabChange('lastActions')}
                className={`inline-block py-2 px-4 text-sm font-medium ${viewMode === 'lastActions' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
              >
                Last Actions
              </button>
            </li>
            <li className="mr-1">
              <button 
                onClick={() => handleTabChange('clientHistory')}
                className={`inline-block py-2 px-4 text-sm font-medium ${viewMode === 'clientHistory' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
              >
                Client History
              </button>
            </li>
            <li className="mr-1">
              <button 
                onClick={() => handleTabChange('allClients')}
                className={`inline-block py-2 px-4 text-sm font-medium ${viewMode === 'allClients' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
              >
                All Clients
              </button>
            </li>
          </ul>
        </div>
      </div>
      
      {/* Main content */}
      {viewMode === 'clientHistory' ? (
        <div className="flex flex-1 gap-6">
          {/* Left sidebar - Client list */}
          <div className="w-1/3">
            <ClientsList 
              onSelectClient={setSelectedClientId} 
              selectedClientId={selectedClientId || ""} 
            />
            
            <div className="mt-4 flex justify-between">
              <button 
                onClick={() => handleTabChange('lastActions')}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
              >
                Show Last Actions
              </button>
              
              <Link 
                href="/" 
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Back to Home
              </Link>
            </div>
          </div>
          
          {/* Right side - Action details */}
          <div className="w-2/3">
            <ActionViewer clientId={selectedClientId || ""} />
          </div>
        </div>
      ) : viewMode === 'allClients' ? (
        <div>
          <AllClientsVisualizer />
          
          <div className="mt-6 flex justify-end">
            <Link 
              href="/" 
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      ) : (
        <div>
          <ClientActionsList />
          
          <div className="mt-6 flex justify-end">
            <Link 
              href="/" 
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      )}
      
      {/* Footer */}
      <footer className="mt-8 text-center text-gray-500 text-sm">
        <p>
          Privacy awareness demo: All user actions in the shop are being tracked and monitored in real-time.
        </p>
      </footer>
    </div>
  );
}