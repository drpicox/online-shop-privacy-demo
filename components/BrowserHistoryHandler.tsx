// components/BrowserHistoryHandler.tsx
'use client';

import { useEffect } from 'react';
import { useAppDispatch } from '@/store';
import { Route, syncWithBrowserHistory } from '@/store/navigationSlice';

export default function BrowserHistoryHandler() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Function to parse the URL and update Redux state
    const syncStateWithURL = () => {
      const pathname = window.location.pathname;
      
      // Map URL paths to Route types and extract params
      let route: Route = 'home';
      const params: Record<string, string> = {};
      
      if (pathname === '/') {
        route = 'home';
      } else if (pathname === '/cart') {
        route = 'cart';
      } else if (pathname === '/likes') {
        route = 'likes';
      } else if (pathname === '/checkout') {
        route = 'checkout';
      } else if (pathname === '/search') {
        route = 'search';
        // Extract search query from URL if present
        const searchParams = new URLSearchParams(window.location.search);
        const query = searchParams.get('query');
        if (query) {
          params.query = query;
        }
      } else if (pathname.startsWith('/product/')) {
        route = 'product';
        // Extract product ID from URL
        const id = pathname.split('/')[2];
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