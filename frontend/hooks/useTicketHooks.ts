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

export interface UserOrderItem {
  raffleId: string;
  title: string;
  slug: string;
  mainImage: string;
  pricePerTicket: number;
  quantity: number;
  remainingTickets?: number;
  ticketNumbers?: number[];
  status: string;
  isEnded?: boolean;
  isSoldOut?: boolean;
}

export interface UserOrder {
  id: string;
  orderNumber: string;
  amount: number;
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED' | 'FAILED';
  paymentGateway: string;
  createdAt: string;
  items: UserOrderItem[];
  totalTickets: number;
  canPay: boolean;
  isSoldOutOrClosed: boolean;
  closedReason: string | null;
}

export const useUserOrdersQuery = () => {
  return useQuery<UserOrder[]>({
    queryKey: ['user-orders'],
    queryFn: async () => {
      const response = await api.get('/tickets/orders');
      return response.data;
    },
  });
};

export const useRetryOrderPaymentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderId: string) => {
      const response = await api.post(`/tickets/orders/${orderId}/pay`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-orders'] });
    },
  });
};

