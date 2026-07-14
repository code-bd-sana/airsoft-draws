import { api } from './api';

export interface User {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  avatarUrl: string | null;
}

export interface HostProfile {
  id: string;
  businessName: string;
  user?: User;
}

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
  isAutoDraw?: boolean;
  autoDrawDate?: boolean;
  autoDrawSoldOut?: boolean;
  createdAt: string;
  host?: HostProfile;
}

export interface RecentWinner {
  id: string;
  name: string;
  initials: string;
  location: string;
  avatarUrl?: string;
  prizeWon: string;
  status: string;
  statusText: string;
  whenWon: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface CreateRaffleData {
  title: string;
  description: string;
  prizeName?: string;
  pricePerTicket: number | string;
  totalTickets: number;
  startDate: string;
  endDate: string;
  isAutoDraw?: boolean;
  autoDrawDate?: boolean;
  autoDrawSoldOut?: boolean;
  [key: string]: unknown;
}

export interface UpdateRaffleData extends Partial<CreateRaffleData> {
  status?: 'DRAFT' | 'PENDING_APPROVAL' | 'ACTIVE' | 'ENDED' | 'CANCELLED';
}

export const raffleService = {
  async getPublicStats(): Promise<{ id: number; value: string; label: string }[]> {
    const response = await api.get('/raffles/public/stats');
    return response.data;
  },

  async getInstantWinRaffles(limit = 10): Promise<any> {
    const response = await api.get('/raffles', {
      params: { limit, hasInstantWins: 'true' },
    });
    return response.data;
  },

  async getRecentWinners(): Promise<RecentWinner[]> {
    const response = await api.get('/raffles/public/recent-winners');
    return response.data;
  },

  async getPublicRaffles(params: { search?: string; page?: number; limit?: number; category?: string; statusFilter?: string; sort?: string }): Promise<PaginatedResponse<Raffle>> {
    const response = await api.get('/raffles', { params });
    return response.data;
  },

  async getPublicRaffleBySlug(slug: string): Promise<Raffle> {
    const response = await api.get(`/raffles/public/${slug}`);
    return response.data;
  },

  async getMyRaffles(params?: { page?: number; limit?: number; status?: string }): Promise<PaginatedResponse<Raffle>> {
    const response = await api.get('/raffles/host/my-raffles', { params });
    return response.data;
  },

  async getRaffleById(id: string): Promise<Raffle> {
    const response = await api.get(`/raffles/host/${id}`);
    return response.data;
  },

  async updateRaffle(id: string, data: UpdateRaffleData): Promise<Raffle> {
    const response = await api.patch(`/raffles/host/${id}`, data);
    return response.data;
  },

  async createRaffle(data: CreateRaffleData): Promise<Raffle> {
    const response = await api.post('/raffles', data);
    return response.data;
  },

  async deleteRaffle(id: string): Promise<void> {
    const response = await api.delete(`/raffles/host/${id}`);
    return response.data;
  },

  async drawWinner(id: string): Promise<unknown> {
    const response = await api.post(`/raffles/host/${id}/draw`);
    return response.data;
  },

  async getWinners(id: string): Promise<unknown> {
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
  },

  async getAdminAllRaffles(params?: { search?: string; page?: number; limit?: number; status?: string }): Promise<PaginatedResponse<Raffle>> {
    const response = await api.get('/raffles/admin/all', { params });
    return response.data;
  },

  async adminDeleteRaffle(id: string): Promise<void> {
    const response = await api.delete(`/raffles/admin/${id}`);
    return response.data;
  }
};
