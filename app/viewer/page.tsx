'use client';

import Link from "next/link";
import { useState } from "react";
import ViewerSocketInitializer from "@/components/ViewerSocketInitializer";
import ViewerStatus from "@/components/ViewerStatus";
import ClientsList from "@/components/ClientsList";
import ActionViewer from "@/components/ActionViewer";

export default function ViewerPage() {
  const [selectedClientId, setSelectedClientId] = useState<string | undefined>(undefined);
  
  return (
    <div className="min-h-screen flex flex-col p-6">
      {/* Initialize socket connection */}
      <ViewerSocketInitializer />
      
      {/* Header */}
      <header className="mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Shop Tracker</h1>
          <ViewerStatus />
        </div>
        <p className="mt-2 text-gray-600">
          This viewer demonstrates how user actions in e-commerce platforms can be tracked and monitored.
        </p>
      </header>
      
      {/* Main content */}
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
              Show All Activity
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
      
      {/* Footer */}
      <footer className="mt-8 text-center text-gray-500 text-sm">
        <p>
          Privacy awareness demo: All user actions in the shop are being tracked and monitored in real-time.
        </p>
      </footer>
    </div>
  );
}