// utils/search.ts
import { Product } from '@/types';

export function searchProducts(products: Product[], searchQuery: string): Product[] {
    const query = searchQuery.toLowerCase().trim();

    if (!query) return [];

    return products.filter(product => {
        const searchableText = [
            product.name,
            product.category,
            // Add more searchable fields here if needed
        ].join(' ').toLowerCase();

        return searchableText.includes(query);
    });
}