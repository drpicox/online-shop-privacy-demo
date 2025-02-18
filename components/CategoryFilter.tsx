// components/CategoryFilter.tsx
'use client';

import {useAppDispatch, useAppSelector} from "@/store";
import {selectCategory, setCategory} from "@/store/filterSlice";

interface CategoryFilterProps {
  categories: string[];
}

export default function CategoryFilter({ 
  categories,
}: CategoryFilterProps) {
  const dispatch = useAppDispatch();
  const selectedCategory = useAppSelector(selectCategory);

  return (
    <div className="flex space-x-4 mb-8 overflow-x-auto pb-2">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => dispatch(setCategory(category))}
          className={`px-4 py-2 rounded-full transition-all ${
            selectedCategory === category
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-800 hover:shadow-md'
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
