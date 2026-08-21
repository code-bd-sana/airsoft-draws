import { api } from './api';

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: string;
  durationDays: number;
  maxActiveRaffles: number | null;
}

export interface HostSubscription {
  id: string;
  hostId: string;
  planId: string;
  status: 'ACTIVE' | 'EXPIRED' | 'CANCELLED';
  startDate: string;
  endDate: string;
  plan: SubscriptionPlan;
  transaction?: {
    id: string;
    amount: string;
    status: string;
    paymentGateway: string;
    gatewayTransactionId: string;
    createdAt: string;
  };
}

export interface AdminSubscriptionStats {
  mrr: number;
  totalActive: number;
  planDistribution: {
    name: string;
    value: number;
    percentage: string;
  }[];
}

export interface SubscriptionRequest {
  id: string;
  hostId: string;
  planId: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  requestedDays?: number;
  note?: string;
  adminNotes?: string;
  approvedDays?: number;
  createdAt: string;
  updatedAt: string;
  plan: SubscriptionPlan;
  host?: {
    id: string;
    businessName?: string;
    user?: {
      id: string;
      email: string;
      firstName?: string;
      lastName?: string;
    };
  };
}

export const subscriptionService = {
  async getPlans(): Promise<SubscriptionPlan[]> {
    const response = await api.get('/subscriptions/plans');
    return response.data;
  },

  async getMySubscription(): Promise<HostSubscription | null> {
    const response = await api.get('/subscriptions/my');
    return response.data;
  },

  async cancelSubscription(): Promise<HostSubscription> {
    const response = await api.post('/subscriptions/cancel');
    return response.data;
  },

  async createCheckoutSession(planId: string): Promise<{ url?: string; isTest?: boolean; isFree?: boolean; isManualMode?: boolean; transactionId?: string; message?: string }> {
    const response = await api.post('/payment/checkout/subscription', { planId });
    return response.data;
  },

  async getAllSubscriptionsForAdmin(): Promise<any[]> {
    const response = await api.get('/subscriptions/admin');
    return response.data;
  },

  async getMyBillingHistory(): Promise<any[]> {
    const response = await api.get('/subscriptions/history');
    return response.data;
  },

  async getAdminSubscriptionStats(): Promise<AdminSubscriptionStats> {
    const response = await api.get('/subscriptions/admin/stats');
    return response.data;
  },

  // Manual Subscription Request endpoints
  async createSubscriptionRequest(data: { planId: string; requestedDays?: number; note?: string }): Promise<SubscriptionRequest> {
    const response = await api.post('/subscriptions/request', data);
    return response.data;
  },

  async getMySubscriptionRequest(): Promise<SubscriptionRequest | null> {
    const response = await api.get('/subscriptions/request/my');
    return response.data;
  },

  async getAllSubscriptionRequestsAdmin(): Promise<SubscriptionRequest[]> {
    const response = await api.get('/subscriptions/admin/requests');
    return response.data;
  },

  async approveSubscriptionRequest(data: { requestId: string; approvedDays?: number; adminNotes?: string }): Promise<any> {
    const response = await api.post('/subscriptions/admin/requests/approve', data);
    return response.data;
  },

  async rejectSubscriptionRequest(data: { requestId: string; adminNotes?: string }): Promise<any> {
    const response = await api.post('/subscriptions/admin/requests/reject', data);
    return response.data;
  },

  async assignSubscriptionManually(data: { hostProfileId: string; planId: string; durationDays?: number; adminNotes?: string }): Promise<any> {
    const response = await api.post('/subscriptions/admin/assign', data);
    return response.data;
  }
};
