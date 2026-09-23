// client/src/components/ProductCart.jsx

"use client";

import { X, Trash2, ShoppingBag, Minus, Plus } from 'lucide-react';
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProductCart({ open, setOpen }) {
    const router = useRouter();
    const { cart, removeFromCart, updateQuantity, getCartTotals } = useCart();
    const { isAuthenticated } = useAuth();
    
    const [comment, setComment] = useState("");
    
    const { subtotal, shippingCost, itemCount } = getCartTotals();

    // Helper to get item ID
    const getItemId = (item) => item._id || item.id || item.productId;

    const handleCheckout = () => {
        if (!isAuthenticated) {
            localStorage.setItem("orderNote", comment);
            alert("Please login to checkout");
            return;
        }
        
        localStorage.setItem("orderNote", comment);
        setOpen(false);
        router.push("/checkout");
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black/40 transition-opacity duration-300 z-40 ${
                    open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                }`}
                onClick={() => setOpen(false)}
            />

            {/* Cart Sidebar */}
            <aside
                className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-xl transform transition-transform duration-300 z-50 flex flex-col
                ${open ? "translate-x-0" : "translate-x-full"}`}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b bg-white">
                    <div className="flex items-center gap-2">
                        <ShoppingBag className="h-5 w-5 text-indigo-600" />
                        <h2 className="text-lg font-semibold">Your Cart ({itemCount})</h2>
                    </div>
                    <button
                        onClick={() => setOpen(false)}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto p-4">
                    {cart.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                            <ShoppingBag className="h-16 w-16 text-gray-300 mb-4" />
                            <p className="text-gray-500 mb-2">Your cart is empty</p>
                            <button
                                onClick={() => setOpen(false)}
                                className="text-indigo-600 hover:text-indigo-700 font-medium"
                            >
                                Continue Shopping →
                            </button>
                        </div>
                    ) : (
                        <ul className="space-y-4">
                            {cart.map((product) => {
                                const itemId = getItemId(product);
                                
                                return (
                                    <li key={itemId} className="flex gap-4 p-3 bg-gray-50 rounded-lg">
                                        {/* Image */}
                                        <div className="w-20 h-20 shrink-0 overflow-hidden rounded-lg border bg-white">
                                            {product.imageSrc && (
                                                <img
                                                    src={product.imageSrc}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            )}
                                        </div>

                                        {/* Details */}
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-medium text-gray-900 truncate">
                                                {product.name}
                                            </h3>
                                            <p className="text-sm text-gray-500 mt-0.5">
                                                AED{product.price} × {product.quantity || 1}
                                            </p>
                                            
                                            <div className="flex items-center justify-between mt-2">
                                                {/* Quantity Controls */}
                                                <div className="flex items-center gap-1 bg-white rounded-lg border">
                                                    <button
                                                        onClick={() => {
                                                            const newQty = (product.quantity || 1) - 1;
                                                            if (newQty < 1) {
                                                                removeFromCart(itemId);
                                                            } else {
                                                                updateQuantity(itemId, newQty);
                                                            }
                                                        }}
                                                        className="p-1.5 text-gray-500 hover:text-gray-700"
                                                    >
                                                        <Minus className="w-4 h-4" />
                                                    </button>
                                                    <span className="px-3 py-1 text-sm font-medium min-w-[2rem] text-center">
                                                        {product.quantity || 1}
                                                    </span>
                                                    <button
                                                        onClick={() => updateQuantity(itemId, (product.quantity || 1) + 1)}
                                                        className="p-1.5 text-gray-500 hover:text-gray-700"
                                                    >
                                                        <Plus className="w-4 h-4" />
                                                    </button>
                                                </div>

                                                {/* Price & Delete */}
                                                <div className="flex items-center gap-2">
                                                    <span className="font-semibold text-gray-900">
                                                        AED{(product.price * (product.quantity || 1)).toFixed(2)}
                                                    </span>
                                                    <button
                                                        onClick={() => removeFromCart(itemId)}
                                                        className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>

                {/* Order Note */}
                {cart.length > 0 && (
                    <div className="border-t p-4 bg-gray-50">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Order Note (Optional)
                        </label>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            rows={2}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                            placeholder="E.g., Write 'Happy Birthday' on cake..."
                        />
                    </div>
                )}

                {/* Footer */}
                {cart.length > 0 && (
                    <div className="border-t p-4 bg-white space-y-4">
                        {/* Subtotal */}
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm text-gray-500">
                                <span>Subtotal</span>
                                <span>AED{subtotal.toFixed(2)}</span>
                            </div>
                            {/* <div className="flex justify-between text-sm text-gray-500">
                                <span>Shipping</span>
                                <span>{shippingCost === 0 ? "Free" : `AED${shippingCost}`}</span>
                            </div> */}
                            <div className="flex justify-between text-base font-semibold text-gray-900 pt-2 border-t">
                                <span>Total</span>
                                <span>AED{(subtotal ).toFixed(2)}</span>
                            </div>
                        </div>

                        {/* Checkout Button */}
                        <button
                            onClick={handleCheckout}
                            className="w-full py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                            {isAuthenticated ? "Proceed to Checkout" : "Login to Checkout"}
                        </button>

                        {/* Continue Shopping */}
                        <button
                            onClick={() => setOpen(false)}
                            className="w-full py-2 text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                        >
                            Continue Shopping →
                        </button>
                    </div>
                )}
            </aside>
        </>
    );
}