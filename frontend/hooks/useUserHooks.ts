import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { userService } from '../services/user.service';
import { authService } from '../services/auth.service';

export const useMyWinnersQuery = () => {
  return useQuery({
    queryKey: ['my-winners'],
    queryFn: () => userService.getMyWinners(),
  });
};

export const useUnclaimedInstantWinsQuery = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ['unclaimed-instant-wins'],
    queryFn: () => userService.getUnclaimedInstantWins(),
    enabled,
    staleTime: 1000 * 60 * 5, // 5 mins cache
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};

export const useClaimInstantWinsMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (winnerIds?: string[]) => userService.claimInstantWins(winnerIds),
    onSuccess: () => {
      queryClient.setQueryData(['unclaimed-instant-wins'], []);
      queryClient.invalidateQueries({ queryKey: ['my-winners'] });
    },
  });
};

export const useChangePasswordMutation = () => {
  return useMutation({
    mutationFn: userService.changePassword,
  });
};


export const useUpdateProfileMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userService.updateProfile,
    onSuccess: (data) => {
      queryClient.setQueryData(['user'], data.user);
    },
  });
};

export const useUploadAvatarMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userService.uploadAvatar,
    onSuccess: (data) => {
      queryClient.setQueryData(['user'], data.user);
    },
  });
};

export const useForgotPasswordMutation = () => {
  return useMutation({
    mutationFn: authService.forgotPassword,
  });
};

export const useResetPasswordMutation = () => {
  return useMutation({
    mutationFn: authService.resetPassword,
  });
};
