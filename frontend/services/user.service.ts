import { api } from './api';
import { User } from './auth.service';

export interface UserWinner {
  id: string;
  raffleId: string;
  ticketId: string;
  winType: 'INSTANT_WIN' | 'MAIN_DRAW';
  prizeName: string;
  prizeImage: string | null;
  rrpValue: number | null;
  ticketNumber: number;
  deliveryStatus: 'PENDING' | 'SHIPPED' | 'DELIVERED';
  verificationStatus: 'PENDING' | 'VERIFIED' | 'REJECTED';
  trackingNumber: string | null;
  createdAt: string;
  raffle: {
    id: string;
    title: string;
    slug: string;
    mainImage: string | null;
    hostBusinessName: string;
    status: string;
  };
  instantWinDetails?: {
    id: string;
    prizeName: string;
    image: string | null;
    rrpValue: number | null;
  } | null;
}

export const userService = {
  async changePassword(data: any) {
    const response = await api.patch('/users/change-password', data);
    return response.data;
  },

  async updateProfile(data: any): Promise<{ message: string; user: User }> {
    const response = await api.patch('/users/profile', data);
    return response.data;
  },

  async uploadAvatar(file: File): Promise<{ message: string; user: User }> {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/users/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async getMyWinners(): Promise<UserWinner[]> {
    const response = await api.get('/users/my-winners');
    return response.data;
  },
};

