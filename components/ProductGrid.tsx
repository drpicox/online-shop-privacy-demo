// components/ProductGrid.tsx
'use client';

import { Product } from '@/types';
import ProductCard from './ProductCard';
import { useShopSelector, selectTracking } from '@/store/shop';
import { useMemo } from 'react';

interface ProductGridProps {
  products: Product[];
}

export default function ProductGrid({ products }: ProductGridProps) {
  // Get viewport width from Redux
  const { viewport } = useShopSelector(selectTracking);
  
  // Determine grid columns based on viewport width
  const gridCols = useMemo(() => {
    if (viewport.width >= 1024) {
      return 'grid-cols-4'; // lg: >= 1024px
    } else if (viewport.width >= 640) {
      return 'grid-cols-2'; // sm: >= 640px
    } else {
      return 'grid-cols-1'; // default: < 640px
    }
  }, [viewport.width]);
  
  return (
    <div className={`grid ${gridCols} gap-6`}>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
        />
      ))}
    </div>
  );
}
