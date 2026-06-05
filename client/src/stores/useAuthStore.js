import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set, get) => ({
      // ===== STATE =====
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      
      // ===== BASIC ACTIONS (No API calls) =====
      setAuth: (user, token) => {
        set({ 
          user, 
          token, 
          isAuthenticated: true, 
          isLoading: false, 
          error: null 
        });
      },
      
      clearAuth: () => {
        set({ 
          user: null, 
          token: null, 
          isAuthenticated: false, 
          isLoading: false,
          error: null 
        });
      },
      
      setLoading: (isLoading) => set({ isLoading }),
      
      setError: (error) => set({ error }),
      
      updateUser: (updatedUser) => set({ user: updatedUser }),
      
      // ===== COMPUTED VALUES =====
      getUserRole: () => get().user?.role || null,
      
      hasRole: (roles) => {
        const userRole = get().user?.role;
        return roles.includes(userRole);
      },
      
      isAdmin: () => get().user?.role === 'ADMIN',
      
      isTrainer: () => get().user?.role === 'TRAINER',
      
      isLearner: () => get().user?.role === 'LEARNER',
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);

export default useAuthStore;