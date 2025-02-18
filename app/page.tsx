// app/page.tsx
'use client';

import { useState } from 'react';
import { products, categories } from '@/lib/data';
import Navbar from '@/components/Navbar';
import CategoryFilter from '@/components/CategoryFilter';
import ProductGrid from '@/components/ProductGrid';
import {useAppSelector} from "@/store";
import {selectCategory} from "@/store/filterSlice";

export default function Home() {
  const selectedCategory = useAppSelector(selectCategory);

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