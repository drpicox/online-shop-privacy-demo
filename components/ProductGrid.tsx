// components/ProductGrid.tsx
'use client';

import { Product } from '@/types';
import ProductCard from './ProductCard';
import { useShopSelector } from '@/store/shop';
import { selectViewportWidth } from '@/store/shop/slices/trackingSlice';
import { useMemo } from 'react';

interface ProductGridProps {
  products: Product[];
}

export default function ProductGrid({ products }: ProductGridProps) {
  // Get viewport width from Redux using specific selector
  const viewportWidth = useShopSelector(selectViewportWidth);
  
  // Determine grid columns based on viewport width
  const gridCols = useMemo(() => {
    if (viewportWidth >= 1024) {
      return 'grid-cols-4'; // lg: >= 1024px
    } else if (viewportWidth >= 640) {
      return 'grid-cols-2'; // sm: >= 640px
    } else {
      return 'grid-cols-1'; // default: < 640px
    }
  }, [viewportWidth]);
  
  // Memoize the product cards to prevent unnecessary re-renders
  const productCards = useMemo(() => {
    return products.map((product) => (
      <ProductCard
        key={product.id}
        product={product}
      />
    ));
  }, [products]);

  return (
    <div className={`grid ${gridCols} gap-6`}>
      {productCards}
    </div>
  );
}
