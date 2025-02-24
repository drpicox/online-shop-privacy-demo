// components/Router.tsx
'use client';

import { useAppSelector } from '@/store';
import ShopPage from '@/app/shop/page';
import ProductDetailPage from '@/app/product/[id]/page';
import CartPage from '@/app/cart/page';
import LikesPage from '@/app/likes/page';
import CheckoutPage from '@/app/checkout/page';
import SearchPage from '@/app/search/page';

interface RouterProps {
  basePath?: string;
}

export default function Router({ basePath = '' }: RouterProps) {
  const { currentRoute } = useAppSelector((state) => state.navigation);

  switch (currentRoute) {
    case 'home':
      return <ShopPage />;
    case 'product':
      return <ProductDetailPage />;
    case 'cart':
      return <CartPage />;
    case 'likes':
      return <LikesPage />;
    case 'checkout':
      return <CheckoutPage />;
    case 'search':
      return <SearchPage />;
    default:
      return <ShopPage />;
  }
}