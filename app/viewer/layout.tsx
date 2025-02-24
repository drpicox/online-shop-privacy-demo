'use client';

import { Provider } from 'react-redux';
import { viewerStore } from '@/store/viewer';

export default function ViewerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Provider store={viewerStore}>
      {children}
    </Provider>
  );
}