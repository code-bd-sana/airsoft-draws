import axios from 'axios';
import { envConfig } from '../config/env.config';

export const api = axios.create({
  baseURL: envConfig.apiUrl,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach Bearer token if stored in localStorage
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('accessToken');
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Response interceptor to handle errors globally (e.g., 401 Unauthorized)
api.interceptors.response.use(
  (response) => {
    // Unwrap the backend's TransformInterceptor payload if present
    if (response.data && response.data.success === true && response.data.data !== undefined) {
      if (response.data.meta !== undefined) {
        response.data = { data: response.data.data, meta: response.data.meta };
      } else {
        response.data = response.data.data;
      }
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Clear token if unauthorized, except if it's the login route itself
      if (typeof window !== 'undefined' && !error.config.url?.includes('/auth/login')) {
        // Optionally: clear token and redirect to login, handled in AuthContext or here
        // localStorage.removeItem('accessToken');
      }
    }
    return Promise.reject(error);
  }
);
