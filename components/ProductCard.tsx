// components/ProductCard.tsx
'use client';

import { Heart } from 'lucide-react';
import { Product } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import Link from '@/components/Link';
import { useAppDispatch, useAppSelector } from '@/store';
import { addToWishlist, removeFromWishlist } from '@/store/wishlistSlice';
import {addToCart} from "@/store/cartSlice";

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const dispatch = useAppDispatch();
    const liked = useAppSelector(state =>
        state.wishlist.items.some(item => item.id === product.id)
    );

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
                        <span className="text-xl font-bold">${product.price}</span>
                        <button
                            onClick={(e) => {
                                e.preventDefault(); // Prevent the Link from triggering
                                e.stopPropagation(); // Prevent the Link from triggering
                                dispatch(addToCart(product));
                            }}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Add to Cart
                        </button>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}