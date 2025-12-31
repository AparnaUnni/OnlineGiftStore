"use client";
import { createContext, useContext, useState,useEffect } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

    useEffect(() => {
    const saved = localStorage.getItem("cart");
    if (saved) {
      setCart(JSON.parse(saved));
    }
  }, []);

  // Save to localStorage when cart changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

    const addToCart = (item) => {
      setCart((prev) => {
        const existing = prev.find((p) => p.id === item.id);
      
        if (existing) {
          return prev.map((p) =>
            p.id === item.id
              ? { ...p, quantity: (p.quantity || 1) + (item.quantity || 1) }
              : p
          );
        }
        return [...prev, { ...item, quantity: item.quantity || 1 }];
      });
    };



    const removeFromCart = (id) => {
      setCart((prev) => prev.filter((item) => item.id !== id));
    };

    const updateQuantity = (id, quantity) => {
      setCart((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, quantity } : item
        )
      );
    };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity}}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const value = useContext(CartContext);
  if (!value) {
    throw new Error("Error");
  }
  return value;
}
