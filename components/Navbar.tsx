// components/Navbar.tsx
'use client';

import { ShoppingCart, Heart, Menu, Search, X } from 'lucide-react';
import { useShopDispatch, useShopSelector } from '@/store';
import Link from '@/components/Link';
import SearchBar from './SearchBar';
import { selectCartItemsCount } from "@/store/shop/slices/cartSlice";
import { selectViewportWidth } from "@/store/shop/slices/trackingSlice";
import { toggleSearchVisibility } from "@/store/shop/slices/uiSlice";
import { useMemo, useState, useEffect } from 'react';

export default function Navbar() {
  const dispatch = useShopDispatch();
  const totalCartItems = useShopSelector(selectCartItemsCount);
  const wishlistItems = useShopSelector(state => state.wishlist.items);
  const viewportWidth = useShopSelector(selectViewportWidth);
  
  // Use local state as fallback
  const [localSearchVisible, setLocalSearchVisible] = useState(false);
  
  // Get the UI state from Redux (the selector already falls back to false
  // when the ui slice isn't available, so no defensive try/catch is needed).
  const reduxSearchVisible = useShopSelector((state) => state.ui?.isSearchVisible || false);
  
  // Combine Redux and local state for display
  const isSearchVisible = reduxSearchVisible || localSearchVisible;
  
  // When redux state becomes available, sync the local state
  useEffect(() => {
    if (reduxSearchVisible !== localSearchVisible) {
      setLocalSearchVisible(reduxSearchVisible);
    }
  }, [reduxSearchVisible]);
  
  // Determine if we're on mobile based on tracked viewport width
  const isMobile = useMemo(() => viewportWidth < 768, [viewportWidth]);
  
  // Toggle function that tries Redux first, falls back to local state
  const toggleSearch = () => {
    try {
      // Always update local state to keep them in sync
      setLocalSearchVisible(!isSearchVisible);
      // Try to dispatch to Redux
      dispatch(toggleSearchVisibility());
    } catch (error) {
      console.error('Error dispatching toggle action:', error);
    }
  };

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
              {/* Search button for mobile */}
              {isMobile && (
                <button onClick={toggleSearch}>
                  {isSearchVisible ? (
                    <X className="h-6 w-6 text-gray-600" />
                  ) : (
                    <Search className="h-6 w-6 text-gray-600" />
                  )}
                </button>
              )}
              
              {/* Search bar - conditionally rendered based on viewport width */}
              {(!isMobile || isSearchVisible) && (
                <div className={isSearchVisible && isMobile ? "absolute top-16 left-0 right-0 bg-white p-2 shadow-md z-50" : ""}>
                  <SearchBar />
                </div>
              )}

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