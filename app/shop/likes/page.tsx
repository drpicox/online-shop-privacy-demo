// app/shop/likes/page.tsx
'use client';

import { Trash2 } from 'lucide-react';
import { useShopDispatch, useShopSelector } from '@/store';
import { removeFromWishlist } from '@/store/shop/slices/wishlistSlice';
import { addToCart } from '@/store/shop/slices/cartSlice';
import Navbar from '@/components/Navbar';
import Link from '@/components/Link';

export default function LikesPage() {
    const dispatch = useShopDispatch();
    const wishlistItems = useShopSelector(state => state.wishlist.items);

    if (wishlistItems.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="max-w-3xl mx-auto py-12 px-4 text-center">
                    <h1 className="text-2xl font-bold mb-4">Your Wishlist is Empty</h1>
                    <p className="text-gray-600 mb-8">Start adding items you like to create your wishlist!</p>
                    <Link
                        href="home"
                        className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Browse Products
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <main className="max-w-3xl mx-auto py-12 px-4">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold">My Wishlist</h1>
                    <p className="text-gray-600">{wishlistItems.length} items</p>
                </div>

                <div className="bg-white rounded-lg shadow divide-y">
                    {wishlistItems.map((item) => (
                        <div key={item.id} className="p-6 flex items-center">
                            <img
                                src={item.image}
                                alt={item.name}
                                className="w-24 h-24 object-cover rounded"
                            />

                            <div className="ml-6 flex-grow">
                                <h3 className="text-lg font-semibold">{item.name}</h3>
                                <p className="text-gray-600 mb-2">${item.price}</p>
                                <div className="flex space-x-4">
                                    <button
                                        onClick={() => dispatch(addToCart(item))}
                                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                    >
                                        Add to Cart
                                    </button>
                                    <button
                                        onClick={() => dispatch(removeFromWishlist(item.id))}
                                        className="text-red-500 hover:text-red-700 text-sm font-medium flex items-center"
                                    >
                                        <Trash2 className="w-4 h-4 mr-1" />
                                        Remove
                                    </button>
                                </div>
                            </div>

                            <div className="text-right">
                                <p className="text-lg font-bold">${item.price}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}