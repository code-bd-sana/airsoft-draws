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

  async createCheckoutSession(planId: string): Promise<{ url?: string; isTest?: boolean; transactionId?: string; message?: string }> {
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
  }
};
