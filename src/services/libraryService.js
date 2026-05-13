import apiClient from '../api/client';

export const libraryService = {
  addToLibrary: async (bookId, status = 'Owned') => {
    const response = await apiClient.post('/library', {
      bookId,
      status,
    });
    return response.data;
  },

  getUserLibrary: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.search) params.append('search', filters.search);
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);

    const response = await apiClient.get(`/library?${params}`);
    return response.data;
  },

  updateProgress: async (bookId, currentPage, status) => {
    const response = await apiClient.put(`/library/${bookId}/progress`, {
      currentPage,
      status,
    });
    return response.data;
  },

  updateStatus: async (bookId, status) => {
    const response = await apiClient.put(`/library/${bookId}/status`, {
      status,
    });
    return response.data;
  },

  removeFromLibrary: async (bookId) => {
    const response = await apiClient.delete(`/library/${bookId}`);
    return response.data;
  },

  getReadingStats: async () => {
    const response = await apiClient.get('/library/stats');
    return response.data;
  },
};
