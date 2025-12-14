import React, { createContext, useContext, useState } from 'react';
import { Course } from '../types';

interface CartContextType {
  cart: Course | null;
  addToCart: (course: Course) => void;
  removeFromCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<Course | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = (course: Course) => {
    if (cart) {
      // Logic restriction: Only 1 course allowed
      alert("Policy Restriction: You can only register for one course at a time. Please remove the current course to add a different one.");
      setIsCartOpen(true);
      return;
    }
    setCart(course);
    setIsCartOpen(true);
  };

  const removeFromCart = () => {
    setCart(null);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, isCartOpen, setIsCartOpen }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};