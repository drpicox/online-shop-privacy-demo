// components/Link.tsx
'use client';

import { ReactNode } from 'react';
import { useShopDispatch, useShopSelector } from '@/store';
import { navigate, Route, getFullPath } from '@/store/shop/slices/navigationSlice';

interface LinkProps {
    href: Route;
    params?: Record<string, string>;
    children: ReactNode;
    className?: string;
    onClick?: () => void;
}

export default function Link({ href, params, children, className, onClick }: LinkProps) {
    const dispatch = useShopDispatch();
    const { basePath } = useShopSelector(state => state.navigation);

    const handleClick = (e: React.MouseEvent) => {
        onClick?.();
        e.preventDefault();
        
        // Update browser history when navigating
        const relativePath = getUrlFromRoute(href, params);
        const fullPath = getFullPath(relativePath, basePath);
        
        window.history.pushState({ route: href, params }, '', fullPath);
        
        dispatch(navigate({ route: href, params }));
    };

    const relativePath = getUrlFromRoute(href, params);
    const fullPath = getFullPath(relativePath, basePath);

    return (
        <a href={fullPath} onClick={handleClick} className={className}>
            {children}
        </a>
    );
}

// Helper function to convert route and params to URL (returns relative path)
function getUrlFromRoute(route: Route, params?: Record<string, string>): string {
    switch (route) {
        case 'home':
            return '/';
        case 'product':
            return `/product/${params?.id || ''}`;
        case 'cart':
            return '/cart';
        case 'likes':
            return '/likes';
        case 'checkout':
            return '/checkout';
        case 'search':
            return `/search${params?.query ? `?query=${params.query}` : ''}`;
        default:
            return '/';
    }
}