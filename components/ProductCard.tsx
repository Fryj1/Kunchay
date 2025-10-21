
import React, { useState } from 'react';
import type { Tea, CartItem } from '../types';
import { MinusIcon, PlusIcon } from './Icons';


interface ProductCardProps {
    tea: Tea;
    cartItem?: CartItem;
    onAddToCart: (tea: Tea) => void;
    onUpdateQuantity: (teaId: number, newQuantity: number) => void;
}

const QuantitySelector: React.FC<{
    quantity: number;
    onUpdate: (newQuantity: number) => void;
}> = ({ quantity, onUpdate }) => {
    return (
        <div className="flex items-center justify-center bg-[var(--tg-theme-secondary-bg-color)] rounded-lg">
            <button 
                onClick={() => onUpdate(quantity - 1)}
                className="px-4 py-2 text-lg font-bold text-[var(--tg-theme-button-color)]"
            >
                <MinusIcon />
            </button>
            <span className="px-4 text-lg font-semibold">{quantity}</span>
            <button 
                onClick={() => onUpdate(quantity + 1)}
                className="px-4 py-2 text-lg font-bold text-[var(--tg-theme-button-color)]"
            >
                <PlusIcon />
            </button>
        </div>
    );
};

const ProductCard: React.FC<ProductCardProps> = ({ tea, cartItem, onAddToCart, onUpdateQuantity }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="bg-[var(--tg-theme-secondary-bg-color)] rounded-xl shadow-lg overflow-hidden p-4 flex flex-col gap-4">
            <div className="flex gap-4">
                <img src={tea.imageUrl} alt={tea.name} className="w-24 h-24 object-cover rounded-lg" />
                <div className="flex-1">
                    <h3 className="text-lg font-bold">{tea.name} <span className="text-sm font-normal text-[var(--tg-theme-hint-color)]">Арт({tea.id})</span></h3>
                    <p className="text-xl font-semibold text-[var(--tg-theme-button-color)] mt-1">{tea.price.toLocaleString('ru-RU')} ₽</p>
                </div>
            </div>
            
            <div className="text-[var(--tg-theme-hint-color)] text-sm">
                <div className={isExpanded ? 'space-y-2' : 'line-clamp-2'}>
                    <p><strong className="text-[var(--tg-theme-text-color)]">Сырье:</strong> {tea.rawMaterial}</p>
                    <p><strong className="text-[var(--tg-theme-text-color)]">Выдержка:</strong> {tea.aging}</p>
                    <p><strong className="text-[var(--tg-theme-text-color)]">Букет:</strong> {tea.bouquet}</p>
                    <p><strong className="text-[var(--tg-theme-text-color)]">Послевкусие:</strong> {tea.aftertaste}</p>
                </div>
                <button onClick={() => setIsExpanded(!isExpanded)} className="text-[var(--tg-theme-link-color)] mt-2">
                    {isExpanded ? 'Скрыть' : 'Подробнее...'}
                </button>
            </div>
            
            <div className="mt-2">
                {cartItem ? (
                    <QuantitySelector 
                        quantity={cartItem.quantity}
                        onUpdate={(newQuantity) => onUpdateQuantity(tea.id, newQuantity)}
                    />
                ) : (
                    <button 
                        onClick={() => onAddToCart(tea)}
                        className="w-full bg-[var(--tg-theme-button-color)] text-[var(--tg-theme-button-text-color)] font-bold py-3 px-4 rounded-lg transition-transform transform hover:scale-105"
                    >
                        Добавить в корзину
                    </button>
                )}
            </div>
        </div>
    );
};

export default ProductCard;
