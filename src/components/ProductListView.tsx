import React from 'react';
import type { TeaCategory, Tea, CartItem } from '../types';
import ProductCard from './ProductCard';
import { ArrowLeftIcon } from './Icons';

interface ProductListViewProps {
    category: TeaCategory;
    onBack: () => void;
    cart: CartItem[];
    addToCart: (tea: Tea) => void;
    updateQuantity: (teaId: number, newQuantity: number) => void;
}

const ProductListView: React.FC<ProductListViewProps> = ({ category, onBack, cart, addToCart, updateQuantity }) => {
    return (
        <div>
            <button 
                onClick={onBack} 
                className="flex items-center gap-2 mb-6 text-[var(--tg-theme-link-color)] hover:opacity-80 transition-opacity"
            >
                <ArrowLeftIcon />
                <span>Назад к категориям</span>
            </button>
            <h2 className="text-3xl font-bold mb-8 text-center">{category.name}</h2>
            <div className="space-y-6">
                {category.teas.map(tea => (
                    <ProductCard 
                        key={tea.id}
                        tea={tea}
                        cartItem={cart.find(item => item.id === tea.id)}
                        onAddToCart={addToCart}
                        onUpdateQuantity={updateQuantity}
                    />
                ))}
            </div>
        </div>
    );
};

export default ProductListView;
