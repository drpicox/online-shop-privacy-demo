// components/Router.tsx
'use client';

import { useAppSelector } from '@/store';
import HomePage from '@/app/page';
import ProductDetailPage from '@/app/product/[id]/page';
import CartPage from '@/app/cart/page';
import LikesPage from '@/app/likes/page';
import CheckoutPage from '@/app/checkout/page';
import SearchPage from '@/app/search/page';

export default function Router() {
    const { currentRoute, params, searchQuery } = useAppSelector((state) => state.navigation);

    switch (currentRoute) {
        case 'home':
            return <HomePage />;
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
            return <HomePage />;
    }
}