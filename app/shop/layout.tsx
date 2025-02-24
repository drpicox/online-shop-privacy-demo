'use client';

import { Provider } from 'react-redux';
import { store } from '@/store';
import Router from '@/components/Router';
import BrowserHistoryHandler from '@/components/BrowserHistoryHandler';

export default function ShopLayout() {
  return (
    <Provider store={store}>
      <BrowserHistoryHandler />
      <Router basePath="/shop" />
    </Provider>
  );
}