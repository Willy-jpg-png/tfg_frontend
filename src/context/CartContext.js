import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
    const [cart, setCart] = useState([]);

    const generateItemKey = (product) => {
        const base = product.id;
        const addings = product.addings?.map((a) => a.id).sort().join(",") || "";
        return `${base}-${addings}`;
    };

    const addToCart = (newProduct) => {
        const newKey = generateItemKey(newProduct);
        setCart((prev) => {
            const existing = prev.find((item) => generateItemKey(item.product) === newKey);
            if (existing) {
                return prev.map((item) =>
                    generateItemKey(item.product) === newKey
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            } else {
                return [...prev, { product: newProduct, quantity: 1 }];
            }
        });
    };

    const decrementItem = (product) => {
        const key = generateItemKey(product);
        setCart((prev) =>
            prev
                .map((item) =>
                    generateItemKey(item.product) === key
                        ? { ...item, quantity: item.quantity - 1 }
                        : item
                )
                .filter((item) => item.quantity > 0)
        );
    };

    const removeItem = (product) => {
        const key = generateItemKey(product);
        setCart((prev) => prev.filter((item) => generateItemKey(item.product) !== key));
    };

    const clearCart = () => setCart([]);

    const getTotalItems = () =>
        cart.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <CartContext.Provider
            value={{
                cart,
                addToCart,
                decrementItem,
                removeItem,
                clearCart,
                getTotalItems,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => useContext(CartContext);
