'use client';

import { Provider } from 'react-redux';
import { shopStore } from '@/store/shop';
import Router from '@/components/Router';
import BrowserHistoryHandler from '@/components/BrowserHistoryHandler';
import TrackingHandler from '@/components/TrackingHandler';
import SocketInitializer from '@/components/SocketInitializer';
import ClientIdentifier from '@/components/ClientIdentifier';

export default function ShopLayout() {
  return (
    <Provider store={shopStore}>
      <BrowserHistoryHandler />
      <TrackingHandler />
      <SocketInitializer />
      <ClientIdentifier />
      <Router />
    </Provider>
  );
}