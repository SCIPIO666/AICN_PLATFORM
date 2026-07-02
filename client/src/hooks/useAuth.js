import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as authAPI from '../api/auth';
import useAuthStore from '../stores/useAuthStore';
import { useUIModalStore } from '../stores';

// ===== QUERY KEYS =====
export const authKeys = {
  all: ['auth'],
  me: ['auth', 'me'],
  permissions: ['auth', 'permissions'],
};

// ===== HOOK: Get Current User (Auto-fetch on mount) =====
export const useMe = () => {
  const { setAuth, clearAuth, isAuthenticated, token } = useAuthStore();
  
  return useQuery({
    queryKey: authKeys.me,
    queryFn: async () => {
      try {
        const user = await authAPI.getMe();
        setAuth(user, token); 
        return user;
      } catch (error) {
        if (error.response?.status === 401) {
          clearAuth();
        }
        throw error;
      }
    },
    enabled: !!token, 
    staleTime: 5 * 60 * 1000, 
    retry: false,
  });
};

// ===== HOOK: Login =====
export const useLogin = () => {
  const queryClient = useQueryClient();
  const { setAuth, setLoading, setError } = useAuthStore();
  const { closeModal } = useUIModalStore();
  
  return useMutation({
    mutationFn: ({ email, password }) => authAPI.login(email, password),
    onMutate: () => {
      setLoading(true);
      setError(null);
    },
    onSuccess: (data) => {
      setAuth(data.user, data.token);

      localStorage.setItem('accessToken',data.token)
      if(data.refreshToken){localStorage.setItem('refreshToken',data.token)}

      queryClient.setQueryData(authKeys.me, data.user);
      closeModal('login'); // Close login modal if open
      setLoading(false);
      
      // Show success notification (you can integrate toast here)
      console.log('Login successful!');
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Login failed';
      setError(message);
      setLoading(false);
      
      // Return error for component handling
      return { error: message };
    },
  });
};

// ===== HOOK: Signup =====
export const useSignup = () => {
  const queryClient = useQueryClient();
  const { setLoading, setError } = useAuthStore();
  const { closeModal } = useUIModalStore();
  
  return useMutation({
    mutationFn: (userData) => authAPI.signup(userData),
    onMutate: () => {
      setLoading(true);
      setError(null);
    },
    onSuccess: (data) => {
      setLoading(false);
      closeModal('signup');
      // Optionally auto-login after signup
      // Or redirect to login page
      console.log('Signup successful! Please login.');
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Signup failed';
      setError(message);
      setLoading(false);
    },
  });
};

// ===== HOOK: Logout =====
export const useLogout = () => {
  const queryClient = useQueryClient();
  const { clearAuth, setLoading } = useAuthStore();
  
  return useMutation({
    mutationFn: () => authAPI.logout(),
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: () => {
      clearAuth();

      localStorage.removeItem('accessToken')
      if(localStorage.getItem('refreshToken')){localStorage.removeItem('refreshToken')}

      queryClient.clear(); // Clear all React Query cache
      setLoading(false);
      
      // Redirect to home
      window.location.href = '/';
    },
    onError: (error) => {
      console.error('Logout error:', error);
      // Still clear local auth even if API fails
      clearAuth();
      queryClient.clear();
      setLoading(false);
    },
  });
};

// ===== HOOK: Forgot Password =====
export const useForgotPassword = () => {
  const { setLoading, setError } = useAuthStore();
  
  return useMutation({
    mutationFn: (email) => authAPI.forgotPassword(email),
    onMutate: () => {
      setLoading(true);
      setError(null);
    },
    onSuccess: () => {
      setLoading(false);
      console.log('Password reset email sent!');
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Request failed';
      setError(message);
      setLoading(false);
    },
  });
};

// ===== HOOK: Reset Password =====
export const useResetPassword = () => {
  const { setLoading, setError } = useAuthStore();
  
  return useMutation({
    mutationFn: ({ token, newPassword, confirmPassword }) => 
      authAPI.resetPassword(token, newPassword, confirmPassword),
    onMutate: () => {
      setLoading(true);
      setError(null);
    },
    onSuccess: () => {
      setLoading(false);
      console.log('Password reset successful!');
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Password reset failed';
      setError(message);
      setLoading(false);
    },
  });
};

// ===== HOOK: Change Password (Authenticated) =====
export const useChangePassword = () => {
  const { setLoading, setError } = useAuthStore();
  
  return useMutation({
    mutationFn: ({ currentPassword, newPassword, confirmPassword }) =>
      authAPI.changePassword(currentPassword, newPassword, confirmPassword),
    onMutate: () => {
      setLoading(true);
      setError(null);
    },
    onSuccess: () => {
      setLoading(false);
      console.log('Password changed successfully!');
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Password change failed';
      setError(message);
      setLoading(false);
    },
  });
};

// ===== HOOK: Update Profile =====
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const { updateUser, setLoading, setError } = useAuthStore();
  
  return useMutation({
    mutationFn: async () => {
      throw new Error('Profile update endpoint is not available yet');
    },
    onMutate: () => {
      setLoading(true);
      setError(null);
    },
    onSuccess: (updatedUser) => {
      updateUser(updatedUser);
      queryClient.setQueryData(authKeys.me, updatedUser);
      setLoading(false);
      console.log('Profile updated successfully!');
    },
    onError: (error) => {
      const message = error.response?.data?.message || error.message || 'Profile update failed';
      setError(message);
      setLoading(false);
    },
  });
};
