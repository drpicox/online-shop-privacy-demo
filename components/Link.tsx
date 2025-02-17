// components/Link.tsx
'use client';

import { ReactNode } from 'react';
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
        dispatch(navigate({ route: href, params }));
    };

    return (
        <a href="#" onClick={handleClick} className={className}>
            {children}
        </a>
    );
}