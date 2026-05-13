import apiClient from '../api/client';

export const bookService = {
  getBooks: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.search) params.append('search', filters.search);
    if (filters.genre) params.append('genre', filters.genre);
    if (filters.author) params.append('author', filters.author);
    if (filters.minPrice) params.append('minPrice', filters.minPrice);
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
    if (filters.minRating) params.append('minRating', filters.minRating);
    if (filters.sort) params.append('sort', filters.sort);
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);

    const response = await apiClient.get(`/books?${params}`);
    return response.data;
  },

  getBook: async (id) => {
    const response = await apiClient.get(`/books/${id}`);
    return response.data;
  },

  getLowStockBooks: async () => {
    const response = await apiClient.get('/books/low-stock');
    return response.data;
  },
};
