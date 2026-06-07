// app/shop/search/page.tsx
'use client';

import { products } from '@/lib/data';
import { searchProducts } from '@/utils/search';
import ProductGrid from '@/components/ProductGrid';
import Navbar from '@/components/Navbar';
import {useShopSelector} from "@/store";
import {selectNavigation} from "@/store/shop/slices/navigationSlice";

export default function SearchPage() {
    const {params} = useShopSelector(state => selectNavigation(state));
    const query = params.q || '';

    const searchResults = searchProducts(products, query);

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold mb-2">
                        Resultats de cerca per «{query}»
                    </h1>
                    <p className="text-gray-600">
                        {searchResults.length === 1
                            ? "S'ha trobat 1 producte"
                            : `S'han trobat ${searchResults.length} productes`}
                    </p>
                </div>

                {searchResults.length > 0 ? (
                    <ProductGrid
                        products={searchResults}
                    />
                ) : (
                    <div className="text-center py-12">
                        <h2 className="text-xl font-semibold mb-4">{"No s'ha trobat cap producte"}</h2>
                        <p className="text-gray-600">
                            {"Prova d'ajustar la cerca o explora les nostres categories per trobar el que busques."}
                        </p>
                    </div>
                )}
            </main>
        </div>
    );
}
