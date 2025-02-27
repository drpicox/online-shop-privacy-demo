'use client';

import { useClientContext } from '@/store/context/ClientContext';
import { useShopSelector } from '@/store';
import { selectNavigation } from '@/store/shop/slices/navigationSlice';
import { selectTracking } from '@/store/shop/slices/trackingSlice';
import ProductGrid from './ProductGrid';
import SearchBar from './SearchBar';
import CategoryFilter from './CategoryFilter';

export default function ClientShopView() {
  const { clientId } = useClientContext();
  
  // These selectors will now use the client state if a clientId is present in the context
  const navigation = useShopSelector(selectNavigation);
  const tracking = useShopSelector(selectTracking);
  
  // If no client is selected, show a message
  if (!clientId) {
    return (
      <div className="bg-gray-100 p-4 rounded-lg">
        <p className="text-center text-gray-600">No client selected</p>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="bg-blue-500 text-white p-3">
        <h2 className="text-lg font-bold">Shop View for Client: {clientId}</h2>
        <p className="text-sm opacity-80">
          Current Route: {navigation.currentRoute}
          {navigation.params && Object.keys(navigation.params).length > 0 && 
            ` (${JSON.stringify(navigation.params)})`}
        </p>
      </div>
      
      <div className="p-4">
        {/* Search bar */}
        <div className="mb-4">
          <SearchBar />
        </div>
        
        {/* Category filter */}
        <div className="mb-4">
          <CategoryFilter />
        </div>
        
        {/* Main content area */}
        <div className="min-h-[200px]">
          {navigation.currentRoute === 'home' && (
            <ProductGrid />
          )}
          
          {navigation.currentRoute === 'product' && (
            <div className="p-4 border rounded-lg">
              <h3 className="font-bold mb-2">
                Product ID: {navigation.params.id}
              </h3>
              <p className="text-gray-600">
                Product details would be shown here
              </p>
            </div>
          )}
          
          {navigation.currentRoute === 'cart' && (
            <div className="p-4 border rounded-lg">
              <h3 className="font-bold mb-2">Shopping Cart</h3>
              <p className="text-gray-600">
                Cart items would be shown here
              </p>
            </div>
          )}
          
          {navigation.currentRoute === 'search' && (
            <>
              <h3 className="font-bold mb-2">
                Search Results for: {navigation.params.q || 'All Products'}
              </h3>
              <ProductGrid />
            </>
          )}
        </div>
        
        {/* Tracking info */}
        <div className="mt-4 border-t pt-3 text-xs text-gray-500">
          <p>Viewport: {tracking.viewport.width}x{tracking.viewport.height}</p>
          <p>Cursor: ({tracking.cursor.x}, {tracking.cursor.y})</p>
          <p>Scroll: ({tracking.scroll.x}, {tracking.scroll.y})</p>
          <p>Last updated: {new Date(tracking.lastUpdated).toLocaleTimeString()}</p>
        </div>
      </div>
    </div>
  );
}