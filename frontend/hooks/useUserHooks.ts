import { useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '../services/user.service';
import { authService } from '../services/auth.service';

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
