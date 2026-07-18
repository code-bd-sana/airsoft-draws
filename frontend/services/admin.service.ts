import { api } from './api';

export interface UserStats {
  totalUsers: number;
  newThisMonth: number;
  activeUsers: number;
  blockedUsers: number;
  activePercentage: string;
  blockedPercentage: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: string;
  isBlocked: boolean;
  isEmailVerified: boolean;
  avatarUrl: string | null;
  location: string | null;
  phone: string | null;
  address: string | null;
  createdAt: string;
  ticketsCount: number;
  totalSpent: number;
}

export interface GetUsersResponse {
  users: User[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface HostData {
  id: string;
  userId: string;
  businessName: string;
  email: string;
  isBlocked: boolean;
  isVerified: boolean;
  plan: string;
  raffles: number;
  revenue: number;
  createdAt: string;
}

export interface GetHostsResponse {
  hosts: HostData[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface HostStats {
  totalHosts: number;
  activeHosts: number;
  blockedHosts: number;
  pendingHosts?: number;
}

export interface OrderData {
  id: string;
  orderId: string;
  buyerName: string;
  buyerInitials: string;
  competition: string;
  tickets: number;
  amount: number;
  payment: string;
  status: string;
  date: string;
}

export interface GetOrdersResponse {
  orders: OrderData[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface OrderStats {
  totalOrders: number;
  totalTicketsSold: number;
  totalOrderValue: number;
  refundedOrders: number;
}


export interface AdminDashboardOverview {
  stats: {
    totalUsers: number;
    activeHosts: number;
    liveRaffles: number;
    totalRevenue: number;
  };
  awaitingReview: {
    count: number;
    list: {
      id: string;
      title: string;
      sub: string;
      icon: string;
    }[];
  };
  recentActivity: {
    text: string;
    time: string;
    highlight: boolean;
    alert: boolean;
  }[];
}


export const adminService = {
  async getUsers(params: { page?: number; limit?: number; search?: string; role?: string }): Promise<GetUsersResponse> {
    const { data } = await api.get('/admin/users', { params });
    return data;
  },

  async getStats(): Promise<UserStats> {
    const { data } = await api.get('/admin/users/stats');
    return data;
  },

  async toggleBlockStatus(userId: string): Promise<User> {
    const { data } = await api.patch(`/admin/users/${userId}/block`);
    return data;
  },

  async getHosts(params: { page?: number; limit?: number; search?: string; status?: string }): Promise<GetHostsResponse> {
    const { data } = await api.get('/admin/hosts', { params });
    return data;
  },

  async getHostStats(): Promise<HostStats> {
    const { data } = await api.get('/admin/hosts/stats');
    return data;
  },

  async approveHost(hostId: string): Promise<any> {
    const { data } = await api.patch(`/admin/hosts/${hostId}/approve`);
    return data;
  },

  async rejectHost(hostId: string): Promise<any> {
    const { data } = await api.patch(`/admin/hosts/${hostId}/reject`);
    return data;
  },

  async getOverviewStats(): Promise<AdminDashboardOverview> {
    const { data } = await api.get('/admin/dashboard/stats');
    return data;
  },

  async getOrders(params: { page?: number; limit?: number; search?: string }): Promise<GetOrdersResponse> {
    const { data } = await api.get('/admin/orders', { params });
    return data;
  },

  async getOrdersStats(): Promise<OrderStats> {
    const { data } = await api.get('/admin/orders/stats');
    return data;
  },

  async processRefund(transactionId: string, reason?: string): Promise<{ message: string; transaction: any }> {
    const { data } = await api.post(`/admin/orders/${transactionId}/refund`, { reason });
    return data;
  },
};
