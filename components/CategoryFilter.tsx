// components/CategoryFilter.tsx
'use client';

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export default function CategoryFilter({ 
  categories, 
  selectedCategory, 
  onSelectCategory 
}: CategoryFilterProps) {
  return (
    <div className="flex space-x-4 mb-8 overflow-x-auto pb-2">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onSelectCategory(category)}
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
