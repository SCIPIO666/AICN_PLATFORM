import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import useAuthStore from '../stores/useAuthStore';
import * as authAPI from '../api/auth';

// Query keys
export const authKeys = {
  me: ['auth', 'me'],
};

// Hook for getting current user
export const useMe = () => {
  const { setAuth, clearAuth } = useAuthStore();
  
  return useQuery({
    queryKey: authKeys.me,
    queryFn: async () => {
      const user = await authAPI.getMe();
      setAuth(user, null); // token is already in storage
      return user;
    },
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook for login
export const useLogin = () => {
  const queryClient = useQueryClient();
  const { setAuth } = useAuthStore();
  
  return useMutation({
    mutationFn: ({ email, password }) => authAPI.login(email, password),
    onSuccess: (data) => {
      setAuth(data.user, data.token);
      queryClient.setQueryData(authKeys.me, data.user);
      // Invalidate other queries that depend on auth
      queryClient.invalidateQueries({ queryKey: ['enrolments'] });
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
    },
  });
};

// Hook for signup
export const useSignup = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (userData) => authAPI.signup(userData),
    onSuccess: (data) => {
      // Optionally auto-login after signup
      queryClient.invalidateQueries({ queryKey: authKeys.me });
    },
  });
};

// Hook for logout
export const useLogout = () => {
  const queryClient = useQueryClient();
  const { clearAuth } = useAuthStore();
  
  return useMutation({
    mutationFn: () => authAPI.logout(),
    onSuccess: () => {
      clearAuth();
      // Clear all cached queries
      queryClient.clear();
    },
  });
};

// Hook for password change
export const useChangePassword = () => {
  return useMutation({
    mutationFn: ({ currentPassword, newPassword, confirmPassword }) => 
      authAPI.changePassword(currentPassword, newPassword, confirmPassword),
  });
};

// Hook for forgot password
export const useForgotPassword = () => {
  return useMutation({
    mutationFn: (email) => authAPI.forgotPassword(email),
  });
};

// Hook for reset password
export const useResetPassword = () => {
  return useMutation({
    mutationFn: ({ token, newPassword, confirmPassword }) => 
      authAPI.resetPassword(token, newPassword, confirmPassword),
  });
};