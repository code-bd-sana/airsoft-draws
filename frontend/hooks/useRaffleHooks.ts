import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { raffleService } from '../services/raffle.service';

export const usePublicRaffles = (params: { search?: string; page?: number; limit?: number; category?: string; statusFilter?: string; sort?: string }) => {
  return useQuery({
    queryKey: ['publicRaffles', params],
    queryFn: () => raffleService.getPublicRaffles(params),
  });
};

export const usePublicRaffleDetail = (slug: string) => {
  return useQuery({
    queryKey: ['publicRaffle', slug],
    queryFn: () => raffleService.getPublicRaffleBySlug(slug),
    enabled: !!slug,
  });
};

export const useHostRaffles = (params?: { page?: number; limit?: number; status?: string }) => {
  return useQuery({
    queryKey: ['hostRaffles', params],
    queryFn: () => raffleService.getMyRaffles(params),
  });
};

export const useGetRaffleById = (id: string) => {
  return useQuery({
    queryKey: ['raffle', id],
    queryFn: () => raffleService.getRaffleById(id),
    enabled: !!id,
  });
};

export const useUpdateRaffle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => raffleService.updateRaffle(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['hostRaffles'] });
      queryClient.invalidateQueries({ queryKey: ['raffle', variables.id] });
    },
  });
};

export const useCreateRaffle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: raffleService.createRaffle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hostRaffles'] });
    },
  });
};

export const useUploadRaffleImage = () => {
  return useMutation({
    mutationFn: ({ id, file }: { id: string; file: File }) => raffleService.uploadRaffleImage(id, file),
  });
};

export const useDeleteRaffle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: raffleService.deleteRaffle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hostRaffles'] });
    },
  });
};

export const useAdminPendingRaffles = () => {
  return useQuery({
    queryKey: ['adminPendingRaffles'],
    queryFn: raffleService.getPendingApprovals,
  });
};

export const useApproveRaffle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: raffleService.approveRaffle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminPendingRaffles'] });
      queryClient.invalidateQueries({ queryKey: ['publicRaffles'] });
    },
  });
};

export const useRaffleWinners = (raffleId: string) => {
  return useQuery({
    queryKey: ['raffleWinners', raffleId],
    queryFn: () => raffleService.getWinners(raffleId),
    enabled: !!raffleId,
  });
};

export const useDrawWinner = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (raffleId: string) => raffleService.drawWinner(raffleId),
    onSuccess: (_, raffleId) => {
      queryClient.invalidateQueries({ queryKey: ['hostRaffles'] });
      queryClient.invalidateQueries({ queryKey: ['raffleWinners', raffleId] });
    },
  });
};

export const useAdminAllRaffles = (params?: { search?: string; page?: number; limit?: number; status?: string }) => {
  return useQuery({
    queryKey: ['adminAllRaffles', params],
    queryFn: () => raffleService.getAdminAllRaffles(params),
  });
};

export const useAdminDeleteRaffle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: raffleService.adminDeleteRaffle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminAllRaffles'] });
      queryClient.invalidateQueries({ queryKey: ['adminPendingRaffles'] });
      queryClient.invalidateQueries({ queryKey: ['publicRaffles'] });
    },
  });
};
