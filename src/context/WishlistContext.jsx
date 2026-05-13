import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { wishlistService } from "../services/wishlistService";
import { WishlistContext } from "./WishlistContextObject";

const normalizeWishlist = (wishlist) =>
  (wishlist?.items || [])
    .map((item) => {
      const book = item.book || item;
      if (!book?._id) return null;

      return {
        ...book,
        wishlistItemId: item._id,
      };
    })
    .filter(Boolean);

export const WishlistProvider = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const refreshWishlist = useCallback(async () => {
    if (!isAuthenticated) {
      setItems([]);
      return;
    }

    setLoading(true);
    setError("");
    try {
      const wishlist = await wishlistService.getWishlist();
      setItems(normalizeWishlist(wishlist));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load wishlist");
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const timer = setTimeout(() => {
      refreshWishlist();
    }, 0);

    return () => clearTimeout(timer);
  }, [refreshWishlist, user?._id]);

  const isWishlisted = useCallback(
    (bookId) => items.some((item) => item._id === bookId),
    [items],
  );

  const addToWishlist = useCallback(async (book) => {
    if (!isAuthenticated) {
      throw new Error("Sign in to add books to your wishlist");
    }

    setError("");
    try {
      const wishlist = await wishlistService.addToWishlist(book._id);
      setItems(normalizeWishlist(wishlist));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add to wishlist");
      throw err;
    }
  }, [isAuthenticated]);

  const removeFromWishlist = useCallback(async (bookId) => {
    if (!isAuthenticated) return;

    setError("");
    try {
      const wishlist = await wishlistService.removeFromWishlist(bookId);
      setItems(normalizeWishlist(wishlist));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to remove from wishlist");
      throw err;
    }
  }, [isAuthenticated]);

  const toggleWishlist = useCallback(async (book) => {
    if (isWishlisted(book._id)) {
      await removeFromWishlist(book._id);
      return;
    }

    await addToWishlist(book);
  }, [addToWishlist, isWishlisted, removeFromWishlist]);

  const clearWishlist = useCallback(async () => {
    if (!isAuthenticated) return;

    setError("");
    try {
      const wishlist = await wishlistService.clearWishlist();
      setItems(normalizeWishlist(wishlist));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to clear wishlist");
      throw err;
    }
  }, [isAuthenticated]);

  const value = useMemo(() => ({
    items,
    totalItems: items.length,
    loading,
    error,
    clearError: () => setError(""),
    isWishlisted,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    clearWishlist,
    refreshWishlist,
  }), [
    addToWishlist,
    clearWishlist,
    error,
    isWishlisted,
    items,
    loading,
    refreshWishlist,
    removeFromWishlist,
    toggleWishlist,
  ]);

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};
