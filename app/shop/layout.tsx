'use client';

import { Provider } from 'react-redux';
import { store } from '@/store';
import Router from '@/components/Router';
import BrowserHistoryHandler from '@/components/BrowserHistoryHandler';

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Provider store={store}>
      <BrowserHistoryHandler />
      <Router basePath="/shop" />
      {children}
    </Provider>
  );
}