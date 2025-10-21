
import React, { useState, useEffect, useCallback } from 'react';
import { useTelegram } from './hooks/useTelegram';
import { allTeaCategories } from './constants';
import type { CartItem, Tea, TeaCategory } from './types';
import CategoryView from './components/CategoryView';
import ProductListView from './components/ProductListView';
import Cart from './components/Cart';
import { TeaIcon } from './components/Icons';

const App: React.FC = () => {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<TeaCategory | null>(null);
    const [isCartOpen, setIsCartOpen] = useState(false);

    const { tg, user } = useTelegram();

    const onMainButtonClick = useCallback(() => {
        if (!cart.length) return;
        
        const orderData = {
            items: cart.map(item => ({
                id: item.id,
                name: item.name,
                quantity: item.quantity,
                price: item.price,
            })),
            totalPrice: calculateTotal(),
            user: user,
        };

        tg.sendData(JSON.stringify(orderData));
    }, [cart, user, tg]);

    useEffect(() => {
        tg.ready();
    }, [tg]);

    const calculateTotal = () => {
        return cart.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    useEffect(() => {
        if (isCartOpen) {
            tg.MainButton.hide();
            return;
        }

        if (cart.length > 0) {
            tg.MainButton.setText(`Оформить заказ: ${calculateTotal().toLocaleString('ru-RU')} ₽`);
            tg.MainButton.show();
        } else {
            tg.MainButton.hide();
        }

        tg.onEvent('mainButtonClicked', onMainButtonClick);
        return () => {
            tg.offEvent('mainButtonClicked', onMainButtonClick);
        };
    }, [cart, tg, onMainButtonClick, isCartOpen]);


    const addToCart = (tea: Tea) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.id === tea.id);
            if (existingItem) {
                return prevCart.map(item =>
                    item.id === tea.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prevCart, { ...tea, quantity: 1 }];
        });
    };

    const updateQuantity = (teaId: number, newQuantity: number) => {
        if (newQuantity <= 0) {
            setCart(prevCart => prevCart.filter(item => item.id !== teaId));
        } else {
            setCart(prevCart =>
                prevCart.map(item =>
                    item.id === teaId ? { ...item, quantity: newQuantity } : item
                )
            );
        }
    };
    
    const handleSelectCategory = (category: TeaCategory) => {
        setSelectedCategory(category);
    };

    const handleBack = () => {
        setSelectedCategory(null);
    };

    const handleCheckout = () => {
        setIsCartOpen(false);
        onMainButtonClick();
    }
    
    return (
        <div className="bg-[var(--tg-theme-bg-color)] text-[var(--tg-theme-text-color)] min-h-screen font-sans">
            <header className="p-4 sticky top-0 bg-[var(--tg-theme-secondary-bg-color)] shadow-md z-10 text-center">
                 <h1 className="text-2xl font-bold flex items-center justify-center gap-2">
                    <TeaIcon />
                    Чайная Лавка
                </h1>
            </header>
            
            <main className="p-4 pb-32">
                {!selectedCategory ? (
                    <CategoryView categories={allTeaCategories} onSelectCategory={handleSelectCategory} />
                ) : (
                    <ProductListView 
                        category={selectedCategory} 
                        onBack={handleBack}
                        cart={cart}
                        addToCart={addToCart}
                        updateQuantity={updateQuantity}
                    />
                )}
            </main>

            <Cart 
                cart={cart}
                isOpen={isCartOpen}
                setIsOpen={setIsCartOpen}
                updateQuantity={updateQuantity}
                onCheckout={handleCheckout}
            />
        </div>
    );
};

export default App;
