// components/SearchBar.tsx
'use client';

import { useMemo } from 'react';
import { Search, X } from 'lucide-react';
import { products } from '@/lib/data';
import { searchProducts } from '@/utils/search';
import Link from '@/components/Link';
import { navigate } from "@/store/shop/slices/navigationSlice";
import { useShopDispatch, useShopSelector } from "@/store";
import { selectSearchQuery, setSearchQuery } from "@/store/shop/slices/searchSlice";
import { selectViewportWidth } from "@/store/shop/slices/trackingSlice";

export default function SearchBar() {
    const dispatch = useShopDispatch();
    const query = useShopSelector(selectSearchQuery);
    const viewportWidth = useShopSelector(selectViewportWidth);
    const isOpen = query.length >= 2;
    const quickResults = useMemo(() => isOpen ? searchProducts(products, query).slice(0, 3) : [], [query, isOpen]);
    
    // Determine input width based on viewport width
    const inputWidth = useMemo(() => {
        if (viewportWidth < 640) {
            return '100%'; // Full width on small mobile
        } else if (viewportWidth < 768) {
            return '200px'; // Slightly constrained on larger mobile
        } else {
            return '256px'; // Default width on desktop
        }
    }, [viewportWidth]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            dispatch(navigate({route: 'search', params: {q: query.trim()}}));
            dispatch(setSearchQuery(''));
        }
    };

    return (
        <div className="relative">
            <form onSubmit={handleSubmit} className="relative">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => dispatch(setSearchQuery(e.target.value))}
                    placeholder="Search products..."
                    className="pl-8 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    style={{ width: inputWidth }}
                />
                <Search className="absolute left-2 top-2.5 h-5 w-5 text-gray-400" />
                {query && (
                    <button
                        type="button"
                        onClick={() => dispatch(setSearchQuery(''))}
                        className="absolute right-2 top-2.5 text-gray-400 hover:text-gray-600"
                    >
                        <X className="h-5 w-5" />
                    </button>
                )}
            </form>

            {/* Quick results dropdown */}
            {isOpen && quickResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg z-50 max-h-96 overflow-auto">
                    {quickResults.map((product) => (
                        <Link
                            key={product.id}
                            href="search"
                            params={{q: query.trim()}}
                            className="flex items-center p-4 hover:bg-gray-50 transition-colors border-b last:border-b-0"
                            onClick={() => dispatch(setSearchQuery(''))}
                        >
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-12 h-12 object-cover rounded"
                            />
                            <div className="ml-4">
                                <h4 className="font-medium">{product.name}</h4>
                                <p className="text-sm text-gray-600">${product.price}</p>
                            </div>
                        </Link>
                    ))}

                    <button
                        onClick={handleSubmit}
                        className="w-full p-3 text-blue-600 hover:bg-gray-50 transition-colors text-sm font-medium"
                    >
                        See all results for &quot;{query}&quot;
                    </button>
                </div>
            )}
        </div>
    );
}