// client/src/app/orders/[id]/page.jsx

'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { 
    ArrowLeft, Package, MapPin, CreditCard, 
    CheckCircle, Clock, Truck, XCircle, AlertCircle 
} from 'lucide-react';

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}`;

const statusSteps = ['confirmed', 'processing', 'shipped', 'delivered'];

export default function OrderDetailsPage() {
    const router = useRouter();
    const params = useParams();
    const searchParams = useSearchParams();
    const isSuccess = searchParams.get('success') === 'true';
    
    const { isAuthenticated, loading: authLoading } = useAuth();
    
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [cancelling, setCancelling] = useState(false);

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push('/');
        }
    }, [authLoading, isAuthenticated, router]);

    useEffect(() => {
        if (isAuthenticated && params.id) {
            fetchOrder();
        }
    }, [isAuthenticated, params.id]);

    const fetchOrder = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/orders/${params.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            
            if (data.success) {
                setOrder(data.data.order);
            } else {
                setError(data.error);
            }
        } catch (err) {
            setError('Failed to load order');
        } finally {
            setLoading(false);
        }
    };

    const handleCancelOrder = async () => {
        if (!confirm('Are you sure you want to cancel this order?')) return;

        setCancelling(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/orders/${params.id}/cancel`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            
            if (data.success) {
                setOrder(data.data.order);
            } else {
                alert(data.error);
            }
        } catch (err) {
            alert('Failed to cancel order');
        } finally {
            setCancelling(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getCurrentStep = () => {
        if (order?.orderStatus === 'cancelled') return -1;
        return statusSteps.indexOf(order?.orderStatus || 'confirmed');
    };

    if (authLoading || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center pt-20">
                <AlertCircle className="h-16 w-16 text-gray-300 mb-4" />
                <h2 className="text-xl font-semibold text-gray-700 mb-2">{error || 'Order not found'}</h2>
                <Link href="/orders" className="text-indigo-600 hover:underline">
                    View all orders →
                </Link>
            </div>
        );
    }

    const currentStep = getCurrentStep();

    return (
        <div className="min-h-screen bg-gray-50 pt-20 pb-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Back Button */}
                <Link 
                    href="/orders"
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Orders
                </Link>

                {/* Success Message */}
                {isSuccess && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-center gap-3">
                        <CheckCircle className="h-6 w-6" />
                        <div>
                            <p className="font-medium">Order placed successfully!</p>
                            <p className="text-sm">Thank you for your order. We'll send you updates via email.</p>
                        </div>
                    </div>
                )}

                {/* Order Header */}
                <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                    <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 mb-1">
                                Order #{order.orderNumber}
                            </h1>
                            <p className="text-gray-500">
                                Placed on {formatDate(order.createdAt)}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-2xl font-bold text-gray-900">
                                AED{order.totalAmount.toFixed(2)}
                            </p>
                            {order.orderStatus !== 'cancelled' && !['shipped', 'delivered'].includes(order.orderStatus) && (
                                <button
                                    onClick={handleCancelOrder}
                                    disabled={cancelling}
                                    className="mt-2 text-sm text-red-600 hover:text-red-700"
                                >
                                    {cancelling ? 'Cancelling...' : 'Cancel Order'}
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Order Status Timeline */}
                    {order.orderStatus === 'cancelled' ? (
                        <div className="flex items-center gap-3 p-4 bg-red-50 rounded-lg">
                            <XCircle className="h-6 w-6 text-red-500" />
                            <div>
                                <p className="font-medium text-red-700">Order Cancelled</p>
                                <p className="text-sm text-red-600">This order has been cancelled</p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-between">
                            {statusSteps.map((step, idx) => {
                                const isCompleted = idx <= currentStep;
                                const isCurrent = idx === currentStep;
                                
                                return (
                                    <div key={step} className="flex-1 flex items-center">
                                        <div className="flex flex-col items-center">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                                isCompleted 
                                                    ? 'bg-green-500 text-white' 
                                                    : 'bg-gray-200 text-gray-400'
                                            }`}>
                                                {isCompleted ? (
                                                    <CheckCircle className="h-5 w-5" />
                                                ) : (
                                                    <Clock className="h-5 w-5" />
                                                )}
                                            </div>
                                            <p className={`mt-2 text-xs text-center ${
                                                isCurrent ? 'font-medium text-green-600' : 'text-gray-500'
                                            }`}>
                                                {step.charAt(0).toUpperCase() + step.slice(1)}
                                            </p>
                                        </div>
                                        {idx < statusSteps.length - 1 && (
                                            <div className={`flex-1 h-1 mx-2 ${
                                                idx < currentStep ? 'bg-green-500' : 'bg-gray-200'
                                            }`} />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    
                    {/* Order Items */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <Package className="h-5 w-5 text-gray-400" />
                            Items ({order.items.length})
                        </h2>
                        <div className="space-y-4">
                            {order.items.map((item, idx) => (
                                <div key={idx} className="flex gap-4">
                                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                                        {item.imageSrc ? (
                                            <img
                                                src={item.imageSrc}
                                                alt={item.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <Package className="h-6 w-6 text-gray-400" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-900">{item.name}</p>
                                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                    </div>
                                    <p className="font-medium">
                                        AED{(item.price * item.quantity).toFixed(2)}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* Order Totals */}
                        <div className="border-t mt-4 pt-4 space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Subtotal</span>
                                <span>AED{order.subtotal.toFixed(2)}</span>
                            </div>
                            {/* <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Shipping</span>
                                <span>{order.shippingCost === 0 ? 'Free' : `AED${order.shippingCost.toFixed(2)}`}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Tax</span>
                                <span>AED{order.tax.toFixed(2)}</span>
                            </div> */}
                            <div className="flex justify-between text-base font-semibold pt-2 border-t">
                                <span>Total</span>
                                <span>AED{order.totalAmount.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Shipping & Payment Info */}
                    <div className="space-y-6">
                        {/* Shipping Address */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <MapPin className="h-5 w-5 text-gray-400" />
                                Shipping Address
                            </h2>
                            <div className="text-gray-600">
                                <p className="font-medium text-gray-900">{order.shippingAddress.fullName}</p>
                                <p>{order.shippingAddress.address}</p>
                                
                                <p className="mt-2">Phone: {order.shippingAddress.phone}</p>
                            </div>
                        </div>

                        {/* Payment Info */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <CreditCard className="h-5 w-5 text-gray-400" />
                                Payment Info
                            </h2>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Method</span>
                                    <span className="font-medium">
                                        {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Status</span>
                                    <span className={`font-medium ${
                                        order.paymentStatus === 'paid' ? 'text-green-600' : 'text-yellow-600'
                                    }`}>
                                        {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Order Note */}
                        {order.orderNote && (
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <h2 className="text-lg font-semibold mb-2">Order Note</h2>
                                <p className="text-gray-600">{order.orderNote}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}