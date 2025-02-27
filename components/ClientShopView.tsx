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
    <div className="bg-white rounded-lg overflow-hidden">
      <div className="bg-blue-600 text-white p-2">
        <p className="text-sm">
          <span className="font-semibold">{navigation.currentRoute}</span>
          {navigation.params && Object.keys(navigation.params).length > 0 && 
            ` (${JSON.stringify(navigation.params)})`}
        </p>
      </div>
      
      <div className="p-2">
        {/* Navbar */}
        <div className="mb-2 flex justify-between items-center border-b pb-2">
          <div className="font-bold text-blue-600">Online Shop</div>
          <div className="flex space-x-2 text-xs">
            <a href="#" className="px-2 py-1 text-blue-600 hover:bg-blue-50 rounded">Home</a>
            <a href="#" className="px-2 py-1 text-blue-600 hover:bg-blue-50 rounded">Cart</a>
            <a href="#" className="px-2 py-1 text-blue-600 hover:bg-blue-50 rounded">Favorites</a>
          </div>
        </div>
        
        {/* Search bar - simplified for viewport */}
        <div className="mb-2">
          <div className="flex border rounded overflow-hidden">
            <input 
              type="text" 
              placeholder="Search products..."
              className="px-2 py-1 flex-grow text-sm"
              defaultValue={navigation.currentRoute === 'search' ? navigation.params.q : ''}
            />
            <button className="bg-blue-600 text-white px-2 text-xs">
              Search
            </button>
          </div>
        </div>
        
        {/* Category pills - simplified */}
        <div className="mb-3 flex flex-wrap gap-1">
          {['All', 'Electronics', 'Clothing', 'Books', 'Home'].map(category => (
            <span 
              key={category}
              className={`text-xs px-2 py-1 rounded-full ${
                category === 'All' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </span>
          ))}
        </div>
        
        {/* Main content area */}
        <div className="min-h-[120px]">
          {navigation.currentRoute === 'home' && (
            <div className="grid grid-cols-2 gap-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="border rounded p-2">
                  <div className="bg-gray-100 h-12 mb-1"></div>
                  <div className="text-xs font-medium">Product {i+1}</div>
                  <div className="text-xs text-blue-600">$19.99</div>
                </div>
              ))}
            </div>
          )}
          
          {navigation.currentRoute === 'product' && (
            <div className="border rounded p-2">
              <div className="bg-gray-100 h-20 mb-2"></div>
              <h3 className="font-bold text-sm mb-1">
                Product ID: {navigation.params.id}
              </h3>
              <p className="text-xs text-gray-600 mb-2">
                This is a great product with many features.
              </p>
              <div className="flex justify-between items-center">
                <span className="font-bold text-sm">$29.99</span>
                <button className="bg-blue-600 text-white px-2 py-1 text-xs rounded">
                  Add to Cart
                </button>
              </div>
            </div>
          )}
          
          {navigation.currentRoute === 'cart' && (
            <div className="border rounded p-2">
              <h3 className="font-bold text-sm mb-2">Shopping Cart</h3>
              <div className="border-b pb-1 mb-1">
                <div className="flex justify-between text-xs">
                  <span>Product 1</span>
                  <span>$19.99</span>
                </div>
              </div>
              <div className="border-b pb-1 mb-1">
                <div className="flex justify-between text-xs">
                  <span>Product 2</span>
                  <span>$24.99</span>
                </div>
              </div>
              <div className="flex justify-between font-bold text-sm pt-1">
                <span>Total</span>
                <span>$44.98</span>
              </div>
              <button className="mt-2 w-full bg-blue-600 text-white py-1 text-xs rounded">
                Checkout
              </button>
            </div>
          )}
          
          {navigation.currentRoute === 'search' && (
            <>
              <h3 className="font-bold text-xs mb-2">
                Results for: {navigation.params.q || 'All Products'}
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="border rounded p-2">
                    <div className="bg-gray-100 h-12 mb-1"></div>
                    <div className="text-xs font-medium">Search Result {i+1}</div>
                    <div className="text-xs text-blue-600">$19.99</div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}