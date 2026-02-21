import React from 'react';
import { Package, Timer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const OrderTracking = () => {
    const navigate = useNavigate();
    return (
        <div className="pt-32 pb-20 bg-gray-50 min-h-screen flex items-center justify-center">
            <div className="max-w-md text-center px-6">
                <div className="inline-block p-6 bg-teal-100 rounded-full mb-6">
                    <Package className="w-16 h-16 text-teal-600 animate-bounce" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Tracking</h1>
                <p className="text-teal-600 font-semibold mb-4 flex items-center justify-center gap-2">
                    <Timer className="w-4 h-4" /> Feature Coming Soon
                </p>
                <p className="text-gray-600 mb-8 leading-relaxed">
                    We are building a real-time tracking system to help you monitor your package every step of the way. Stay tuned!
                </p>
                <Button
                    onClick={() => navigate('/products')}
                    className="bg-teal-600 hover:bg-teal-700 px-8"
                >
                    Back to Shopping
                </Button>
            </div>
        </div>
    );
};

export default OrderTracking;