// components/BrowserHistoryHandler.tsx
'use client';

import { useEffect } from 'react';
import { useShopDispatch } from '@/store';
import { Route, syncWithBrowserHistory } from '@/store/navigationSlice';

export default function BrowserHistoryHandler() {
  const dispatch = useShopDispatch();

  useEffect(() => {
    // Function to parse the URL and update Redux state
    const syncStateWithURL = () => {
      const pathname = window.location.pathname;
      
      // If not in shop section, don't handle the route
      if (!pathname.startsWith('/shop') && pathname !== '/') {
        return;
      }
      
      // Map URL paths to Route types and extract params
      let route: Route = 'home';
      const params: Record<string, string> = {};
      
      // Check if we're in the shop section
      const isShopPath = pathname.startsWith('/shop');
      const relativePath = isShopPath ? pathname.replace('/shop', '') : pathname;
      
      // Ensure relativePath starts with a slash for empty paths
      const normalizedPath = relativePath === '' ? '/' : relativePath;
      
      if (normalizedPath === '/') {
        route = 'home';
      } else if (normalizedPath === '/cart') {
        route = 'cart';
      } else if (normalizedPath === '/likes') {
        route = 'likes';
      } else if (normalizedPath === '/checkout') {
        route = 'checkout';
      } else if (normalizedPath === '/search') {
        route = 'search';
        // Extract search query from URL if present
        const searchParams = new URLSearchParams(window.location.search);
        const query = searchParams.get('query');
        if (query) {
          params.query = query;
        }
      } else if (normalizedPath.startsWith('/product/')) {
        route = 'product';
        // Extract product ID from URL
        const id = normalizedPath.split('/')[2];
        if (id) {
          params.id = id;
        }
      }
      
      // Dispatch action to sync Redux state with browser history
      dispatch(syncWithBrowserHistory({ route, params }));
    };

    // Sync state on initial load
    syncStateWithURL();

    // Listen for popstate events (back/forward navigation)
    const handlePopState = () => {
      syncStateWithURL();
    };

    window.addEventListener('popstate', handlePopState);

    // Clean up event listener
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [dispatch]);

  // Component has no UI
  return null;
}