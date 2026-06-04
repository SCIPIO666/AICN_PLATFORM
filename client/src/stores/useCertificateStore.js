import { create } from 'zustand';
import * as certificateAPI from '../api/certificates';

const useCertificateStore = create((set, get) => ({
  // State
  certificates: [],
  currentCertificate: null,
  pagination: null,
  isLoading: false,
  error: null,
  verificationResult: null,

  // Actions
  fetchMyCertificates: async (page = 1, limit = 10) => {
    set({ isLoading: true, error: null });
    try {
      const response = await certificateAPI.getMyCertificates({ page, limit });
      set({
        certificates: response.data,
        pagination: response.pagination,
        isLoading: false,
      });
      return { success: true, data: response };
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch certificates', 
        isLoading: false 
      });
      return { success: false, error: error.response?.data?.message };
    }
  },

  verifyCertificate: async (certificateCode) => {
    set({ isLoading: true, error: null, verificationResult: null });
    try {
      const certificate = await certificateAPI.verifyCertificate(certificateCode);
      set({ 
        verificationResult: { valid: true, data: certificate },
        isLoading: false 
      });
      return { success: true, data: certificate };
    } catch (error) {
      const message = error.response?.data?.message || 'Certificate verification failed';
      set({ 
        verificationResult: { valid: false, message },
        error: message,
        isLoading: false 
      });
      return { success: false, error: message };
    }
  },

  issueCertificate: async (userId, sessionId) => {
    set({ isLoading: true, error: null });
    try {
      const certificate = await certificateAPI.issueCertificate(userId, sessionId);
      set(state => ({ 
        certificates: [certificate, ...state.certificates],
        isLoading: false 
      }));
      return { success: true, data: certificate };
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to issue certificate', 
        isLoading: false 
      });
      return { success: false, error: error.response?.data?.message };
    }
  },

  batchIssueCertificates: async (sessionId) => {
    set({ isLoading: true, error: null });
    try {
      const result = await certificateAPI.batchIssueCertificates(sessionId);
      set({ isLoading: false });
      return { success: true, data: result };
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Batch issuance failed', 
        isLoading: false 
      });
      return { success: false, error: error.response?.data?.message };
    }
  },

  clearVerification: () => set({ verificationResult: null }),
  clearError: () => set({ error: null }),
}));

export default useCertificateStore;