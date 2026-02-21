import React from 'react';
import { Truck, RotateCcw, ShieldCheck } from 'lucide-react';

const ShippingReturn = () => {
    return (
        <div className="pt-32 pb-20 bg-gray-50 min-h-screen">
            <div className="max-w-4xl mx-auto px-4">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Shipping & Return Policy</h1>

                <div className="grid gap-8">
                    <section className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-teal-600">
                        <div className="flex items-center gap-3 mb-4">
                            <Truck className="text-teal-600" />
                            <h2 className="text-xl font-bold">Fast Shipping</h2>
                        </div>
                        <p className="text-gray-600">We ship all orders within 24 hours. Free shipping is available on all orders above ₹299. We use premium couriers to ensure your electronics arrive safely.</p>
                    </section>

                    <section className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-teal-600">
                        <div className="flex items-center gap-3 mb-4">
                            <RotateCcw className="text-teal-600" />
                            <h2 className="text-xl font-bold">30-Day Returns</h2>
                        </div>
                        <p className="text-gray-600">Not satisfied? No problem. Return any item within 30 days for a full refund. Please ensure the items are in original condition with all accessories.</p>
                    </section>

                    <section className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-teal-600">
                        <div className="flex items-center gap-3 mb-4">
                            <ShieldCheck className="text-teal-600" />
                            <h2 className="text-xl font-bold">Safe Packaging</h2>
                        </div>
                        <p className="text-gray-600">Electronics are fragile. We use triple-layer bubble wrap and anti-static packaging to ensure your gadgets are protected during transit.</p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default ShippingReturn;