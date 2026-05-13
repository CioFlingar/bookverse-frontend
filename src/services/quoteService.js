import apiClient from '../api/client';

export const quoteService = {
  getRandomQuote: async () => {
    const response = await apiClient.get('/quotes/random');
    return response.data;
  },

  getQuotesByBook: async (bookId, page = 1, limit = 10) => {
    const response = await apiClient.get(
      `/quotes/book/${bookId}?page=${page}&limit=${limit}`
    );
    return response.data;
  },

  getAllQuotes: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.author) params.append('author', filters.author);
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);

    const response = await apiClient.get(`/quotes?${params}`);
    return response.data;
  },
};
