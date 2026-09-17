import { api } from './api';

export interface NotificationItem {
  id: string;
  userId: string;
  type: 'WIN' | 'PAYMENT' | 'DRAW' | 'APPROVAL' | 'WITHDRAWAL' | 'SYSTEM' | string;
  title: string;
  subtitle?: string | null;
  link?: string | null;
  isRead: boolean;
  metadata?: any;
  createdAt: string;
}

export interface NotificationsResponse {
  notifications: NotificationItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface QueryNotificationsParams {
  page?: number;
  limit?: number;
  type?: string;
  unreadOnly?: boolean;
}

export const notificationService = {
  getNotifications: async (
    params?: QueryNotificationsParams,
  ): Promise<NotificationsResponse> => {
    const res = await api.get('/api/v1/notifications', { params });
    return res.data;
  },

  getUnreadCount: async (): Promise<{ count: number }> => {
    const res = await api.get('/api/v1/notifications/unread-count');
    return res.data;
  },

  markAsRead: async (id: string): Promise<NotificationItem> => {
    const res = await api.patch(`/api/v1/notifications/${id}/read`);
    return res.data;
  },

  markAllAsRead: async (): Promise<{ count: number }> => {
    const res = await api.patch('/api/v1/notifications/read-all');
    return res.data;
  },
};
