'use client';

import { Provider } from 'react-redux';
import { shopStore } from '@/store/shop';
import Router from '@/components/Router';
import BrowserHistoryHandler from '@/components/BrowserHistoryHandler';

export default function ShopLayout() {
  return (
    <Provider store={shopStore}>
      <BrowserHistoryHandler />
      <Router basePath="/shop" />
    </Provider>
  );
}