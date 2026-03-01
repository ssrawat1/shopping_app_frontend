"use client"
import { useContext, createContext, useState } from "react";

const CartContext = createContext({ cartItems: [] });

export const CartContextProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  return (
    <CartContext.Provider value={{ cartItems, setCartItems }}>
      {children}
    </CartContext.Provider>
  )
};

export const useCartContext = () => {
  return useContext(CartContext)
}