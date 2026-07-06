import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { subscriptionService } from '../services/subscription.service';

export const useSubscriptionPlans = () => {
  return useQuery({
    queryKey: ['subscriptionPlans'],
    queryFn: subscriptionService.getPlans,
  });
};

export const useMySubscription = () => {
  return useQuery({
    queryKey: ['mySubscription'],
    queryFn: subscriptionService.getMySubscription,
  });
};

export const useCreateCheckoutSessionMutation = () => {
  return useMutation({
    mutationFn: subscriptionService.createCheckoutSession,
  });
};

export const useCancelSubscriptionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: subscriptionService.cancelSubscription,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mySubscription'] });
    },
  });
};

export const useAllSubscriptionsAdmin = () => {
  return useQuery({
    queryKey: ['adminSubscriptions'],
    queryFn: subscriptionService.getAllSubscriptionsForAdmin,
  });
};

export const useMyBillingHistory = () => {
  return useQuery({
    queryKey: ['myBillingHistory'],
    queryFn: subscriptionService.getMyBillingHistory,
  });
};
