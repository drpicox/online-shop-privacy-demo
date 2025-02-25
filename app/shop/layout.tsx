'use client';

import { Provider } from 'react-redux';
import { shopStore } from '@/store/shop';
import Router from '@/components/Router';
import BrowserHistoryHandler from '@/components/BrowserHistoryHandler';
import TrackingHandler from '@/components/TrackingHandler';

export default function ShopLayout() {
  return (
    <Provider store={shopStore}>
      <BrowserHistoryHandler />
      <TrackingHandler />
      <Router />
    </Provider>
  );
}