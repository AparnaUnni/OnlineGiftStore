// client/src/app/orders/page.jsx

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, Package, Clock, CheckCircle, XCircle, Truck, Eye } from 'lucide-react';

const API_URL = '${process.env.NEXT_PUBLIC_API_URL}';

const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    processing: 'bg-purple-100 text-purple-800',
    shipped: 'bg-indigo-100 text-indigo-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
};

const statusIcons = {
    pending: Clock,
    confirmed: CheckCircle,
    processing: Package,
    shipped: Truck,
    delivered: CheckCircle,
    cancelled: XCircle,
};

export default function OrdersPage() {
    const router = useRouter();
    const { isAuthenticated, loading: authLoading } = useAuth();
    
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push('/');
        }
    }, [authLoading, isAuthenticated, router]);

    useEffect(() => {
        if (isAuthenticated) {
            fetchOrders();
        }
    }, [isAuthenticated]);

    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/orders`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            
            if (data.success) {
                setOrders(data.data.orders);
            } else {
                setError(data.error);
            }
        } catch (err) {
            setError('Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    if (authLoading || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-20 pb-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Back Button */}
                <Link 
                    href="/HomePageComponent"
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Home
                </Link>

                <h1 className="text-2xl font-bold text-gray-900 mb-8">My Orders</h1>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                        {error}
                    </div>
                )}

                {orders.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                        <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <h2 className="text-xl font-semibold text-gray-700 mb-2">No orders yet</h2>
                        <p className="text-gray-500 mb-6">Start shopping to see your orders here</p>
                        <Link
                            href="/HomePageComponent"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700"
                        >
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order) => {
                            const StatusIcon = statusIcons[order.orderStatus] || Package;
                            
                            return (
                                <div key={order._id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                                    {/* Order Header */}
                                    <div className="p-4 sm:p-6 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <div>
                                            <div className="flex items-center gap-3 mb-1">
                                                <h3 className="font-semibold text-gray-900">
                                                    Order #{order.orderNumber}
                                                </h3>
                                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[order.orderStatus]}`}>
                                                    {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-500">
                                                Placed on {formatDate(order.createdAt)}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-semibold text-gray-900">
                                                AED{order.totalAmount.toFixed(2)}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {order.items.length} item{order.items.length > 1 ? 's' : ''}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Order Items Preview */}
                                    <div className="p-4 sm:p-6 flex flex-wrap gap-3">
                                        {order.items.slice(0, 4).map((item, idx) => (
                                            <div key={idx} className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
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
                                        ))}
                                        {order.items.length > 4 && (
                                            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                                                <span className="text-sm text-gray-500">
                                                    +{order.items.length - 4}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Order Actions */}
                                    <div className="px-4 sm:px-6 py-3 bg-gray-50 flex justify-end">
                                        <Link
                                            href={`/orders/${order._id}`}
                                            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-700"
                                        >
                                            <Eye className="h-4 w-4" />
                                            View Details
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}