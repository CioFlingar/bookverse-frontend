import apiClient from '../api/client';

export const orderService = {
  createOrder: async (shippingAddress) => {
    const response = await apiClient.post('/orders', { shippingAddress });
    return response.data;
  },

  getUserOrders: async () => {
    const response = await apiClient.get('/orders/my-orders');
    return response.data;
  },

  getOrderById: async (id) => {
    const response = await apiClient.get(`/orders/${id}`);
    return response.data;
  },

  getAllOrders: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);

    const response = await apiClient.get(`/orders/admin/all?${params}`);
    return response.data;
  },

  updateOrderStatus: async (id, status) => {
    const response = await apiClient.put(`/orders/${id}/status`, { status });
    return response.data;
  },

  getRevenueAnalytics: async () => {
    const response = await apiClient.get('/orders/admin/analytics');
    return response.data;
  },
};
