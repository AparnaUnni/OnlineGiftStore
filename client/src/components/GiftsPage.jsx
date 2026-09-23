// client/src/components/GiftPage.jsx

"use client";
import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { ShoppingCart, Trash2, Check, Plus, Minus } from "lucide-react";

const GiftsPage = ({ title, items }) => {
    const { addToCart, removeFromCart, updateQuantity, cart } = useCart();

    // Helper to get item ID
    const getItemId = (item) => item._id || item.id;

    // Get cart item if exists
    const getCartItem = (item) => {
        const itemId = getItemId(item);
        return cart.find((p) => (p._id || p.id || p.productId) === itemId);
    };

    // Handle add to cart
    const handleAddToCart = (item) => {
        const itemId = getItemId(item);
        addToCart({
            ...item,
            id: itemId,
        });
    };

    // Handle remove from cart
    const handleRemoveFromCart = (item) => {
        const itemId = getItemId(item);
        removeFromCart(itemId);
    };

    return (
        <div className="bg-white">
            <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
                <h2 className="text-center mb-10 text-3xl font-bold">{title}</h2>

                <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
                    {Array.isArray(items) &&
                        items.map((item) => {
                            const itemId = getItemId(item);
                            const cartItem = getCartItem(item);
                            const isInCart = !!cartItem;

                            return (
                                <div key={itemId} className="group">
                                    {/* Image */}
                                    <div className="relative overflow-hidden rounded-lg bg-gray-200">
                                        <img
                                            alt={item.imageAlt || item.name}
                                            src={item.imageSrc}
                                            className="aspect-square w-full object-cover group-hover:opacity-75 transition-opacity"
                                        />
                                        {/* Cart badge showing quantity */}
                                        {isInCart && (
                                            <div className="absolute top-2 right-2 bg-indigo-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                                                {cartItem.quantity} in cart
                                            </div>
                                        )}
                                    </div>

                                    {/* Details */}
                                    <h3 className="mt-4 text-sm text-gray-700">{item.name}</h3>
                                    <p className="mt-1 text-lg font-medium text-gray-900">
                                        AED {item.price}
                                    </p>

                                    {/* Add/Remove Button */}
                                    {isInCart ? (
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveFromCart(item)}
                                            className="mt-4 w-full rounded-lg py-2.5 text-center text-sm font-medium transition-all flex items-center justify-center gap-2 bg-red-50 text-red-600 hover:bg-red-100 border border-red-200"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                            Remove from Cart
                                        </button>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() => handleAddToCart(item)}
                                            className="mt-4 w-full rounded-lg py-2.5 text-center text-sm font-medium transition-all flex items-center justify-center gap-2 bg-gray-100 text-gray-900 hover:bg-gray-200"
                                        >
                                            <ShoppingCart className="w-4 h-4" />
                                            Add to Cart
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                </div>
            </div>
        </div>
    );
};

export default GiftsPage;