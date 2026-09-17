import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authService, AuthResponse } from '../services/auth.service';
import { useRouter } from 'next/navigation';

export const useLoginMutation = (customRedirect?: string) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: authService.login,
    onSuccess: (data: AuthResponse) => {
      const userObj = data?.user || (data as any);
      if (userObj) {
        queryClient.setQueryData(['user'], userObj);
        
        if (typeof window !== 'undefined' && userObj.email) {
          try {
            localStorage.setItem('user_email', userObj.email);
            localStorage.setItem('user_data', JSON.stringify(userObj));
          } catch {}
        }
        
        let destination = customRedirect;
        if (!destination && typeof window !== 'undefined') {
          const params = new URLSearchParams(window.location.search);
          destination = params.get('redirect') || undefined;
        }

        // Redirect to specified destination (e.g. /checkout) or dashboard
        router.push(destination || '/dashboard');
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
        const res: any = await authService.me();
        const user = res?.user || res;
        if (user && typeof window !== 'undefined') {
          if (user.email) {
            try {
              localStorage.setItem('user_email', user.email);
              localStorage.setItem('user_data', JSON.stringify(user));
            } catch {}
          }
        }
        return user || null;
      } catch (error) {
        return null;
      }
    },
    staleTime: 5 * 60 * 1000, // keep user data fresh for 5 minutes
    retry: false, // Do not retry on failure (e.g. 401)
  });
};

export const useLogoutMutation = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      queryClient.setQueryData(['user'], null);
      if (typeof window !== 'undefined') {
        try {
          localStorage.removeItem('user_email');
          localStorage.removeItem('user_data');
        } catch {}
      }
      router.push('/login');
    },
  });
};

export const useLogout = () => {
  const mutation = useLogoutMutation();
  const logoutFn = async () => {
    await mutation.mutateAsync();
  };
  return Object.assign(logoutFn, mutation);
};
