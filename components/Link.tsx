// components/Link.tsx
'use client';

import { ReactNode, useEffect } from 'react';
import { useAppDispatch } from '@/store';
import { navigate, Route } from '@/store/navigationSlice';

interface LinkProps {
    href: Route;
    params?: Record<string, string>;
    children: ReactNode;
    className?: string;
    onClick?: () => void;
}

export default function Link({ href, params, children, className, onClick }: LinkProps) {
    const dispatch = useAppDispatch();

    const handleClick = (e: React.MouseEvent) => {
        onClick?.();
        e.preventDefault();
        
        // Update browser history when navigating
        const url = getUrlFromRoute(href, params);
        window.history.pushState({ route: href, params }, '', url);
        
        dispatch(navigate({ route: href, params }));
    };

    return (
        <a href={getUrlFromRoute(href, params)} onClick={handleClick} className={className}>
            {children}
        </a>
    );
}

// Helper function to convert route and params to URL
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