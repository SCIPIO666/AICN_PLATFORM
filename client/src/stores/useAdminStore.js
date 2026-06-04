import { create } from 'zustand';
import * as adminAPI from '../api/admin';

const useAdminStore = create((set, get) => ({
  // State
  stats: null,
  users: [],
  announcements: [],
  pagination: null,
  isLoading: false,
  error: null,
  userFilters: {
    role: '',
    search: '',
    page: 1,
    limit: 10,
  },
  announcementFilters: {
    audience: '',
    fromDate: '',
    toDate: '',
    page: 1,
    limit: 10,
  },

  // Actions
  fetchStats: async () => {
    set({ isLoading: true, error: null });
    try {
      const stats = await adminAPI.getAdminStats();
      set({ stats, isLoading: false });
      return { success: true, data: stats };
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch stats', 
        isLoading: false 
      });
      return { success: false, error: error.response?.data?.message };
    }
  },

  fetchUsers: async (customFilters = {}) => {
    set({ isLoading: true, error: null });
    try {
      const filters = { ...get().userFilters, ...customFilters };
      const response = await adminAPI.getAllUsers(filters);
      set({
        users: response.data,
        pagination: response.pagination,
        userFilters: filters,
        isLoading: false,
      });
      return { success: true, data: response };
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch users', 
        isLoading: false 
      });
      return { success: false, error: error.response?.data?.message };
    }
  },

  updateUserRole: async (userId, newRole, approvalMessage = null, rejectionReason = null, isRejection = false) => {
    set({ isLoading: true, error: null });
    try {
      const updatedUser = await adminAPI.updateUserRole(userId, newRole, approvalMessage, rejectionReason, isRejection);
      set(state => ({
        users: state.users.map(u => u.id === userId ? updatedUser : u),
        isLoading: false,
      }));
      return { success: true, data: updatedUser };
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to update role', 
        isLoading: false 
      });
      return { success: false, error: error.response?.data?.message };
    }
  },

  fetchAnnouncements: async (customFilters = {}) => {
    set({ isLoading: true, error: null });
    try {
      const filters = { ...get().announcementFilters, ...customFilters };
      const response = await adminAPI.getAllAnnouncements(filters);
      set({
        announcements: response.data,
        pagination: response.pagination,
        announcementFilters: filters,
        isLoading: false,
      });
      return { success: true, data: response };
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch announcements', 
        isLoading: false 
      });
      return { success: false, error: error.response?.data?.message };
    }
  },

  createAnnouncement: async (announcementData) => {
    set({ isLoading: true, error: null });
    try {
      const newAnnouncement = await adminAPI.createAnnouncement(announcementData);
      set(state => ({ 
        announcements: [newAnnouncement, ...state.announcements],
        isLoading: false 
      }));
      return { success: true, data: newAnnouncement };
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to create announcement', 
        isLoading: false 
      });
      return { success: false, error: error.response?.data?.message };
    }
  },

  updateAnnouncement: async (id, announcementData) => {
    set({ isLoading: true, error: null });
    try {
      const updatedAnnouncement = await adminAPI.updateAnnouncement(id, announcementData);
      set(state => ({
        announcements: state.announcements.map(a => a.id === id ? updatedAnnouncement : a),
        isLoading: false,
      }));
      return { success: true, data: updatedAnnouncement };
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to update announcement', 
        isLoading: false 
      });
      return { success: false, error: error.response?.data?.message };
    }
  },

  deleteAnnouncement: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await adminAPI.deleteAnnouncement(id);
      set(state => ({
        announcements: state.announcements.filter(a => a.id !== id),
        isLoading: false,
      }));
      return { success: true };
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to delete announcement', 
        isLoading: false 
      });
      return { success: false, error: error.response?.data?.message };
    }
  },

  setUserFilters: (newFilters) => {
    set(state => ({ 
      userFilters: { ...state.userFilters, ...newFilters, page: 1 } 
    }));
    get().fetchUsers();
  },

  setAnnouncementFilters: (newFilters) => {
    set(state => ({ 
      announcementFilters: { ...state.announcementFilters, ...newFilters, page: 1 } 
    }));
    get().fetchAnnouncements();
  },

  clearError: () => set({ error: null }),
}));

export default useAdminStore;