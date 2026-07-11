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

export const useHostRaffles = () => {
  return useQuery({
    queryKey: ['hostRaffles'],
    queryFn: raffleService.getMyRaffles,
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
