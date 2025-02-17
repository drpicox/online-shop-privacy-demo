// app/page.tsx
'use client';

import { useState } from 'react';
import { products, categories } from '@/lib/data';
import Navbar from '@/components/Navbar';
import CategoryFilter from '@/components/CategoryFilter';
import ProductGrid from '@/components/ProductGrid';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredProducts = products.filter(product =>
      selectedCategory === "All" ? true : product.category === selectedCategory
  );

  return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <main className="max-w-7xl mx-auto px-4 py-8">
          <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
          />

          <ProductGrid
              products={filteredProducts}
          />
        </main>
      </div>
  );
}