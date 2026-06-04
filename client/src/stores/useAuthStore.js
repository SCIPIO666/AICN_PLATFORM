import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set, get) => ({
      // Client State (not cached by React Query)
      user: null,
      token: null,
      isAuthenticated: false,
      
      // UI State
      loginModalOpen: false,
      signupModalOpen: false,
      
      // Actions (only client-side)
      setAuth: (user, token) => {
        set({ 
          user, 
          token, 
          isAuthenticated: true 
        });
      },
      
      clearAuth: () => {
        set({ 
          user: null, 
          token: null, 
          isAuthenticated: false 
        });
      },
      
      openLoginModal: () => set({ loginModalOpen: true }),
      closeLoginModal: () => set({ loginModalOpen: false }),
      openSignupModal: () => set({ signupModalOpen: true }),
      closeSignupModal: () => set({ signupModalOpen: false }),
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