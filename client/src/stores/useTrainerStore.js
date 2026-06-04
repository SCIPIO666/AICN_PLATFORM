import { create } from 'zustand';
import * as trainerAPI from '../api/trainers';

const useTrainerStore = create((set, get) => ({
  // State
  trainers: [],
  trainerProfile: null,
  trainerApplications: [],
  mySessions: [],
  pagination: null,
  isLoading: false,
  error: null,
  filters: {
    status: 'PENDING',
    skill: '',
    search: '',
    page: 1,
    limit: 10,
  },

  // Actions
  fetchTrainers: async (customFilters = {}) => {
    set({ isLoading: true, error: null });
    try {
      const filters = { ...get().filters, ...customFilters };
      const response = await trainerAPI.getTrainers(filters);
      set({
        trainers: response.data,
        pagination: response.pagination,
        isLoading: false,
      });
      return { success: true, data: response };
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch trainers', 
        isLoading: false 
      });
      return { success: false, error: error.response?.data?.message };
    }
  },

  applyForTrainer: async (applicationData) => {
    set({ isLoading: true, error: null });
    try {
      const profile = await trainerAPI.applyForTrainer(applicationData);
      set({ trainerProfile: profile, isLoading: false });
      return { success: true, data: profile };
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Application failed', 
        isLoading: false 
      });
      return { success: false, error: error.response?.data?.message };
    }
  },

  fetchMyTrainerProfile: async () => {
    set({ isLoading: true, error: null });
    try {
      const profile = await trainerAPI.getMyTrainerProfile();
      set({ trainerProfile: profile, isLoading: false });
      return { success: true, data: profile };
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Profile not found', 
        isLoading: false 
      });
      return { success: false, error: error.response?.data?.message };
    }
  },

  updateMyTrainerProfile: async (profileData) => {
    set({ isLoading: true, error: null });
    try {
      const updatedProfile = await trainerAPI.updateMyTrainerProfile(profileData);
      set({ trainerProfile: updatedProfile, isLoading: false });
      return { success: true, data: updatedProfile };
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Update failed', 
        isLoading: false 
      });
      return { success: false, error: error.response?.data?.message };
    }
  },

  withdrawApplication: async () => {
    set({ isLoading: true, error: null });
    try {
      await trainerAPI.withdrawTrainerApplication();
      set({ trainerProfile: null, isLoading: false });
      return { success: true };
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Withdrawal failed', 
        isLoading: false 
      });
      return { success: false, error: error.response?.data?.message };
    }
  },

  fetchMyTrainerSessions: async (filters = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await trainerAPI.getMyTrainerSessions(filters);
      set({ mySessions: response.data, pagination: response.pagination, isLoading: false });
      return { success: true, data: response };
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch sessions', 
        isLoading: false 
      });
      return { success: false, error: error.response?.data?.message };
    }
  },

  // Admin actions
  fetchAllApplications: async (customFilters = {}) => {
    set({ isLoading: true, error: null });
    try {
      const filters = { ...get().filters, ...customFilters };
      const response = await trainerAPI.getAllTrainerApplications(filters);
      set({
        trainerApplications: response.data,
        pagination: response.pagination,
        isLoading: false,
      });
      return { success: true, data: response };
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch applications', 
        isLoading: false 
      });
      return { success: false, error: error.response?.data?.message };
    }
  },

  approveApplication: async (applicationId, message = null) => {
    set({ isLoading: true, error: null });
    try {
      const approved = await trainerAPI.approveTrainerApplication(applicationId, message);
      set(state => ({
        trainerApplications: state.trainerApplications.map(a => 
          a.id === applicationId ? approved : a
        ),
        isLoading: false,
      }));
      return { success: true, data: approved };
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Approval failed', 
        isLoading: false 
      });
      return { success: false, error: error.response?.data?.message };
    }
  },

  rejectApplication: async (applicationId, reason = null, feedback = null) => {
    set({ isLoading: true, error: null });
    try {
      const rejected = await trainerAPI.rejectTrainerApplication(applicationId, reason, feedback);
      set(state => ({
        trainerApplications: state.trainerApplications.map(a => 
          a.id === applicationId ? rejected : a
        ),
        isLoading: false,
      }));
      return { success: true, data: rejected };
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Rejection failed', 
        isLoading: false 
      });
      return { success: false, error: error.response?.data?.message };
    }
  },

  setFilters: (newFilters) => {
    set(state => ({ 
      filters: { ...state.filters, ...newFilters, page: 1 } 
    }));
    get().fetchAllApplications();
  },

  clearError: () => set({ error: null }),
}));

export default useTrainerStore;