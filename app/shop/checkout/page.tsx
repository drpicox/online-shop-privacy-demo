// app/shop/checkout/page.tsx
'use client';

import Navbar from '@/components/Navbar';
import { CheckCircle } from 'lucide-react';
import { useShopDispatch, useShopSelector } from "@/store";
import { navigate } from "@/store/shop/slices/navigationSlice";
import { clearCart, selectCartItems, selectCartTotal } from "@/store/shop/slices/cartSlice";
import { formatPrice } from "@/lib/utils";
import {
    setName,
    setCity,
    setPhone,
    confirmOrder,
    resetCheckout,
    selectCheckoutInfo,
    selectIsConfirmed
} from "@/store/shop/slices/checkoutSlice";

export default function CheckoutPage() {
    const dispatch = useShopDispatch();
    const cartItems = useShopSelector(state => selectCartItems(state));
    const subtotal = useShopSelector(state => selectCartTotal(state));
    const { name, city, phone } = useShopSelector(selectCheckoutInfo);
    const isConfirmed = useShopSelector(selectIsConfirmed);

    const shipping = 10;
    const total = subtotal + shipping;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(confirmOrder());
    };

    const handleOrderComplete = () => {
        dispatch(clearCart());
        dispatch(resetCheckout());
        dispatch(navigate({ route: 'home' }));
    };

    if (isConfirmed) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="p-4 max-w-lg mx-auto mt-8">
                    <div className="bg-white p-6 rounded-lg shadow text-center">
                        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold mb-2">Comanda confirmada!</h2>
                        <p className="text-gray-600 mb-6">Gràcies per la teva comanda, {name}!</p>
                        <button
                            onClick={handleOrderComplete}
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors w-full"
                        >
                            Continua comprant
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="p-4 max-w-lg mx-auto">
                <h1 className="text-2xl font-bold mb-6">Finalitzar la compra</h1>

                {/* Order Summary */}
                <div className="bg-white p-4 rounded-lg shadow mb-6">
                    <h2 className="text-lg font-bold mb-4">Resum de la comanda</h2>
                    <div className="space-y-2 mb-4">
                        {cartItems.map((item) => (
                            <div key={item.id} className="flex justify-between">
                                <div>
                                    <p>{item.name} x{item.quantity}</p>
                                </div>
                                <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
                            </div>
                        ))}
                    </div>
                    <div className="border-t pt-2 space-y-2">
                        <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span>{formatPrice(subtotal)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Enviament</span>
                            <span>{formatPrice(shipping)}</span>
                        </div>
                        <div className="flex justify-between font-bold text-lg border-t pt-2">
                            <span>Total</span>
                            <span>{formatPrice(total)}</span>
                        </div>
                    </div>
                </div>

                {/* Simple Form */}
                <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Nom</label>
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => dispatch(setName(e.target.value))}
                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder="El teu nom"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Ciutat</label>
                            <input
                                type="text"
                                required
                                value={city}
                                onChange={(e) => dispatch(setCity(e.target.value))}
                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder="La teva ciutat"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Telèfon</label>
                            <input
                                type="tel"
                                required
                                value={phone}
                                onChange={(e) => dispatch(setPhone(e.target.value))}
                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder="El teu número de telèfon"
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors text-lg"
                    >
                        Fes la comanda ({formatPrice(total)})
                    </button>
                </form>
            </div>
        </div>
    );
}
