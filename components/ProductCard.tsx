// components/ProductCard.tsx
'use client';

import { Heart } from 'lucide-react';
import { Product } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import Link from '@/components/Link';
import { useShopDispatch, useShopSelector } from '@/store';
import { addToWishlist, removeFromWishlist, selectIsInWishlist } from '@/store/shop/slices/wishlistSlice';
import {addToCart} from "@/store/shop/slices/cartSlice";
import { formatPrice } from '@/lib/utils';
import React from 'react';

interface ProductCardProps {
    product: Product;
}

function ProductCard({ product }: ProductCardProps) {
    const dispatch = useShopDispatch();
    const liked = useShopSelector(state => selectIsInWishlist(state, product.id));

    const handleLikeClick = (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent the Link from triggering
        e.stopPropagation(); // Prevent the Card from triggering
        if (liked) {
            dispatch(removeFromWishlist(product.id));
        } else {
            dispatch(addToWishlist(product));
        }
    };

    return (
        <Link href="product" params={{ id: product.id.toString() }}>
            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-64 object-cover"
                    />
                    <button
                        onClick={handleLikeClick}
                        className={`absolute top-2 right-2 p-2 rounded-full ${
                            liked ? 'bg-red-500 text-white' : 'bg-white text-gray-600'
                        } hover:scale-110 transition-all`}
                    >
                        <Heart className="h-5 w-5" fill={liked ? 'currentColor' : 'none'} />
                    </button>
                </div>
                <CardContent className="p-4">
                    <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                    <div className="flex justify-between items-center">
                        <span className="text-xl font-bold">{formatPrice(product.price)}</span>
                        <button
                            onClick={(e) => {
                                e.preventDefault(); // Prevent the Link from triggering
                                e.stopPropagation(); // Prevent the Link from triggering
                                dispatch(addToCart(product));
                            }}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Afegeix al carret
                        </button>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}

// Memoize the component to prevent re-renders when parent re-renders
export default React.memo(ProductCard);