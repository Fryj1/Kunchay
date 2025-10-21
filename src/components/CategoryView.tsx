import React from 'react';
import type { TeaCategory } from '../types';

interface CategoryViewProps {
    categories: TeaCategory[];
    onSelectCategory: (category: TeaCategory) => void;
}

const CategoryView: React.FC<CategoryViewProps> = ({ categories, onSelectCategory }) => {
    return (
        <div>
            <h2 className="text-2xl font-semibold mb-6 text-center text-[var(--tg-theme-hint-color)]">Выберите категорию</h2>
            <div className="grid grid-cols-1 gap-6">
                {categories.map(category => (
                    <div 
                        key={category.name} 
                        onClick={() => onSelectCategory(category)}
                        className="relative rounded-xl overflow-hidden cursor-pointer transform hover:scale-105 transition-transform duration-300 shadow-lg"
                    >
                        <img src={category.imageUrl} alt={category.name} className="w-full h-40 object-cover"/>
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                            <h3 className="text-white text-3xl font-bold tracking-wider">{category.name}</h3>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CategoryView;
