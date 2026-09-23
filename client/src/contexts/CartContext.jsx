// client/src/contexts/CartContext.jsx

"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "./AuthContext";

const API_URL = "http://localhost:4000/api";
const CartContext = createContext(null);

export function CartProvider({ children }) {
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(false);
    const { user, isAuthenticated } = useAuth();

    // Load cart on mount or when user changes
    useEffect(() => {
        if (isAuthenticated) {
            fetchCartFromServer();
        } else {
            const saved = localStorage.getItem("cart");
            if (saved) {
                try {
                    setCart(JSON.parse(saved));
                } catch (e) {
                    setCart([]);
                }
            }
        }
    }, [isAuthenticated, user]);

    // Save to localStorage when cart changes (for non-logged in users)
    useEffect(() => {
        if (!isAuthenticated) {
            localStorage.setItem("cart", JSON.stringify(cart));
        }
    }, [cart, isAuthenticated]);

    // Fetch cart from server
    const fetchCartFromServer = async () => {
        const token = localStorage.getItem("token");
        if (!token) return;

        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/cart`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            
            if (data.success) {
                setCart(data.data.cart || []);
            }
        } catch (error) {
            console.error("Error fetching cart:", error);
        } finally {
            setLoading(false);
        }
    };

    // Sync cart to server
    const syncCartToServer = async (cartItems) => {
        const token = localStorage.getItem("token");
        if (!token) return;

        try {
            await fetch(`${API_URL}/cart`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ cart: cartItems }),
            });
        } catch (error) {
            console.error("Error syncing cart:", error);
        }
    };

    // Helper function to get item ID (handles both _id and id)
    const getItemId = (item) => {
        return item._id || item.id || item.productId;
    };

    // Add to cart
    const addToCart = useCallback((item) => {
        const itemId = getItemId(item);
        
        if (!itemId) {
            console.error("Item has no valid ID:", item);
            return;
        }

        setCart((prev) => {
            // Check if item already exists in cart
            const existingIndex = prev.findIndex((p) => {
                const pId = getItemId(p);
                return pId === itemId;
            });

            let newCart;

            if (existingIndex !== -1) {
                // Item exists - update quantity
                newCart = prev.map((p, index) => {
                    if (index === existingIndex) {
                        return {
                            ...p,
                            quantity: (p.quantity || 1) + (item.quantity || 1)
                        };
                    }
                    return p;
                });
                console.log("✅ Updated quantity for:", item.name);
            } else {
                // New item - add to cart
                const newItem = {
                    ...item,
                    id: itemId,           // Normalize to 'id'
                    productId: itemId,    // Also keep productId for server
                    quantity: item.quantity || 1
                };
                newCart = [...prev, newItem];
                console.log("✅ Added new item:", item.name);
            }

            // Sync to server if logged in
            if (isAuthenticated) {
                syncCartToServer(newCart);
            }

            return newCart;
        });
    }, [isAuthenticated]);

    // Remove from cart
    const removeFromCart = useCallback((itemId) => {
        setCart((prev) => {
            const newCart = prev.filter((item) => {
                const id = getItemId(item);
                return id !== itemId;
            });
            
            if (isAuthenticated) {
                syncCartToServer(newCart);
            }
            
            return newCart;
        });
    }, [isAuthenticated]);

    // Update quantity
    const updateQuantity = useCallback((itemId, quantity) => {
        if (quantity < 1) return;
        
        setCart((prev) => {
            const newCart = prev.map((item) => {
                const id = getItemId(item);
                if (id === itemId) {
                    return { ...item, quantity };
                }
                return item;
            });
            
            if (isAuthenticated) {
                syncCartToServer(newCart);
            }
            
            return newCart;
        });
    }, [isAuthenticated]);

    // Clear cart
    const clearCart = useCallback(() => {
        setCart([]);
        
        if (isAuthenticated) {
            const token = localStorage.getItem("token");
            if (token) {
                fetch(`${API_URL}/cart`, {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }).catch(console.error);
            }
        } else {
            localStorage.removeItem("cart");
        }
    }, [isAuthenticated]);

    // Calculate totals
    const getCartTotals = useCallback(() => {
        const subtotal = cart.reduce(
            (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
            0
        );
        // const shippingCost = subtotal > 500 ? 0 : 50;
        // const tax = subtotal * 0.18;
        const total = subtotal ;

        return {
            subtotal,
            
            total,
            itemCount: cart.reduce((sum, item) => sum + (item.quantity || 1), 0),
        };
    }, [cart]);

    return (
        <CartContext.Provider
            value={{
                cart,
                loading,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                getCartTotals,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const value = useContext(CartContext);
    if (!value) {
        throw new Error("useCart must be used within CartProvider");
    }
    return value;
}