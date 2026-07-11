import { api } from './api';

export interface Raffle {
  id: string;
  hostId: string;
  title: string;
  slug: string;
  description: string;
  mainImage: string | null;
  prizeName: string | null;
  pricePerTicket: string | number;
  totalTickets: number;
  ticketsSold: number;
  startDate: string;
  endDate: string;
  status: 'DRAFT' | 'PENDING_APPROVAL' | 'ACTIVE' | 'ENDED' | 'CANCELLED';
  createdAt: string;
  host?: any;
}

export const raffleService = {
  async getPublicRaffles(params: { search?: string; page?: number; limit?: number; category?: string; statusFilter?: string; sort?: string }) {
    const response = await api.get('/raffles', { params });
    return response.data;
  },

  async getPublicRaffleBySlug(slug: string): Promise<Raffle> {
    const response = await api.get(`/raffles/public/${slug}`);
    return response.data;
  },

  async getMyRaffles(params?: { page?: number; limit?: number; status?: string }) {
    const response = await api.get('/raffles/host/my-raffles', { params });
    return response.data;
  },

  async getRaffleById(id: string): Promise<any> {
    const response = await api.get(`/raffles/host/${id}`);
    return response.data;
  },

  async updateRaffle(id: string, data: any): Promise<any> {
    const response = await api.patch(`/raffles/host/${id}`, data);
    return response.data;
  },

  async createRaffle(data: any): Promise<Raffle> {
    const response = await api.post('/raffles', data);
    return response.data;
  },

  async updateRaffle(id: string, data: any): Promise<Raffle> {
    const response = await api.patch(`/raffles/host/${id}`, data);
    return response.data;
  },

  async deleteRaffle(id: string): Promise<void> {
    const response = await api.delete(`/raffles/host/${id}`);
    return response.data;
  },

  async drawWinner(id: string) {
    const response = await api.post(`/raffles/host/${id}/draw`);
    return response.data;
  },

  async getWinners(id: string) {
    const response = await api.get(`/raffles/host/${id}/winners`);
    return response.data;
  },

  async uploadRaffleImage(id: string, file: File): Promise<Raffle> {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post(`/raffles/host/${id}/image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async getPendingApprovals(): Promise<Raffle[]> {
    const response = await api.get('/raffles/admin/pending');
    return response.data;
  },

  async approveRaffle(id: string): Promise<Raffle> {
    const response = await api.patch(`/raffles/admin/${id}/approve`);
    return response.data;
  }
};
