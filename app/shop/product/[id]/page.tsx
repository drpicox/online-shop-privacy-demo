// app/shop/product/[id]/page.tsx
'use client';

import { Heart } from 'lucide-react';
import { products } from '@/lib/data';
import Navbar from '@/components/Navbar';
import {useShopDispatch, useShopSelector} from '@/store';
import {addToWishlist, removeFromWishlist, selectIsInWishlist} from "@/store/shop/slices/wishlistSlice";
import {addToCart} from "@/store/shop/slices/cartSlice";
import {selectViewportWidth} from "@/store/shop/slices/trackingSlice";
import { formatPrice } from "@/lib/utils";

export default function ProductDetailPage() {
    // Get productId from Redux navigation state
    const dispatch = useShopDispatch();
    const { params } = useShopSelector(state => state.navigation);
    const productId = Number(params.id);
    const liked = useShopSelector(state => selectIsInWishlist(state, productId));
    const viewportWidth = useShopSelector(state => selectViewportWidth(state));
    const product = products.find(p => p.id === productId);

    if (!product) {
        return <div>Producte no trobat</div>;
    }

    const handleLikeClick = () => {
        if (liked) {
            dispatch(removeFromWishlist(productId));
        } else {
            dispatch(addToWishlist(product));
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 py-8">
                <div className={viewportWidth < 768 ? 'grid grid-cols-1 gap-8' : 'grid grid-cols-2 gap-8'}>
                    {/* Product Image */}
                    <div className="relative w-full aspect-square">
                        <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover rounded-lg"
                        />
                        <button
                            onClick={handleLikeClick}
                            className={`absolute top-4 right-4 p-2 rounded-full ${
                                liked ? 'bg-red-500 text-white' : 'bg-white text-gray-600'
                            } hover:scale-110 transition-all`}
                        >
                            <Heart className="h-6 w-6" fill={liked ? 'currentColor' : 'none'} />
                        </button>
                    </div>

                    {/* Product Info */}
                    <div>
                        <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
                        <p className="text-2xl font-bold mb-4">{formatPrice(product.price)}</p>
                        <p className="text-gray-600 mb-6">{product.description}</p>

                        <button
                            onClick={() => dispatch(addToCart(product))}
                            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Afegeix al carret
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}