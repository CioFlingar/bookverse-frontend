import { useCallback, useEffect, useMemo, useState } from "react";
import { cartService } from "../services/cartService";
import { useAuth } from "../hooks/useAuth";
import { CartContext } from "./CartContextObject";

const CART_STORAGE_KEY = "cart";

const getStoredCart = () => {
  const savedCart = localStorage.getItem(CART_STORAGE_KEY);
  if (!savedCart) return [];

  try {
    const parsedCart = JSON.parse(savedCart);
    return Array.isArray(parsedCart) ? parsedCart : [];
  } catch (err) {
    console.error("Failed to load cart:", err);
    localStorage.removeItem(CART_STORAGE_KEY);
    return [];
  }
};

const normalizeQuantity = (quantity) => Math.max(1, Number(quantity) || 1);

const normalizeCartItems = (cart) =>
  (cart?.items || [])
    .map((item) => {
      const book = item.book && typeof item.book === "object" ? item.book : item;
      const id = book?._id || item.book || item._id;

      if (!id) return null;

      return {
        ...book,
        _id: id,
        title: book?.title || item.title || "Untitled book",
        author: book?.author || item.author || "Unknown author",
        image: book?.image || item.image || "",
        price: Number(item.price ?? book?.price ?? 0),
        quantity: normalizeQuantity(item.quantity),
        stock: book?.stock ?? item.stock,
      };
    })
    .filter(Boolean);

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => normalizeCartItems({ items: getStoredCart() }));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    }
  }, [isAuthenticated, items]);

  const refreshCart = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    setError("");
    try {
      const cart = await cartService.getCart();
      setItems(normalizeCartItems(cart));
    } catch (err) {
      console.error("Failed to load server cart:", err);
      setError(err.response?.data?.message || "Failed to load your cart");
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
    const safeQuantity = normalizeQuantity(quantity);
    setError("");

    try {
      if (isAuthenticated) {
        const cart = await cartService.addToCart(book._id, safeQuantity);
        setItems(normalizeCartItems(cart));
        return;
      }

      setItems((prevItems) => {
        const existingItem = prevItems.find((item) => item._id === book._id);
        if (existingItem) {
          const nextQuantity = existingItem.quantity + safeQuantity;
          return prevItems.map((item) =>
            item._id === book._id
              ? { ...item, quantity: item.stock ? Math.min(nextQuantity, item.stock) : nextQuantity }
              : item
          );
        }
        return [...prevItems, { ...book, quantity: safeQuantity }];
      });
    } catch (err) {
      const message = err.response?.data?.message || "Failed to add item to cart";
      setError(message);
      throw err;
    }
  }, [isAuthenticated]);

  const removeItem = useCallback(async (bookId) => {
    setError("");
    try {
      if (isAuthenticated) {
        const cart = await cartService.removeFromCart(bookId);
        setItems(normalizeCartItems(cart));
        return;
      }

      setItems((prevItems) => prevItems.filter((item) => item._id !== bookId));
    } catch (err) {
      const message = err.response?.data?.message || "Failed to remove item from cart";
      setError(message);
      throw err;
    }
  }, [isAuthenticated]);

  const updateQuantity = useCallback(async (bookId, quantity) => {
    const nextQuantity = Number(quantity) || 0;
    setError("");

    try {
      if (isAuthenticated) {
        const cart = await cartService.updateCartItem(bookId, Math.max(0, nextQuantity));
        setItems(normalizeCartItems(cart));
        return;
      }

      if (nextQuantity <= 0) {
        await removeItem(bookId);
        return;
      }

      setItems((prevItems) =>
        prevItems.map((item) =>
          item._id === bookId
            ? { ...item, quantity: item.stock ? Math.min(nextQuantity, item.stock) : nextQuantity }
            : item
        )
      );
    } catch (err) {
      const message = err.response?.data?.message || "Failed to update cart";
      setError(message);
      throw err;
    }
  }, [isAuthenticated, removeItem]);

  const clearCart = useCallback(async () => {
    setError("");
    try {
      if (isAuthenticated) {
        const cart = await cartService.clearCart();
        setItems(normalizeCartItems(cart));
        return;
      }

      setItems([]);
    } catch (err) {
      const message = err.response?.data?.message || "Failed to clear cart";
      setError(message);
      throw err;
    }
  }, [isAuthenticated]);

  const totalPrice = useMemo(
    () => items.reduce((sum, item) => sum + Number(item.price || 0) * normalizeQuantity(item.quantity), 0),
    [items],
  );
  const totalItems = useMemo(
    () => items.reduce((sum, item) => sum + normalizeQuantity(item.quantity), 0),
    [items],
  );

  const value = {
    items,
    loading,
    error,
    clearError: () => setError(""),
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
