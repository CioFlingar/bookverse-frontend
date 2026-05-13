import { useCallback, useEffect, useMemo, useState } from "react";
import { cartService } from "../services/cartService";
import { useAuth } from "../hooks/useAuth";
import { CartContext } from "./CartContextObject";

const getStoredCart = () => {
  const savedCart = localStorage.getItem("cart");
  if (!savedCart) return [];

  try {
    return JSON.parse(savedCart);
  } catch (err) {
    console.error("Failed to load cart:", err);
    localStorage.removeItem("cart");
    return [];
  }
};

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(getStoredCart);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated, user } = useAuth();

  const normalizeCartItems = (cart) =>
    (cart?.items || []).map((item) => {
      const book = item.book || item;
      return {
        ...book,
        _id: book._id || item.book,
        price: item.price ?? book.price ?? 0,
        quantity: item.quantity ?? 1,
      };
    });

  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem("cart", JSON.stringify(items));
    }
  }, [isAuthenticated, items]);

  const refreshCart = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const cart = await cartService.getCart();
      setItems(normalizeCartItems(cart));
    } catch (err) {
      console.error("Failed to load server cart:", err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      refreshCart();
    }
  }, [isAuthenticated, refreshCart, user?._id]);

  const addItem = useCallback(async (book, quantity = 1) => {
    if (isAuthenticated) {
      const cart = await cartService.addToCart(book._id, quantity);
      setItems(normalizeCartItems(cart));
      return;
    }

    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item._id === book._id);
      if (existingItem) {
        return prevItems.map((item) =>
          item._id === book._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevItems, { ...book, quantity }];
    });
  }, [isAuthenticated]);

  const removeItem = useCallback(async (bookId) => {
    if (isAuthenticated) {
      const cart = await cartService.removeFromCart(bookId);
      setItems(normalizeCartItems(cart));
      return;
    }

    setItems((prevItems) => prevItems.filter((item) => item._id !== bookId));
  }, [isAuthenticated]);

  const updateQuantity = useCallback(async (bookId, quantity) => {
    if (isAuthenticated) {
      const cart = await cartService.updateCartItem(bookId, quantity);
      setItems(normalizeCartItems(cart));
      return;
    }

    if (quantity <= 0) {
      removeItem(bookId);
    } else {
      setItems((prevItems) =>
        prevItems.map((item) =>
          item._id === bookId ? { ...item, quantity } : item
        )
      );
    }
  }, [isAuthenticated, removeItem]);

  const clearCart = useCallback(async () => {
    if (isAuthenticated) {
      const cart = await cartService.clearCart();
      setItems(normalizeCartItems(cart));
      return;
    }

    setItems([]);
  }, [isAuthenticated]);

  const totalPrice = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items],
  );
  const totalItems = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items],
  );

  const value = {
    items,
    loading,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    totalPrice,
    totalItems,
    getTotalPrice: () => totalPrice,
    getTotalQuantity: () => totalItems,
    refreshCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
