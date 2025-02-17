// components/SearchBar.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, X } from 'lucide-react';
import { products } from '@/lib/data';
import { searchProducts } from '@/utils/search';
import Link from '@/components/Link';

export default function SearchBar() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [query, setQuery] = useState(searchParams.get('q') || '');
    const [isOpen, setIsOpen] = useState(false);
    const [quickResults, setQuickResults] = useState<typeof products>([]);

    useEffect(() => {
        if (query.length >= 2) {
            const results = searchProducts(products, query).slice(0, 5);
            setQuickResults(results);
            setIsOpen(true);
        } else {
            setQuickResults([]);
            setIsOpen(false);
        }
    }, [query]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/search?q=${encodeURIComponent(query.trim())}`);
            setIsOpen(false);
        }
    };

    return (
        <div className="relative">
            <form onSubmit={handleSubmit} className="relative">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search products..."
                    className="pl-8 pr-10 py-2 border rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Search className="absolute left-2 top-2.5 h-5 w-5 text-gray-400" />
                {query && (
                    <button
                        type="button"
                        onClick={() => setQuery('')}
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
                            href={`/search?q=${encodeURIComponent(query.trim())}`}
                            className="flex items-center p-4 hover:bg-gray-50 transition-colors border-b last:border-b-0"
                            onClick={() => setIsOpen(false)}
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
                        See all results for "{query}"
                    </button>
                </div>
            )}
        </div>
    );
}