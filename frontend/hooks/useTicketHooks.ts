import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';

export const usePurchaseTicketsMutation = (raffleId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (quantity: number) => {
      const response = await api.post(`/tickets/purchase/${raffleId}`, { quantity });
      return response.data;
    },
    onSuccess: () => {
      // Invalidate queries to refresh available tickets, etc.
      queryClient.invalidateQueries({ queryKey: ['raffle', raffleId] });
      queryClient.invalidateQueries({ queryKey: ['my-tickets'] });
    },
  });
};

export const useMyTicketsQuery = () => {
  return useQuery({
    queryKey: ['my-tickets'],
    queryFn: async () => {
      const response = await api.get('/tickets/my-tickets');
      return response.data;
    },
  });
};
