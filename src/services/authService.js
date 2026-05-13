import apiClient from '../api/client';

export const authService = {
  register: async (name, email, password) => {
    const response = await apiClient.post('/auth/register', {
      name,
      email,
      password,
    });
    return response.data;
  },

  login: async (email, password, rememberMe) => {
    const response = await apiClient.post('/auth/login', {
      email,
      password,
      rememberMe,
    });
    return response.data;
  },

  getProfile: async () => {
    const response = await apiClient.get('/auth/profile');
    return response.data;
  },

  updateProfile: async (name, email) => {
    const response = await apiClient.put('/auth/profile', {
      name,
      email,
    });
    return response.data;
  },

  changePassword: async (currentPassword, newPassword) => {
    const response = await apiClient.post('/auth/change-password', {
      currentPassword,
      newPassword,
    });
    return response.data;
  },
};
