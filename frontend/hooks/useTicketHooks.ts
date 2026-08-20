import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';

export interface PurchaseTicketPayload {
  quantity: number;
  dateOfBirth?: string;
  ukaraNumber?: string;
  acceptedTerms?: boolean;
}

export const usePurchaseTicketsMutation = (raffleId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: number | PurchaseTicketPayload) => {
      const body = typeof payload === 'number' ? { quantity: payload } : payload;
      const response = await api.post(`/tickets/purchase/${raffleId}`, body);
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
