
import { create } from 'zustand';

export const useDashboardStore = create((set) => ({
  showAnnouncements: true,
  showRecentActivity: true,

  toggleAnnouncements: () => 
    set((state) => ({ showAnnouncements: !state.showAnnouncements })),
  
  toggleRecentActivity: () => 
    set((state) => ({ showRecentActivity: !state.showRecentActivity })),
}));