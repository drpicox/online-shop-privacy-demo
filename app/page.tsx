// app/page.tsx

import Link from "next/link";
import { Card } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="container mx-auto p-4 min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-12 text-center">Online Shop Demo</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-3xl">
        <Card className="p-6 hover:shadow-lg transition-shadow duration-300">
          <Link href="/shop" className="block h-full">
            <div className="flex flex-col items-center text-center h-full">
              <h2 className="text-2xl font-semibold mb-4">Shop Demo</h2>
              <p className="text-gray-600 mb-6">
                Experience the online shop as a customer. Browse products, add to cart, and complete checkout.
              </p>
              <div className="mt-auto">
                <button className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                  Launch Shop
                </button>
              </div>
            </div>
          </Link>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow duration-300">
          <Link href="/viewer" className="block h-full">
            <div className="flex flex-col items-center text-center h-full">
              <h2 className="text-2xl font-semibold mb-4">Viewer Demo</h2>
              <p className="text-gray-600 mb-6">
                See how user data is tracked and monitored in real-time as customers interact with the online shop.
              </p>
              <div className="mt-auto">
                <button className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
                  Launch Viewer
                </button>
              </div>
            </div>
          </Link>
        </Card>
      </div>
    </div>
  );
}