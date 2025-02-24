'use client';

import Link from "next/link";

export default function ViewerPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-6">Viewer Demo</h1>
      <p className="text-xl mb-8 text-center max-w-2xl">
        This is where the tracking visualization will be implemented. 
        It will show how user data is collected and monitored as customers interact with the shop.
      </p>
      <Link href="/" className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
        Back to Home
      </Link>
    </div>
  );
}