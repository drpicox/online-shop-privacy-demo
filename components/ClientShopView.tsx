'use client';

import { useClientContext } from '@/store/context/ClientContext';
import { useShopSelector } from '@/store';
import { selectNavigation } from '@/store/shop/slices/navigationSlice';
import ProductGrid from './ProductGrid';
import CategoryFilter from './CategoryFilter';
import Navbar from './Navbar';
import Image from 'next/image';
import { products, categories } from '@/lib/data';

export default function ClientShopView() {
  const { clientId } = useClientContext();
  
  // These selectors will now use the client state if a clientId is present in the context
  const navigation = useShopSelector(selectNavigation);
  
  // Get products based on current route
  const productId = navigation.params?.id ? Number(navigation.params.id) : undefined;
  const product = productId ? products.find(p => p.id === productId) : undefined;
  
  // Get selected category from navigation
  const selectedCategory = navigation.params?.category || "All";
  
  // Filter products based on selected category or search query
  const filteredProducts = products.filter(product => {
    if (navigation.currentRoute === 'search' && navigation.params?.q) {
      return product.name.toLowerCase().includes((navigation.params.q as string).toLowerCase());
    } else {
      return selectedCategory === "All" ? true : product.category === selectedCategory;
    }
  });
  
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
        {/* Real Navbar component */}
        <Navbar />
        
        {/* Main content area */}
        <div className="min-h-[120px]">
          {/* Show CategoryFilter on home and search pages */}
          {(navigation.currentRoute === 'home' || navigation.currentRoute === 'search') && (
            <div className="mb-4 mt-4">
              <CategoryFilter categories={categories} />
            </div>
          )}
          
          {navigation.currentRoute === 'home' && (
            <ProductGrid products={filteredProducts} />
          )}
          
          {navigation.currentRoute === 'product' && product && (
            <div className="border rounded p-2">
              <div className="bg-gray-100 h-20 mb-2 flex items-center justify-center">
                {product.image && (
                  <div className="relative h-full w-full">
                    <Image 
                      src={product.image} 
                      alt={product.name}
                      fill
                      style={{ objectFit: "contain" }}
                    />
                  </div>
                )}
              </div>
              <h3 className="font-bold text-sm mb-1">
                {product.name}
              </h3>
              <p className="text-xs text-gray-600 mb-2">
                {product.description || "No description available."}
              </p>
              <div className="flex justify-between items-center">
                <span className="font-bold text-sm">${product.price.toFixed(2)}</span>
                <button className="bg-blue-600 text-white px-2 py-1 text-xs rounded">
                  Add to Cart
                </button>
              </div>
            </div>
          )}
          
          {navigation.currentRoute === 'cart' && (
            <div className="border rounded p-2">
              <h3 className="font-bold text-sm mb-2">Shopping Cart</h3>
              {/* Real cart items would be rendered here */}
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
              <ProductGrid products={filteredProducts} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}