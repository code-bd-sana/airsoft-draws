import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authService, AuthResponse } from '../services/auth.service';
import { useRouter } from 'next/navigation';

export const useLoginMutation = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: authService.login,
    onSuccess: (data: AuthResponse) => {
      if (data?.user) {
        queryClient.setQueryData(['user'], data.user);
        
        // Redirect based on role
        if (data.user.role === 'HOST') {
          router.push('/host/dashboard'); // Use /host/dashboard consistently
        } else {
          router.push('/dashboard');
        }
      }
    },
  });
};

export const useRegisterMutation = () => {
  return useMutation({
    mutationFn: authService.register,
  });
};

export const useVerifyEmailMutation = () => {
  return useMutation({
    mutationFn: authService.verifyEmail,
  });
};

export const useResendVerificationMutation = () => {
  return useMutation({
    mutationFn: authService.resendVerification,
  });
};

export const useAuthUser = () => {
  return useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      try {
        const { user } = await authService.me();
        return user;
      } catch (error) {
        return null;
      }
    },
    staleTime: 5 * 60 * 1000, // keep user data fresh for 5 minutes
    retry: false, // Do not retry on failure (e.g. 401)
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return async () => {
    try {
      await authService.logout();
    } catch (e) {
      console.error('Logout failed', e);
    } finally {
      queryClient.setQueryData(['user'], null);
      queryClient.clear();
      router.push('/login');
    }
  };
};
