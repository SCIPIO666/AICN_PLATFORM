import { create } from 'zustand';
import * as sessionAPI from '../api/sessions';

const useSessionStore = create((set, get) => ({
  // State
  sessions: [],
  currentSession: null,
  pagination: null,
  isLoading: false,
  error: null,
  filters: {
    upcoming: true,
    status: '',
    skillArea: '',
    locationType: '',
    county: '',
    trainerId: '',
    fromDate: '',
    toDate: '',
    page: 1,
    limit: 12,
  },

  // Actions
  fetchSessions: async (customFilters = {}) => {
    set({ isLoading: true, error: null });
    try {
      const filters = { ...get().filters, ...customFilters };
      const response = await sessionAPI.getSessions(filters);
      set({
        sessions: response.data,
        pagination: response.pagination,
        filters,
        isLoading: false,
      });
      return { success: true, data: response };
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch sessions', 
        isLoading: false 
      });
      return { success: false, error: error.response?.data?.message };
    }
  },

  fetchSessionById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const session = await sessionAPI.getSessionById(id);
      set({ currentSession: session, isLoading: false });
      return { success: true, data: session };
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Session not found', 
        isLoading: false 
      });
      return { success: false, error: error.response?.data?.message };
    }
  },

  createSession: async (sessionData) => {
    set({ isLoading: true, error: null });
    try {
      const newSession = await sessionAPI.createSession(sessionData);
      set(state => ({ 
        sessions: [newSession, ...state.sessions],
        isLoading: false 
      }));
      return { success: true, data: newSession };
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to create session', 
        isLoading: false 
      });
      return { success: false, error: error.response?.data?.message };
    }
  },

  updateSession: async (id, sessionData) => {
    set({ isLoading: true, error: null });
    try {
      const updatedSession = await sessionAPI.updateSession(id, sessionData);
      set(state => ({
        sessions: state.sessions.map(s => s.id === id ? updatedSession : s),
        currentSession: updatedSession,
        isLoading: false,
      }));
      return { success: true, data: updatedSession };
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to update session', 
        isLoading: false 
      });
      return { success: false, error: error.response?.data?.message };
    }
  },

  cancelSession: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const cancelledSession = await sessionAPI.cancelSession(id);
      set(state => ({
        sessions: state.sessions.map(s => s.id === id ? cancelledSession : s),
        currentSession: cancelledSession,
        isLoading: false,
      }));
      return { success: true, data: cancelledSession };
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to cancel session', 
        isLoading: false 
      });
      return { success: false, error: error.response?.data?.message };
    }
  },

  setFilters: (newFilters) => {
    set(state => ({ 
      filters: { ...state.filters, ...newFilters, page: 1 } 
    }));
    get().fetchSessions();
  },

  resetFilters: () => {
    set({
      filters: {
        upcoming: true,
        status: '',
        skillArea: '',
        locationType: '',
        county: '',
        trainerId: '',
        fromDate: '',
        toDate: '',
        page: 1,
        limit: 12,
      }
    });
    get().fetchSessions();
  },

  clearError: () => set({ error: null }),
}));

export default useSessionStore;