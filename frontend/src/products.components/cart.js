import React, { createContext, useState, useEffect, useContext } from "react";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(() => {
        const storedCart = localStorage.getItem("cart");
        try {
            return storedCart ? JSON.parse(storedCart) : [];
        } catch (error) {
            console.error("Error parsing cart from localStorage:", error);
            return [];
        }
    });

    //usamos el efecto del carro

    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product) => {
        setCart(prevCart => {
            const productIndex = prevCart.findIndex(item => item._id === product._id);

            if (productIndex !== -1) {
                return prevCart.map((item, _id) =>
                    _id === productIndex
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            } else {
                return [...prevCart, { ...product, quantity: 1 }];
            }
        });
    };

    const removeFromCart = (productId) => {
      setCart(prevCart => prevCart.filter(item => item._id !== productId));
  };


    const value = { cart, addToCart, removeFromCart, setCart }; 

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;


};