// components/Navbar.tsx
'use client';

import { ShoppingCart, Heart, Menu } from 'lucide-react';
import { useShopSelector } from '@/store';
import Link from '@/components/Link';
import SearchBar from './SearchBar';
import {selectCartItemsCount} from "@/store/shop/slices/cartSlice";

export default function Navbar() {
  const totalCartItems = useShopSelector(selectCartItemsCount);
  const wishlistItems = useShopSelector(state => state.wishlist.items);

  return (
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Menu className="h-6 w-6 mr-4 cursor-pointer" />
              <Link href="home" className="text-xl font-bold">
                StyleStore
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <SearchBar />

              <Link href="likes" className="relative">
                <Heart className="h-6 w-6 text-gray-600" />
                {wishlistItems.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {wishlistItems.length}
                </span>
                )}
              </Link>

              <Link href="cart" className="relative">
                <ShoppingCart className="h-6 w-6 text-gray-600" />
                {totalCartItems > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalCartItems}
                </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </nav>
  );
}