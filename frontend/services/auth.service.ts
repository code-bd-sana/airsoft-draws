import { api } from './api';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  avatarUrl: string | null;
  location?: string | null;
  hostProfile?: {
    businessName: string;
    slug?: string;
    bio?: string;
    phone?: string;
    address?: string;
    isVerified: boolean;
  } | null;
}

export interface AuthResponse {
  user: User;
}

export const authService = {
  async register(data: any) {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  async login(data: any): Promise<AuthResponse> {
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  async logout() {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  async me(): Promise<{ user: User }> {
    const response = await api.get('/auth/me');
    return response.data;
  },

  async verifyEmail(token: string) {
    const response = await api.post('/auth/verify-email', { token });
    return response.data;
  },

  async resendVerification(email: string) {
    const response = await api.post('/auth/resend-verification', { email });
    return response.data;
  },

  async forgotPassword(email: string) {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  async resetPassword(data: any) {
    const response = await api.post('/auth/reset-password', data);
    return response.data;
  },
};
