import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  notificationService,
  QueryNotificationsParams,
} from '../services/notification.service';

export const useNotificationsQuery = (
  params?: QueryNotificationsParams,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: ['notifications', params],
    queryFn: () => notificationService.getNotifications(params),
    enabled: options?.enabled ?? true,
  });
};

export const useUnreadNotificationCountQuery = (options?: {
  enabled?: boolean;
}) => {
  return useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: () => notificationService.getUnreadCount(),
    refetchInterval: 30000, // 30-second interval polling
    refetchOnWindowFocus: true,
    enabled: options?.enabled ?? true,
  });
};

export const useMarkNotificationAsReadMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => notificationService.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};

export const useMarkAllNotificationsAsReadMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => notificationService.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};
