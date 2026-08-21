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

export const useAdminSubscriptionStats = () => {
  return useQuery({
    queryKey: ['adminSubscriptionStats'],
    queryFn: subscriptionService.getAdminSubscriptionStats,
  });
};

export const useMySubscriptionRequest = () => {
  return useQuery({
    queryKey: ['mySubscriptionRequest'],
    queryFn: subscriptionService.getMySubscriptionRequest,
  });
};

export const useCreateSubscriptionRequestMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: subscriptionService.createSubscriptionRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mySubscriptionRequest'] });
    },
  });
};

export const useAllSubscriptionRequestsAdmin = () => {
  return useQuery({
    queryKey: ['adminSubscriptionRequests'],
    queryFn: subscriptionService.getAllSubscriptionRequestsAdmin,
  });
};

export const useApproveSubscriptionRequestMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: subscriptionService.approveSubscriptionRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminSubscriptionRequests'] });
      queryClient.invalidateQueries({ queryKey: ['adminSubscriptions'] });
      queryClient.invalidateQueries({ queryKey: ['adminSubscriptionStats'] });
      queryClient.invalidateQueries({ queryKey: ['mySubscription'] });
    },
  });
};

export const useRejectSubscriptionRequestMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: subscriptionService.rejectSubscriptionRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminSubscriptionRequests'] });
    },
  });
};

export const useAssignSubscriptionManuallyMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: subscriptionService.assignSubscriptionManually,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminSubscriptions'] });
      queryClient.invalidateQueries({ queryKey: ['adminSubscriptionStats'] });
    },
  });
};
