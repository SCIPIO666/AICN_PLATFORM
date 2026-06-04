import { create } from 'zustand';

const useUIStore = create((set) => ({
  // State
  sidebarOpen: true,
  theme: 'light',
  notifications: [],
  loadingStates: {},
  modals: {
    open: false,
    type: null,
    data: null,
  },

  // Actions
  toggleSidebar: () => set(state => ({ sidebarOpen: !state.sidebarOpen })),
  
  setTheme: (theme) => set({ theme }),
  
  addNotification: (notification) => {
    const id = Date.now();
    set(state => ({ 
      notifications: [...state.notifications, { ...notification, id }] 
    }));
    // Auto remove after 5 seconds
    setTimeout(() => {
      set(state => ({ 
        notifications: state.notifications.filter(n => n.id !== id) 
      }));
    }, 5000);
  },
  
  removeNotification: (id) => set(state => ({ 
    notifications: state.notifications.filter(n => n.id !== id) 
  })),
  
  setLoading: (key, isLoading) => set(state => ({ 
    loadingStates: { ...state.loadingStates, [key]: isLoading } 
  })),
  
  openModal: (type, data = null) => set({ 
    modals: { open: true, type, data } 
  }),
  
  closeModal: () => set({ 
    modals: { open: false, type: null, data: null } 
  }),
}));

export default useUIStore;