// components/StarRating.tsx
'use client';

import { Star } from 'lucide-react';

interface StarRatingProps {
    rating: number;
    size?: number;
    onChange?: (rating: number) => void;
}

export default function StarRating({ rating, size = 20, onChange }: StarRatingProps) {
    return (
        <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    onClick={() => onChange?.(star)}
                    className={`${onChange ? 'cursor-pointer' : 'cursor-default'}`}
                    type={onChange ? 'button' : 'submit'}
                >
                    <Star
                        size={size}
                        className={`${
                            star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                        }`}
                    />
                </button>
            ))}
        </div>
    );
}