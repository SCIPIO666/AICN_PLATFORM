import { create } from 'zustand';
import * as enrolmentAPI from '../api/enrolments';

const useEnrolmentStore = create((set, get) => ({
  // State
  enrolments: [],
  currentEnrolment: null,
  pagination: null,
  isLoading: false,
  error: null,
  filters: {
    status: '',
    fromDate: '',
    toDate: '',
    page: 1,
    limit: 10,
  },

  // Actions
  fetchMyEnrolments: async (customFilters = {}) => {
    set({ isLoading: true, error: null });
    try {
      const filters = { ...get().filters, ...customFilters };
      const response = await enrolmentAPI.getMyEnrolments(filters);
      set({
        enrolments: response.data,
        pagination: response.pagination,
        filters,
        isLoading: false,
      });
      return { success: true, data: response };
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch enrolments', 
        isLoading: false 
      });
      return { success: false, error: error.response?.data?.message };
    }
  },

  enrolInSession: async (sessionId) => {
    set({ isLoading: true, error: null });
    try {
      const enrolment = await enrolmentAPI.enrolInSession(sessionId);
      set(state => ({ 
        enrolments: [enrolment, ...state.enrolments],
        isLoading: false 
      }));
      return { success: true, data: enrolment };
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to enrol', 
        isLoading: false 
      });
      return { success: false, error: error.response?.data?.message };
    }
  },

  cancelEnrolment: async (enrolmentId, reason = null) => {
    set({ isLoading: true, error: null });
    try {
      const cancelledEnrolment = await enrolmentAPI.cancelEnrolment(enrolmentId, reason);
      set(state => ({
        enrolments: state.enrolments.map(e => e.id === enrolmentId ? cancelledEnrolment : e),
        currentEnrolment: cancelledEnrolment,
        isLoading: false,
      }));
      return { success: true, data: cancelledEnrolment };
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to cancel enrolment', 
        isLoading: false 
      });
      return { success: false, error: error.response?.data?.message };
    }
  },

  markAttendance: async (enrolmentId, status) => {
    set({ isLoading: true, error: null });
    try {
      const updatedEnrolment = await enrolmentAPI.markAttendance(enrolmentId, status);
      set(state => ({
        enrolments: state.enrolments.map(e => e.id === enrolmentId ? updatedEnrolment : e),
        currentEnrolment: updatedEnrolment,
        isLoading: false,
      }));
      return { success: true, data: updatedEnrolment };
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to mark attendance', 
        isLoading: false 
      });
      return { success: false, error: error.response?.data?.message };
    }
  },

  setFilters: (newFilters) => {
    set(state => ({ 
      filters: { ...state.filters, ...newFilters, page: 1 } 
    }));
    get().fetchMyEnrolments();
  },

  clearError: () => set({ error: null }),
}));

export default useEnrolmentStore;