// components/Router.tsx
'use client';

import { useShopSelector } from '@/store';
import ShopPage from '@/app/shop/page';
import ProductDetailPage from '@/app/shop/product/[id]/page';
import CartPage from '@/app/shop/cart/page';
import LikesPage from '@/app/shop/likes/page';
import CheckoutPage from '@/app/shop/checkout/page';
import SearchPage from '@/app/shop/search/page';

export default function Router() {
  const { currentRoute } = useShopSelector((state) => state.navigation);

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