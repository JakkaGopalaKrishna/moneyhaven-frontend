import axios from 'axios';
import { STORAGE_KEYS } from '../constants/storageKeys';
import { getItem, removeItem } from '../utils/localStorage';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = getItem(STORAGE_KEYS.TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // Handle global errors here (e.g., 401 Unauthorized)
      if (error.response.status === 401) {
        removeItem(STORAGE_KEYS.TOKEN);
        removeItem(STORAGE_KEYS.USER);
        // Optionally dispatch a logout action or reload if appropriate
        // window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
