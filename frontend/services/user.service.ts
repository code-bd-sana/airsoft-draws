import { api } from './api';
import { User } from './auth.service';

export const userService = {
  async changePassword(data: any) {
    const response = await api.patch('/users/change-password', data);
    return response.data;
  },

  async updateProfile(data: any): Promise<{ message: string, user: User }> {
    const response = await api.patch('/users/profile', data);
    return response.data;
  },

  async uploadAvatar(file: File): Promise<{ message: string, user: User }> {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/users/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};
