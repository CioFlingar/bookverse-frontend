import apiClient from "../api/client";

export const wishlistService = {
  getWishlist: async () => {
    const response = await apiClient.get("/wishlist");
    return response.data;
  },

  addToWishlist: async (bookId) => {
    const response = await apiClient.post("/wishlist", { bookId });
    return response.data;
  },

  removeFromWishlist: async (bookId) => {
    const response = await apiClient.delete(`/wishlist/${bookId}`);
    return response.data;
  },

  clearWishlist: async () => {
    const response = await apiClient.delete("/wishlist");
    return response.data;
  },
};
