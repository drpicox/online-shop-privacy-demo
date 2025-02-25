'use client';

import Link from "next/link";
import { useState, useEffect } from "react";
import ViewerSocketInitializer from "@/components/ViewerSocketInitializer";
import ViewerStatus from "@/components/ViewerStatus";
import ClientsList from "@/components/ClientsList";
import ActionViewer from "@/components/ActionViewer";
import ClientActionsList from "@/components/ClientActionsList";
import { initViewerSocket } from "@/lib/viewerSocket";
import { viewerStore } from "@/store/viewer";

export default function ViewerPage() {
  const [selectedClientId, setSelectedClientId] = useState<string | undefined>(undefined);
  
  // Initialize socket connection in the page component as well
  useEffect(() => {
    console.log("Viewer page mounted - ensuring socket connection");
    
    // Initialize viewer socket directly
    const socket = initViewerSocket(viewerStore);
    
    return () => {
      // We don't disconnect on unmount to maintain the connection
    };
  }, []);
  
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
      </header>
      
      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <ul className="flex -mb-px">
            <li className="mr-1">
              <button 
                onClick={() => setSelectedClientId(undefined)}
                className={`inline-block py-2 px-4 text-sm font-medium ${!selectedClientId ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
              >
                Last Actions
              </button>
            </li>
            <li className="mr-1">
              <button 
                onClick={() => selectedClientId ? null : setSelectedClientId("")}
                className={`inline-block py-2 px-4 text-sm font-medium ${selectedClientId !== undefined ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
              >
                Client History
              </button>
            </li>
          </ul>
        </div>
      </div>
      
      {/* Main content */}
      {selectedClientId !== undefined ? (
        <div className="flex flex-1 gap-6">
          {/* Left sidebar - Client list */}
          <div className="w-1/3">
            <ClientsList 
              onSelectClient={setSelectedClientId} 
              selectedClientId={selectedClientId} 
            />
            
            <div className="mt-4 flex justify-between">
              <button 
                onClick={() => setSelectedClientId(undefined)}
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
            <ActionViewer clientId={selectedClientId} />
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