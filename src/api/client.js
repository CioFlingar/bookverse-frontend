// src/api/client.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:5000/api', // Your Express server URL
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;