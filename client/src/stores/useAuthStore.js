import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set, get) => ({
      // Client State Only (not server state)
      user: null,
      token: null,
      isAuthenticated: false,
      
      // Actions
      setAuth: (user, token) => {
        set({ user, token, isAuthenticated: true });
      },
      
      clearAuth: () => {
        set({ user: null, token: null, isAuthenticated: false });
      },
      
      updateUser: (updatedUser) => {
        set({ user: updatedUser });
      },
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