import React, { useMemo } from 'react';
import type { CartItem } from '../types';
import { CartIcon, CloseIcon, MinusIcon, PlusIcon, TrashIcon } from './Icons';

interface CartProps {
    cart: CartItem[];
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    updateQuantity: (teaId: number, newQuantity: number) => void;
    onCheckout: () => void;
}

const Cart: React.FC<CartProps> = ({ cart, isOpen, setIsOpen, updateQuantity, onCheckout }) => {
    const totalItems = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);
    const totalPrice = useMemo(() => cart.reduce((sum, item) => sum + item.price * item.quantity, 0), [cart]);

    if (totalItems === 0 && !isOpen) return null;

    return (
        <>
            {/* Floating Cart Button */}
            {!isOpen && (
                <div className="fixed bottom-6 right-6 z-40">
                    <button 
                        onClick={() => setIsOpen(true)}
                        className="bg-[var(--tg-theme-button-color)] text-[var(--tg-theme-button-text-color)] w-16 h-16 rounded-full flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform"
                    >
                        <CartIcon />
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">{totalItems}</span>
                    </button>
                </div>
            )}
            
            {/* Cart Modal */}
            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end">
                    <div className="bg-[var(--tg-theme-secondary-bg-color)] w-full rounded-t-2xl p-4 max-h-[80vh] flex flex-col">
                        <div className="flex justify-between items-center mb-4 pb-2 border-b border-[var(--tg-theme-hint-color)] border-opacity-20">
                            <h2 className="text-2xl font-bold">Корзина</h2>
                            <button onClick={() => setIsOpen(false)} className="text-[var(--tg-theme-hint-color)]">
                                <CloseIcon />
                            </button>
                        </div>
                        
                        {cart.length === 0 ? (
                            <p className="text-center text-[var(--tg-theme-hint-color)] py-10">Ваша корзина пуста</p>
                        ) : (
                            <>
                                <div className="flex-1 overflow-y-auto pr-2">
                                    {cart.map(item => (
                                        <div key={item.id} className="flex items-center gap-4 mb-4">
                                            <img src={item.imageUrl} alt={item.name} className="w-16 h-16 object-cover rounded-md"/>
                                            <div className="flex-1">
                                                <p className="font-semibold">{item.name}</p>
                                                <p className="text-sm text-[var(--tg-theme-hint-color)]">{item.price.toLocaleString('ru-RU')} ₽</p>
                                            </div>
                                            <div className="flex items-center gap-2 bg-[var(--tg-theme-bg-color)] rounded-lg">
                                                <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-2">
                                                    {item.quantity === 1 ? <TrashIcon /> : <MinusIcon />}
                                                </button>
                                                <span>{item.quantity}</span>
                                                <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-2"><PlusIcon /></button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                
                                <div className="mt-auto pt-4 border-t border-[var(--tg-theme-hint-color)] border-opacity-20">
                                    <div className="flex justify-between text-xl font-bold mb-4">
                                        <span>Итого:</span>
                                        <span>{totalPrice.toLocaleString('ru-RU')} ₽</span>
                                    </div>
                                    <button 
                                        onClick={onCheckout}
                                        className="w-full bg-[var(--tg-theme-button-color)] text-[var(--tg-theme-button-text-color)] font-bold py-3 px-4 rounded-lg text-lg"
                                    >
                                        Оформить заказ
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default Cart;
