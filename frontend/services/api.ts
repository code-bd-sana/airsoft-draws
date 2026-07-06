import axios from 'axios';
import { envConfig } from '../config/env.config';

export const api = axios.create({
  baseURL: envConfig.apiUrl,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
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
