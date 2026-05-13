import apiClient from '../api/client';

export const adminService = {
  getStats: async () => {
    const response = await apiClient.get('/admin/stats');
    return response.data;
  },

  getRevenueAnalytics: async () => {
    const response = await apiClient.get('/admin/revenue-analytics');
    return response.data;
  },

  addBook: async (bookData) => {
    const response = await apiClient.post('/admin/books', bookData);
    return response.data;
  },

  updateBook: async (id, bookData) => {
    const response = await apiClient.put(`/admin/books/${id}`, bookData);
    return response.data;
  },

  deleteBook: async (id) => {
    const response = await apiClient.delete(`/admin/books/${id}`);
    return response.data;
  },
};
