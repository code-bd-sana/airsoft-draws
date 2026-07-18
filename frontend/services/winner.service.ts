import { api } from './api';
import { Raffle, User } from './raffle.service';

export interface Ticket {
  id: string;
  ticketNumber: number;
}

export interface Winner {
  id: string;
  userId: string;
  raffleId: string;
  ticketId: string;
  winType: 'MAIN_DRAW' | 'INSTANT_WIN';
  prizeName: string;
  deliveryStatus: 'PENDING' | 'SHIPPED' | 'DELIVERED';
  verificationStatus: 'PENDING' | 'VERIFIED' | 'REJECTED';
  trackingNumber: string | null;
  createdAt: string;
  updatedAt: string;
  user?: User;
  raffle?: Raffle;
  ticket?: Ticket;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const winnerService = {
  async getAdminWinners(params?: {
    page?: number;
    limit?: number;
    status?: string;
    verificationStatus?: string;
    winType?: string;
  }): Promise<PaginatedResponse<Winner>> {
    const response = await api.get('/admin/winners', { params });
    return response.data;
  },

  async verifyWinner(id: string): Promise<Winner> {
    const response = await api.patch(`/admin/winners/${id}/verify`);
    return response.data;
  }
};
