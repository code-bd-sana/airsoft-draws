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
  firstName?: string | null;
  lastName?: string | null;
  avatarUrl?: string | null;
  logoUrl?: string | null;
  bannerUrl?: string | null;
  bio?: string | null;
  phone?: string | null;
  address?: string | null;
  slug?: string | null;
  vatNumber?: string | null;
  bankAccountName?: string | null;
  sortCode?: string | null;
  accountNumber?: string | null;
  walletBalance?: number;
  isBlocked: boolean;
  isVerified: boolean;
  isEmailVerified?: boolean;
  plan: string;
  raffles: number;
  revenue: number;
  createdAt: string;
  userCreatedAt?: string;
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


export interface LogData {
  id: string;
  timestamp: string;
  actor: {
    name: string;
    initials: string;
    type: "admin" | "system" | "user";
  };
  description: string;
  ip: string;
  status: "Success" | "Failed";
}

export interface GetLogsResponse {
  logs: LogData[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface RevenueStatsResponse {
  periodRevenue: number;
  revenueData: { name: string; value: number }[];
}

export interface ReportsAnalyticsResponse {
  revenueTrend: { name: string; value: number }[];
  salesByCategory: { name: string; value: number; count: number; color: string }[];
  popularCompetitions: { name: string; value: number; totalTickets?: number; maxValue: number }[];
  userGrowth: { name: string; users: number }[];
  hostPerformance: { name: string; percent: number; rafflesCount: number }[];
  geographicData: { name: string; value: number; count: number }[];
}

export interface AdminDashboardOverview {
  topHosts?: { rank: number; name: string; revenue: string; initials: string }[];
  periodRevenue?: number;
  revenueData?: { name: string; value: number }[];
  growthData?: { name: string; Users: number; Hosts: number }[];
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
  async getUsers(params: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    status?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<GetUsersResponse> {
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

  async getHostById(hostId: string): Promise<any> {
    const { data } = await api.get(`/admin/hosts/${hostId}`);
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

  async getRevenueStats(period: string = '1Y'): Promise<RevenueStatsResponse> {
    const { data } = await api.get('/admin/dashboard/revenue', { params: { period } });
    return data;
  },

  async getReportsAnalytics(timeFilter: string = '3M'): Promise<ReportsAnalyticsResponse> {
    const { data } = await api.get('/admin/dashboard/reports', { params: { timeFilter } });
    return data;
  },

  async getSystemLogs(params: { page?: number; limit?: number; search?: string; filter?: string }): Promise<GetLogsResponse> {
    const { data } = await api.get('/admin/dashboard/logs', { params });
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

  async getAdminWithdrawals(): Promise<any[]> {
    const { data } = await api.get('/admin/withdrawals');
    return data;
  },

  async updateWithdrawalStatus(id: string, status: 'APPROVED' | 'COMPLETED' | 'REJECTED', adminNotes?: string): Promise<any> {
    const { data } = await api.patch(`/admin/withdrawals/${id}/status`, { status, adminNotes });
    return data;
  },

  // Manual Ticket Assignment
  async getAssignmentCompetitions(params?: { search?: string; status?: string; hostId?: string }): Promise<AssignmentCompetition[]> {
    const { data } = await api.get('/admin/ticket-assignment/competitions', { params });
    return data;
  },

  async getCompetitionTicketDetails(raffleId: string): Promise<CompetitionTicketDetails> {
    const { data } = await api.get(`/admin/ticket-assignment/competitions/${raffleId}`);
    return data;
  },

  async searchUsersForAssignment(q: string): Promise<UserSearchResult[]> {
    const { data } = await api.get('/admin/ticket-assignment/users/search', { params: { q } });
    return data;
  },

  async assignTickets(payload: AssignTicketsPayload): Promise<AssignTicketsResponse> {
    const { data } = await api.post('/admin/ticket-assignment/assign', payload);
    return data;
  },

  async getAssignmentHistory(params?: { page?: number; limit?: number }): Promise<AssignmentHistoryResponse> {
    const { data } = await api.get('/admin/ticket-assignment/history', { params });
    return data;
  },
};

export interface AssignmentCompetition {
  id: string;
  title: string;
  slug: string;
  mainImage: string;
  status: string;
  category: string;
  totalTickets: number;
  ticketsSold: number;
  remainingTickets: number;
  pricePerTicket: number;
  startDate: string;
  endDate: string;
  isAutoDraw: boolean;
  hostId: string;
  hostName: string;
  totalInstantWins: number;
  unclaimedInstantWins: number;
}

export interface CompetitionTicketDetails {
  raffle: {
    id: string;
    title: string;
    slug: string;
    mainImage: string;
    pricePerTicket: number;
    totalTickets: number;
    ticketsSold: number;
    remainingTickets: number;
    status: string;
    startDate: string;
    endDate: string;
    category: string;
    isAutoDraw: boolean;
    host: {
      id: string;
      businessName: string;
      walletBalance: number;
    };
  };
  stats: {
    totalTickets: number;
    soldTickets: number;
    availableTickets: number;
    totalInstantWins: number;
    unclaimedInstantWins: number;
    ticketPrice: number;
    totalValue: number;
    soldValue: number;
  };
  instantWins: Array<{
    id: string;
    ticketNumber: number;
    prizeName: string;
    rrpValue: number | null;
    image: string | null;
    isClaimed: boolean;
  }>;
  soldTickets: Array<{
    id: string;
    ticketNumber: number;
    userId: string;
    userName: string;
    userEmail: string;
    purchasedAt: string;
    paymentGateway: string;
  }>;
}

export interface UserSearchResult {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: string;
  isBlocked: boolean;
  ukaraNumber?: string | null;
  avatarUrl?: string | null;
}

export interface AssignTicketsPayload {
  raffleId: string;
  userId: string;
  ticketNumbers?: number[];
  quantity?: number;
  adminNotes?: string;
}

export interface AssignTicketsResponse {
  success: boolean;
  message: string;
  assignedNumbers: number[];
  quantity: number;
  totalAmount: number;
  transactionId: string;
  paymentGateway: string;
  raffle: {
    id: string;
    title: string;
    pricePerTicket: number;
  };
  recipient: {
    id: string;
    name: string;
    email: string;
  };
  instantWinsWon: Array<{
    ticketNumber: number;
    prizeName: string;
    rrpValue: number | null;
    prizeImage: string | null;
  }>;
  notes?: string;
}

export interface AssignmentHistoryItem {
  id: string;
  gatewayTransactionId: string;
  date: string;
  amount: number;
  ticketsCount: number;
  ticketNumbers: number[];
  recipient: {
    id: string;
    name: string;
    email: string;
  };
  raffle: {
    id: string;
    title: string;
    slug: string;
    mainImage: string;
    pricePerTicket: number;
  } | null;
}

export interface AssignmentHistoryResponse {
  data: AssignmentHistoryItem[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
