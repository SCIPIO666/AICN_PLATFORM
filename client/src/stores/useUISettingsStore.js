import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useUISettingsStore = create(
  persist(
    (set) => ({
      // UI Settings
      sidebarOpen: true,
      theme: 'light', // 'light' or 'dark'
      notifications: [],
      
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      
      setTheme: (theme) => set({ theme }),
      
      addNotification: (notification) => {
        const id = Date.now();
        set((state) => ({ 
          notifications: [...state.notifications, { ...notification, id, createdAt: new Date() }] 
        }));
        
        // Auto remove after 5 seconds
        setTimeout(() => {
          set((state) => ({ 
            notifications: state.notifications.filter(n => n.id !== id) 
          }));
        }, 5000);
      },
      
      removeNotification: (id) => set((state) => ({ 
        notifications: state.notifications.filter(n => n.id !== id) 
      })),
      
      clearNotifications: () => set({ notifications: [] }),
    }),
    {
      name: 'ui-settings',
      partialize: (state) => ({ theme: state.theme, sidebarOpen: state.sidebarOpen }),
    }
  )
);

export default useUISettingsStore;