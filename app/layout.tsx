// app/layout.tsx
'use client';

import { Inter } from "next/font/google";
import { Provider } from 'react-redux';
import { store } from '@/store';
import Router from '@/components/Router';
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout() {
    return (
        <html lang="en">
        <body className={inter.className}>
        <Provider store={store}>
                <Router />
        </Provider>
        </body>
        </html>
    );
}