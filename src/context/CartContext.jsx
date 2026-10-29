import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem("feasthub_cart");
      return savedCart ? JSON.parse(savedCart) : [];
    } catch {
      return [];
    }
  });

  // Keep localStorage synchronized
  useEffect(() => {
    try {
      localStorage.setItem("feasthub_cart", JSON.stringify(cartItems));
    } catch (err) {
      console.error("Failed to save cart to localStorage", err);
    }
  }, [cartItems]);

  const addToCart = (foodItem, restaurantName = "") => {
    setCartItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(
        (item) => String(item.foodId) === String(foodItem.id)
      );

      if (existingItemIndex > -1) {
        // Item exists, increment quantity
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + 1
        };
        return updatedItems;
      } else {
        // Add new item
        return [
          ...prevItems,
          {
            foodId: String(foodItem.id),
            name: foodItem.name,
            price: Number(foodItem.price),
            image: foodItem.image,
            restaurantId: foodItem.restaurantId,
            restaurantName: restaurantName || "Selected Restaurant",
            quantity: 1
          }
        ];
      }
    });
  };

  const removeFromCart = (foodId) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => String(item.foodId) !== String(foodId))
    );
  };

  const updateQuantity = (foodId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(foodId);
      return;
    }

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        String(item.foodId) === String(foodId)
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  // Calculations
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const cartSubtotal = Number(
    cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)
  );

  const deliveryFee = cartSubtotal > 35 || cartSubtotal === 0 ? 0 : 2.99;
  const taxAmount = Number((cartSubtotal * 0.05).toFixed(2));
  const cartTotal = Number((cartSubtotal + deliveryFee + taxAmount).toFixed(2));

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartSubtotal,
        deliveryFee,
        taxAmount,
        cartTotal
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
