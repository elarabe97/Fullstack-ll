import { createContext, useState, useEffect, useContext } from 'react';
import { useUser } from './UserContext';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [items, setItems] = useState([]);
    const { user } = useUser();

    useEffect(() => {
        const storedCart = localStorage.getItem('lug_cart');
        if (storedCart) {
            setItems(JSON.parse(storedCart));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('lug_cart', JSON.stringify(items));
    }, [items]);

    const add = (product, qty = 1) => {
        setItems(prev => {
            const existing = prev.find(item => item.code === product.code);
            if (existing) {
                return prev.map(item =>
                    item.code === product.code
                        ? { ...item, qty: item.qty + qty }
                        : item
                );
            }
            return [...prev, { ...product, qty }];
        });
    };

    const remove = (code) => {
        setItems(prev => prev.filter(item => item.code !== code));
    };

    const update = (code, qty) => {
        if (qty <= 0) {
            remove(code);
            return;
        }
        setItems(prev => prev.map(item =>
            item.code === code ? { ...item, qty } : item
        ));
    };

    const clear = () => setItems([]);

    const count = items.reduce((acc, item) => acc + item.qty, 0);

    const subtotal = items.reduce((acc, item) => acc + (item.price * item.qty), 0);
    const discountRate = user?.discount || 0;
    const discountAmount = Math.floor(subtotal * discountRate);
    const total = subtotal - discountAmount;
    const points = Math.floor(total / 1000);

    const value = {
        items,
        add,
        remove,
        update,
        clear,
        count,
        subtotal,
        discountAmount,
        total,
        points
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};
