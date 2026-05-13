import apiClient from '../api/client';

export const reviewService = {
  getBookReviews: async (bookId, page = 1, limit = 10) => {
    const response = await apiClient.get(
      `/reviews/book/${bookId}?page=${page}&limit=${limit}`
    );
    return response.data;
  },

  createReview: async (bookId, rating, comment) => {
    const response = await apiClient.post('/reviews', {
      bookId,
      rating,
      comment,
    });
    return response.data;
  },

  updateReview: async (id, rating, comment) => {
    const response = await apiClient.put(`/reviews/${id}`, {
      rating,
      comment,
    });
    return response.data;
  },

  deleteReview: async (id) => {
    const response = await apiClient.delete(`/reviews/${id}`);
    return response.data;
  },

  markHelpful: async (id) => {
    const response = await apiClient.post(`/reviews/${id}/helpful`);
    return response.data;
  },
};
