import React from 'react';
import { Minus, Plus, Trash2, Star } from 'lucide-react';
import { decreaseCartItemQuantityApi, fetchCartItemsApi, increaseCartItemQuantityApi, removeCartItemApi } from '@/apis/cartApi';
import { useCartContext } from '@/context/CartContext';
import { useThemeContext } from '@/context/ThemeContext';
import Image from 'next/image';

const CartItem = ({ id, title, price, image, quantity, rating }) => {
  const { setCartItems } = useCartContext();
  const { isDark } = useThemeContext();

  /* Decrease Cart Item Quantity: */
  const handleDecreaseCartItemQuantity = async ({ id }) => {
    try {
      const { data } = await decreaseCartItemQuantityApi({ id });
      console.log("Decrease Cart Item Quantity Response:", data);
      const { data: cartData } = await fetchCartItemsApi();
      console.log("cart items response after decreasing quantity:", cartData);
      setCartItems(cartData.cartItems);
    } catch (error) {
      console.log("Error while decreasing cart item quantity:", error);
    }
  };

  /* Increase Cart Item Quantity: */
  const handleIncreaseCartItemQuantity = async ({ id }) => {
    try {
      const { data } = await increaseCartItemQuantityApi({ id });
      console.log("Increase Cart Item Quantity Response:", data);
      const { data: cartData } = await fetchCartItemsApi();
      console.log("cart items response after increasing quantity:", cartData);
      setCartItems(cartData.cartItems);
    } catch (error) {
      console.log("Error while increasing cart item quantity:", error);
    }
  };

  /* Remove Cart Item: */
  const handleRemoveCartItem = async ({ id }) => {
    try {
      const { data } = await removeCartItemApi({ id });
      console.log("Remove Cart Item Response:", data);
      const { data: cartData } = await fetchCartItemsApi();
      setCartItems(cartData.cartItems);
      console.log("cart items response after removing:", cartData);
    } catch (error) {
      console.log("Error while removing cart item:", error.message);
    }
  };

  return (
    <div className={`rounded-lg border transition-all ${isDark
      ? 'bg-gray-800 border-gray-700 hover:bg-gray-750'
      : 'bg-white border-gray-200 hover:shadow-md'
      }`}>
      {/* Desktop Layout */}
      <div className="hidden md:grid md:grid-cols-12 gap-9 p-4 items-center">
        {/* Product Image & Details - col-span-5 */}
        <div className="col-span-5 flex items-center gap-4">
          <div className="w-20 h-20 flex-shrink-0">
            <Image
              src={image}
              alt={title}
              width={80}
              height={80}
              className="w-full h-full object-contain rounded"
            />
          </div>
          <div>
            <h3 className={`text-base font-semibold mb-1 line-clamp-2 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
              {title}
            </h3>
            {rating && (
              <div className="flex items-center gap-2">
                <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  {rating}
                </span>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3 h-3 ${i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Price - col-span-2 */}
        <div className="col-span-2 text-center">
          <p className={`text-lg font-bold ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
            ${price?.toFixed(2)}
          </p>
        </div>

        {/* Quantity - col-span-2 */}
        <div className="col-span-2 flex justify-center ">
          <div className={`flex items-center gap-2 rounded-lg p-1 ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <button
              onClick={() => handleDecreaseCartItemQuantity({ id })}
              disabled={quantity <= 1}
              className={`w-8 h-8 flex items-center justify-center rounded transition-colors ${isDark
                ? 'bg-teal-600 text-white hover:bg-teal-700 disabled:bg-gray-600'
                : 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-300'
                } disabled:cursor-not-allowed`}
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className={`w-10 text-center font-semibold ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
              {quantity}
            </span>
            <button
              onClick={() => handleIncreaseCartItemQuantity({ id })}
              className={`w-8 h-8 flex items-center justify-center rounded transition-colors ${isDark
                ? 'bg-teal-600 text-white hover:bg-teal-700'
                : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Total - col-span-2 */}
        <div className="col-span-2 text-center">
          <p className={`text-lg font-bold ${isDark ? 'text-teal-400' : 'text-blue-600'}`}>
            ${(price * quantity)?.toFixed(2)}
          </p>
        </div>

        {/* Remove Button - col-span-1 */}
        <div className="col-span-1 flex justify-center">
          <button
            onClick={() => handleRemoveCartItem({ id })}
            className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden p-4 space-y-4">
        {/* Image and Title */}
        <div className="flex gap-4">
          <div className="w-24 h-24 flex-shrink-0">
            <Image
              src={image}
              alt={title}
              width={96}
              height={96}
              className="w-full h-full object-contain rounded"
            />
          </div>
          <div className="flex-1">
            <h3 className={`text-base font-semibold mb-1 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
              {title}
            </h3>
            {rating && (
              <div className="flex items-center gap-1">
                <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  {rating}
                </span>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3 h-3 ${i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Price Row */}
        <div className="flex justify-between items-center">
          <span className={`font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Price:</span>
          <span className={`text-lg font-bold ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
            ${price?.toFixed(2)}
          </span>
        </div>

        {/* Quantity Row */}
        <div className="flex justify-between items-center">
          <span className={`font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Quantity:</span>
          <div className={`flex items-center gap-2 rounded-lg p-1 ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <button
              onClick={() => handleDecreaseCartItemQuantity({ id })}
              disabled={quantity <= 1}
              className={`w-8 h-8 flex items-center justify-center rounded transition-colors ${isDark
                ? 'bg-teal-600 text-white hover:bg-teal-700 disabled:bg-gray-600'
                : 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-300'
                } disabled:cursor-not-allowed`}
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className={`w-10 text-center font-semibold ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
              {quantity}
            </span>
            <button
              onClick={() => handleIncreaseCartItemQuantity({ id })}
              className={`w-8 h-8 flex items-center justify-center rounded transition-colors ${isDark
                ? 'bg-teal-600 text-white hover:bg-teal-700'
                : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Subtotal Row */}
        <div className="flex justify-between items-center">
          <span className={`font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Subtotal:</span>
          <span className={`text-xl font-bold ${isDark ? 'text-teal-400' : 'text-blue-600'}`}>
            ${(price * quantity)?.toFixed(2)}
          </span>
        </div>

        {/* Remove Button */}
        <button
          onClick={() => handleRemoveCartItem({ id })}
          className="w-full py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center gap-2 font-medium"
        >
          <Trash2 className="w-5 h-5" />
          Remove
        </button>
      </div>
    </div>
  );
};

export default CartItem;