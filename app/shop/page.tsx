// app/shop/page.tsx
'use client';

import { products, categories } from '@/lib/data';
import Navbar from '@/components/Navbar';
import CategoryFilter from '@/components/CategoryFilter';
import ProductGrid from '@/components/ProductGrid';
import { useShopSelector } from "@/store";
import { selectCategory } from "@/store/shop/slices/filterSlice";
import { shopStore } from "@/store/shop";
import { useEffect } from 'react';
import { initSocket } from '@/lib/socket';

export default function ShopPage() {
  const selectedCategory = useShopSelector(selectCategory);

  // Ensure socket is initialized when page component mounts
  useEffect(() => {
    console.log("Shop page mounted - ensuring socket connection");
    // Initialize socket with state access
    initSocket(shopStore.getState);
    
    return () => {
      // No need to disconnect on page unmount as we want the socket to persist
    };
  }, []);

  const filteredProducts = products.filter(product =>
      selectedCategory === "All" ? true : product.category === selectedCategory
  );

  return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <main className="max-w-7xl mx-auto px-4 py-8">
          <CategoryFilter
              categories={categories}
          />

          <ProductGrid
              products={filteredProducts}
          />
        </main>
      </div>
  );
}