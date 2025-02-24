// app/shop/cart/page.tsx
'use client';

import { Minus, Plus, Trash2 } from 'lucide-react';
import { useShopDispatch, useShopSelector } from '@/store';
import { selectCartItems, selectCartTotal, removeFromCart, updateQuantity } from '@/store/cartSlice';
import { navigate } from '@/store/navigationSlice';
import Navbar from '@/components/Navbar';
import Link from '@/components/Link';

export default function CartPage() {
  const dispatch = useShopDispatch();
  const cartItems = useShopSelector(selectCartItems);
  const cartTotal = useShopSelector(selectCartTotal);

  if (cartItems.length === 0) {
    return (
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <div className="max-w-3xl mx-auto py-12 px-4 text-center">
            <h1 className="text-2xl font-bold mb-4">Your Cart is Empty</h1>
            <p className="text-gray-600 mb-8">Add some items to your cart to continue shopping.</p>
            <Link href="home" className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
              Continue Shopping
            </Link>
          </div>
        </div>
    );
  }

  return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <main className="max-w-3xl mx-auto py-12 px-4">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold">Shopping Cart</h1>
            <Link href="home" className="text-blue-600 hover:text-blue-800 transition-colors">
              Continue Shopping
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow">
            {cartItems.map((item) => (
                <div key={item.id} className="p-6 border-b border-gray-200 last:border-0">
                  <div className="flex items-center">
                    <img
                        src={item.image}
                        alt={item.name}
                        className="w-24 h-24 object-cover rounded"
                    />

                    <div className="ml-6 flex-grow">
                      <h3 className="text-lg font-semibold">{item.name}</h3>
                      <p className="text-gray-600">${item.price}</p>

                      <div className="flex items-center mt-4">
                        <div className="flex items-center border rounded">
                          <button
                              onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }))}
                              className="p-2 hover:bg-gray-100 transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="px-4">{item.quantity}</span>
                          <button
                              onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))}
                              className="p-2 hover:bg-gray-100 transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        <button
                            onClick={() => dispatch(removeFromCart(item.id))}
                            className="ml-4 text-red-500 hover:text-red-700 transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-lg font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                </div>
            ))}

            <div className="p-6 border-t border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold">Subtotal</span>
                <span className="text-2xl font-bold">${cartTotal.toFixed(2)}</span>
              </div>

              <button
                  onClick={() => dispatch(navigate({ route: 'checkout' }))}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </main>
      </div>
  );
}