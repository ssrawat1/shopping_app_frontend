"use client"
import { fetchCartItemsApi, removeAllItemsApi } from '@/apis/cartApi.js'
import { useCartContext } from '@/context/CartContext';
import { useThemeContext } from '@/context/ThemeContext';
import React from 'react'
import { ShoppingBag, Trash2 } from 'lucide-react';
import CartItem from '@/pages/CartItem';
import Link from 'next/link';
import { filterItems } from '@/utils/filters/items';
import { useProductContext } from '@/context/ProductContext';

const Cart = () => {
  const { cartItems, setCartItems } = useCartContext();
  const { searchQuery } = useProductContext()
  const { isDark } = useThemeContext();

  const totalAmount = cartItems?.reduce((prev, curr) => prev + curr.quantity * curr.price, 0).toFixed(2)

  const handleRemoveAllItems = async () => {
    try {
      const { data } = await removeAllItemsApi();
      const { data: cartData } = await fetchCartItemsApi();
      setCartItems(cartData.cartItems)
    } catch (error) {
      console.log("Error while removing all cart items:", error.message)
    }
  };

  /* Filter Cart Items: */
  const filterCartItems = filterItems(cartItems, searchQuery);

  return (
    <div className={`rounded-lg py-8 px-4 mt-36 sm:px-6 lg:px-8 md:mt-28 sm:mt-36 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className={`sm:text-3xl text-xl  font-bold mb-2 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
              Shopping Cart
            </h1>
            <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
              {cartItems.length || "No"} {cartItems.length === 1 ? 'item' : 'items'} in your cart
            </p>
          </div>

          {/* Remove All Button - Only show if cart has items */}
          {filterCartItems.length > 0 && (
            <button
              onClick={handleRemoveAllItems}
              className="flex sm:text-base text-sm items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              <Trash2 className="w-5 h-5 hidden sm:inline" />
              Remove All
            </button>
          )}
        </div>

        {!filterCartItems.length ? (
          /* Empty Cart */
          <div className={`rounded-lg shadow-sm p-12 text-center ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
            <ShoppingBag className={`w-24 h-24 mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-300'}`} />
            <h2 className={`text-2xl font-semibold mb-2 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
              Your cart is empty
            </h2>
            <p className={`mb-6 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Add some products to get started!
            </p>
            <Link href="/">
              <button className={`px-6 py-3 rounded-lg transition-colors font-medium ${isDark
                ? 'bg-teal-600 text-white hover:bg-teal-700'
                : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}>
                Continue Shopping
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {/* Table Header - Desktop Only */}
              <div className={`hidden md:grid grid-cols-12 gap-4 px-4 py-3 rounded-lg font-semibold text-sm ${isDark ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'
                }`}>
                <div className="col-span-5">Item</div>
                <div className="col-span-2 text-center">Price</div>
                <div className="col-span-2 text-center">Quantity</div>
                <div className="col-span-2 text-center">Total</div>
                <div className="col-span-1"></div>
              </div>

              {/* Cart Items List */}
              {filterCartItems.map((item) => (
                <CartItem key={item.id} {...item} />
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className={`rounded-lg shadow-sm p-6 sticky top-28 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
                <h2 className={`text-xl font-bold mb-4 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
                  Order Summary
                </h2>

                <div className="space-y-3 mb-4">
                  <div className={`flex justify-between ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    <span>Subtotal</span>
                    <span className="font-medium">${totalAmount}</span>
                  </div>
                  <div className={`flex justify-between ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    <span>Shipping</span>
                    <span className="font-medium text-green-600">Free</span>
                  </div>
                  <div className={`flex justify-between ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    <span>Tax</span>
                    <span className="font-medium">$0.00</span>
                  </div>
                </div>

                <div className={`border-t pt-4 mb-6 ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                  <div className="flex justify-between items-center">
                    <span className={`text-lg font-bold ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
                      Total
                    </span>
                    <span className={`text-2xl font-bold ${isDark ? 'text-teal-400' : 'text-blue-600'}`}>
                      ${totalAmount}
                    </span>
                  </div>
                </div>

                <button className={`w-full py-3 rounded-lg transition-colors font-semibold mb-3 cursor-pointer ${isDark
                  ? 'bg-teal-600 text-white hover:bg-teal-700'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}>
                  Proceed to Checkout
                </button>

                <Link href="/">
                  <button className={`w-full py-3 rounded-lg transition-colors font-medium cursor-pointer ${isDark
                    ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}>
                    Continue Shopping
                  </button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;