import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import * as authAPI from '../api/auth';

const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authAPI.login(email, password);
          set({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
            isLoading: false,
          });
          return { success: true, data: response };
        } catch (error) {
          set({ 
            error: error.response?.data?.message || 'Login failed', 
            isLoading: false 
          });
          return { success: false, error: error.response?.data?.message };
        }
      },

      signup: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          const user = await authAPI.signup(userData);
          set({ isLoading: false });
          return { success: true, data: user };
        } catch (error) {
          set({ 
            error: error.response?.data?.message || 'Signup failed', 
            isLoading: false 
          });
          return { success: false, error: error.response?.data?.message };
        }
      },

      logout: async () => {
        set({ isLoading: true });
        try {
          await authAPI.logout();
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        }
      },

      getMe: async () => {
        set({ isLoading: true });
        try {
          const user = await authAPI.getMe();
          set({ user, isAuthenticated: true, isLoading: false });
          return user;
        } catch (error) {
          set({ 
            user: null, 
            isAuthenticated: false, 
            isLoading: false,
            error: error.response?.data?.message 
          });
          return null;
        }
      },

      changePassword: async (currentPassword, newPassword, confirmPassword) => {
        set({ isLoading: true, error: null });
        try {
          await authAPI.changePassword(currentPassword, newPassword, confirmPassword);
          set({ isLoading: false });
          return { success: true };
        } catch (error) {
          set({ 
            error: error.response?.data?.message || 'Password change failed', 
            isLoading: false 
          });
          return { success: false, error: error.response?.data?.message };
        }
      },

      forgotPassword: async (email) => {
        set({ isLoading: true, error: null });
        try {
          await authAPI.forgotPassword(email);
          set({ isLoading: false });
          return { success: true };
        } catch (error) {
          set({ 
            error: error.response?.data?.message || 'Request failed', 
            isLoading: false 
          });
          return { success: false, error: error.response?.data?.message };
        }
      },

      resetPassword: async (token, newPassword, confirmPassword) => {
        set({ isLoading: true, error: null });
        try {
          await authAPI.resetPassword(token, newPassword, confirmPassword);
          set({ isLoading: false });
          return { success: true };
        } catch (error) {
          set({ 
            error: error.response?.data?.message || 'Password reset failed', 
            isLoading: false 
          });
          return { success: false, error: error.response?.data?.message };
        }
      },

      updateProfile: async (profileData) => {
        set({ isLoading: true, error: null });
        try {
          const updatedUser = await authAPI.updateProfile(profileData);
          set({ user: updatedUser, isLoading: false });
          return { success: true, data: updatedUser };
        } catch (error) {
          set({ 
            error: error.response?.data?.message || 'Profile update failed', 
            isLoading: false 
          });
          return { success: false, error: error.response?.data?.message };
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage', // localStorage key
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token, 
        isAuthenticated: state.isAuthenticated 
      }), // Only persist these fields
    }
  )
);

export default useAuthStore;