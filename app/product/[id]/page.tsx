// app/product/[id]/page.tsx
'use client';

import { useState } from 'react';
import { Heart } from 'lucide-react';
import { products } from '@/lib/data';
import { Review } from '@/types';
import Navbar from '@/components/Navbar';
import StarRating from '@/components/StarRating';
import {useAppDispatch, useAppSelector} from '@/store';
import {addToWishlist, removeFromWishlist, selectIsInWishlist} from "@/store/wishlistSlice";
import {addToCart} from "@/store/cartSlice";

export default function ProductDetailPage() {
    // Get productId from Redux navigation state
    const dispatch = useAppDispatch();
    const { params } = useAppSelector(state => state.navigation);
    const productId = Number(params.id);
    const liked = useAppSelector(state => selectIsInWishlist(state, productId));
    const product = products.find(p => p.id === productId);

    const [newReview, setNewReview] = useState({
        rating: 5,
        comment: '',
        userName: ''
    });

    if (!product) {
        return <div>Product not found</div>;
    }


    const handleLikeClick = () => {
        if (liked) {
            dispatch(removeFromWishlist(productId));
        } else {
            dispatch(addToWishlist(product));
        }
    };

    const handleReviewSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const review: Review = {
            id: (product.reviews?.length || 0) + 1,
            productId: product.id,
            userName: newReview.userName,
            rating: newReview.rating,
            comment: newReview.comment,
            date: new Date().toISOString().split('T')[0]
        };

        product.reviews = [...(product.reviews || []), review];

        // Reset form
        setNewReview({
            rating: 5,
            comment: '',
            userName: ''
        });
    };

    // Calculate average rating
    const averageRating = product.reviews?.length
        ? product.reviews.reduce((acc, review) => acc + review.rating, 0) / product.reviews.length
        : 0;

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Product Image */}
                    <div className="relative">
                        <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-96 object-cover rounded-lg"
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
                        <div className="flex items-center mb-4">
                            <StarRating rating={Math.round(averageRating)} />
                            <span className="ml-2 text-gray-600">
                ({product.reviews?.length || 0} reviews)
              </span>
                        </div>
                        <p className="text-2xl font-bold mb-4">${product.price}</p>
                        <p className="text-gray-600 mb-6">{product.description}</p>

                        <button
                            onClick={() => dispatch(addToCart(product))}
                            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Add to Cart
                        </button>
                    </div>
                </div>

                {/* Reviews Section */}
                <div className="mt-12">
                    <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>

                    {/* Review Form */}
                    <form onSubmit={handleReviewSubmit} className="bg-white p-6 rounded-lg shadow mb-8">
                        <h3 className="text-xl font-semibold mb-4">Write a Review</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Your Name</label>
                                <input
                                    type="text"
                                    required
                                    value={newReview.userName}
                                    onChange={(e) => setNewReview({...newReview, userName: e.target.value})}
                                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Rating</label>
                                <StarRating
                                    rating={newReview.rating}
                                    onChange={(rating) => setNewReview({...newReview, rating})}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Review</label>
                                <textarea
                                    required
                                    value={newReview.comment}
                                    onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 h-32"
                                />
                            </div>
                            <button
                                type="submit"
                                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Submit Review
                            </button>
                        </div>
                    </form>

                    {/* Reviews List */}
                    <div className="space-y-6">
                        {product.reviews?.map((review) => (
                            <div key={review.id} className="bg-white p-6 rounded-lg shadow">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h4 className="font-semibold">{review.userName}</h4>
                                        <StarRating rating={review.rating} size={16} />
                                    </div>
                                    <span className="text-gray-500 text-sm">{review.date}</span>
                                </div>
                                <p className="text-gray-600">{review.comment}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}