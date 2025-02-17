// app/cart/page.tsx
'use client';

import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import Link from '@/components/Link';

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart();

  if (cartItems.length === 0) {
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-2xl font-bold mb-4">Your Cart is Empty</h1>
            <p className="text-gray-600 mb-8">Looks like you haven&apos;t added any items to your cart yet.</p>
            <Link
                href="/"
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
    );
  }

  return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold">Shopping Cart</h1>
            <Link
                href="/"
                className="text-blue-600 hover:text-blue-800 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow">
            {cartItems.map((item) => (
                <div
                    key={item.id}
                    className="flex items-center p-6 border-b border-gray-200 last:border-0"
                >
                  <img
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded"
                  />

                  <div className="flex-grow ml-6">
                    <h3 className="text-lg font-semibold">{item.name}</h3>
                    <p className="text-gray-600">${item.price}</p>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="flex items-center border rounded">
                      <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-2 hover:bg-gray-100 transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="px-4">{item.quantity}</span>
                      <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-2 hover:bg-gray-100 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-2 text-red-500 hover:text-red-700 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
            ))}

            <div className="p-6 border-t border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold">Subtotal</span>
                <span className="text-2xl font-bold">${getCartTotal().toFixed(2)}</span>
              </div>

              <Link
                  href="checkout"
                  className="block w-full bg-blue-600 text-white text-center py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Proceed to Checkout
              </Link>
            </div>
          </div>
        </div>
      </div>
  );
}