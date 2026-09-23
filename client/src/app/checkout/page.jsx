// client/src/app/checkout/page.jsx

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { ArrowLeft, MapPin, CreditCard, Truck, Check, AlertCircle } from 'lucide-react';

const API_URL = 'http://localhost:4000/api';

export default function CheckoutPage() {
    const router = useRouter();
    const { user, isAuthenticated, loading: authLoading } = useAuth();
    const { cart, getCartTotals, clearCart } = useCart();
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [orderNote, setOrderNote] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('cod');
    const [useProfileAddress, setUseProfileAddress] = useState(true);
    
    const [shippingAddress, setShippingAddress] = useState({
        fullName: '',
        phone: '',
        address: '',
        
    });

    const { subtotal, total, itemCount } = getCartTotals();

    // Redirect if not logged in
    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push('/');
        }
    }, [authLoading, isAuthenticated, router]);

    // Load order note from localStorage
    useEffect(() => {
        const savedNote = localStorage.getItem('orderNote');
        if (savedNote) {
            setOrderNote(savedNote);
            localStorage.removeItem('orderNote');
        }
    }, []);

    // Load user address
    useEffect(() => {
        if (user && useProfileAddress) {
            setShippingAddress({
                fullName: user.fullName || '',
                phone: user.phone || '',
                address: user.address || '',
               
            });
        }
    }, [user, useProfileAddress]);

    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        setShippingAddress(prev => ({ ...prev, [name]: value }));
    };

    const validateAddress = () => {
        const required = ['fullName', 'phone', 'address'];
        for (const field of required) {
            if (!shippingAddress[field]?.trim()) {
                return `Please enter ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`;
            }
        }
        if (shippingAddress.phone.length < 10) {
            return 'Please enter a valid phone number';
        }
       
        return null;
    };

    const handlePlaceOrder = async () => {
        // Validate
        if (cart.length === 0) {
            setError('Your cart is empty');
            return;
        }

        const addressError = validateAddress();
        if (addressError) {
            setError(addressError);
            return;
        }

        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            
            const response = await fetch(`${API_URL}/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    items: cart,
                    shippingAddress,
                    orderNote,
                    paymentMethod,
                    subtotal,
                    
                    totalAmount: total,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to place order');
            }

            // Clear cart
            clearCart();

            // Redirect to success page
            router.push(`/orders/${data.data.order.id}?success=true`);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (!isAuthenticated || cart.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center pt-20">
                <AlertCircle className="h-16 w-16 text-gray-300 mb-4" />
                <h2 className="text-xl font-semibold text-gray-700 mb-2">
                    {!isAuthenticated ? 'Please login to checkout' : 'Your cart is empty'}
                </h2>
                <Link href="/HomePageComponent" className="text-indigo-600 hover:underline">
                    Continue Shopping →
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-20 pb-12">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Back Button */}
                <Link 
                    href="/HomePageComponent"
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Continue Shopping
                </Link>

                <h1 className="text-2xl font-bold text-gray-900 mb-8">Checkout</h1>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-2">
                        <AlertCircle className="h-5 w-5" />
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Left Column - Forms */}
                    <div className="lg:col-span-2 space-y-6">
                        
                        {/* Shipping Address */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                                    <MapPin className="h-5 w-5 text-indigo-600" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold">Shipping Address</h2>
                                    <p className="text-sm text-gray-500">Where should we deliver?</p>
                                </div>
                            </div>

                            {/* Use Profile Address Toggle */}
                            {user?.address && (
                                <div className="mb-4">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={useProfileAddress}
                                            onChange={(e) => setUseProfileAddress(e.target.checked)}
                                            className="w-4 h-4 text-indigo-600 rounded"
                                        />
                                        <span className="text-sm text-gray-600">
                                            Use my profile address
                                        </span>
                                    </label>
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={shippingAddress.fullName}
                                        onChange={handleAddressChange}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Phone Number *
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={shippingAddress.phone}
                                        onChange={handleAddressChange}
                                        placeholder="+971 123456789"
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                                        required
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Street Address *
                                    </label>
                                    <textarea
                                        name="address"
                                        value={shippingAddress.address}
                                        onChange={handleAddressChange}
                                        rows={2}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none"
                                        required
                                    />
                                </div>
                                
                  
                            </div>
                        </div>

                        {/* Order Note */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h3 className="text-lg font-semibold mb-4">Order Notes (Optional)</h3>
                            <textarea
                                value={orderNote}
                                onChange={(e) => setOrderNote(e.target.value)}
                                rows={3}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none"
                                placeholder="Special instructions for your order..."
                            />
                        </div>

                        {/* Payment Method */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                    <CreditCard className="h-5 w-5 text-green-600" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold">Payment Method</h2>
                                    <p className="text-sm text-gray-500">How would you like to pay?</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-colors ${
                                    paymentMethod === 'cod' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-gray-300'
                                }`}>
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="cod"
                                        checked={paymentMethod === 'cod'}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        className="w-4 h-4 text-indigo-600"
                                    />
                                    <div className="flex-1">
                                        <p className="font-medium">Cash on Delivery</p>
                                        <p className="text-sm text-gray-500">Pay when you receive</p>
                                    </div>
                                    <Truck className="h-5 w-5 text-gray-400" />
                                </label>

                                <label className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-colors ${
                                    paymentMethod === 'online' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-gray-300'
                                }`}>
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="online"
                                        checked={paymentMethod === 'online'}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        className="w-4 h-4 text-indigo-600"
                                    />
                                    <div className="flex-1">
                                        <p className="font-medium">GPay</p>
                                        <p className="text-sm text-gray-500">+971 975326789</p>
                                    </div>
                                    <CreditCard className="h-5 w-5 text-gray-400" />
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
                            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

                            {/* Cart Items */}
                            <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                                {cart.map((item, idx) => (
                                    <div key={item.id || idx} className="flex gap-3">
                                        <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                                            {item.imageSrc && (
                                                <img
                                                    src={item.imageSrc}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-sm truncate">{item.name}</p>
                                            <p className="text-sm text-gray-500">
                                                Qty: {item.quantity || 1}
                                            </p>
                                        </div>
                                        <p className="font-medium text-sm">
                                            AED{(item.price * (item.quantity || 1)).toFixed(2)}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            {/* Totals */}
                            <div className="border-t pt-4 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Subtotal ({itemCount} items)</span>
                                    <span>AED{subtotal.toFixed(2)}</span>
                                </div>
                                {/* <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Shipping</span>
                                    <span className={shippingCost === 0 ? 'text-green-600' : ''}>
                                        {shippingCost === 0 ? 'Free' : `AED${shippingCost.toFixed(2)}`}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Tax (18% GST)</span>
                                    <span>AED{tax.toFixed(2)}</span>
                                </div> */}
                                <div className="flex justify-between text-lg font-semibold pt-2 border-t">
                                    <span>Total</span>
                                    <span>AED{total.toFixed(2)}</span>
                                </div>
                            </div>

                            {/* Place Order Button */}
                            <button
                                onClick={handlePlaceOrder}
                                disabled={loading}
                                className="w-full mt-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <Check className="h-5 w-5" />
                                        Place Order - AED{total.toFixed(2)}
                                    </>
                                )}
                            </button>

                            <p className="text-xs text-gray-500 text-center mt-4">
                                By placing order, you agree to our Terms & Conditions
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}