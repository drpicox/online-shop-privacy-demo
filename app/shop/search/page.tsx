// app/shop/search/page.tsx
'use client';

import { products } from '@/lib/data';
import { searchProducts } from '@/utils/search';
import ProductGrid from '@/components/ProductGrid';
import Navbar from '@/components/Navbar';
import {useAppSelector} from "@/store";
import {selectNavigation} from "@/store/navigationSlice";

export default function SearchPage() {
    const {params} = useAppSelector(state => selectNavigation(state));
    const query = params.query || '';

    const searchResults = searchProducts(products, query);

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold mb-2">
                        Search Results for "{query}"
                    </h1>
                    <p className="text-gray-600">
                        Found {searchResults.length} {searchResults.length === 1 ? 'product' : 'products'}
                    </p>
                </div>

                {searchResults.length > 0 ? (
                    <ProductGrid
                        products={searchResults}
                    />
                ) : (
                    <div className="text-center py-12">
                        <h2 className="text-xl font-semibold mb-4">No products found</h2>
                        <p className="text-gray-600">
                            Try adjusting your search or browse our categories for what you're looking for.
                        </p>
                    </div>
                )}
            </main>
        </div>
    );
}