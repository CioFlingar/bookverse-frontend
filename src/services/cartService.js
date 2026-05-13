import apiClient from "../api/client";

export const cartService = {
  getCart: async () => {
    const response = await apiClient.get("/cart");
    return response.data;
  },

  addToCart: async (bookId, quantity = 1) => {
    const response = await apiClient.post("/cart/add", { bookId, quantity });
    return response.data;
  },

  updateCartItem: async (bookId, quantity) => {
    const response = await apiClient.put("/cart/update", { bookId, quantity });
    return response.data;
  },

  removeFromCart: async (bookId) => {
    const response = await apiClient.post("/cart/remove", { bookId });
    return response.data;
  },

  clearCart: async () => {
    const response = await apiClient.post("/cart/clear");
    return response.data;
  },
};
