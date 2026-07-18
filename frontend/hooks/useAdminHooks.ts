import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '../services/admin.service';

export const useAdminUsers = (params: { page?: number; limit?: number; search?: string; role?: string }) => {
  return useQuery({
    queryKey: ['admin', 'users', params],
    queryFn: () => adminService.getUsers(params),
    staleTime: 60 * 1000, // 1 minute
  });
};

export const useAdminHostStats = () => {
  return useQuery({
    queryKey: ['adminHostStats'],
    queryFn: adminService.getHostStats,
  });
};

export const useAdminOrders = (params: { page?: number; limit?: number; search?: string }) => {
  return useQuery({
    queryKey: ['adminOrders', params],
    queryFn: () => adminService.getOrders(params),
  });
};

export const useAdminOrdersStats = () => {
  return useQuery({
    queryKey: ['adminOrdersStats'],
    queryFn: adminService.getOrdersStats,
  });
};

export const useProcessRefundMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ transactionId, reason }: { transactionId: string; reason?: string }) => 
      adminService.processRefund(transactionId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminOrders'] });
      queryClient.invalidateQueries({ queryKey: ['adminOrdersStats'] });
    },
  });
};

export const useAdminUsersStats = () => {
  return useQuery({
    queryKey: ['admin', 'users', 'stats'],
    queryFn: () => adminService.getStats(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useToggleUserBlockMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => adminService.toggleBlockStatus(userId),
    onSuccess: () => {
      // Invalidate both users list and stats to refetch updated data
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
  });
};

export const useAdminOverviewStats = () => {
  return useQuery({
    queryKey: ['adminOverviewStats'],
    queryFn: () => adminService.getOverviewStats(),
  });
};
