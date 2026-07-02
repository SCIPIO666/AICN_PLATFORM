// src/hooks/useCertificates.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as certificateAPI from '../api/certificates';
import useAuthStore from '../stores/useAuthStore';
import { toast } from '@/stores/toastStore';

// Query keys
export const certificateKeys = {
  all: ['certificates'],
  myCertificates: () => [...certificateKeys.all, 'my'],
  myCertificatesList: (page, limit) => [...certificateKeys.myCertificates(), { page, limit }],
  adminCertificates: () => [...certificateKeys.all, 'admin'],
  adminCertificatesList: (filters) => [...certificateKeys.adminCertificates(), { ...filters }],
  stats: () => [...certificateKeys.all, 'stats'],
  verify: (code) => [...certificateKeys.all, 'verify', code],
};

// Hook for getting my certificates
export const useMyCertificates = (page = 1, limit = 10) => {
  const { isAuthenticated } = useAuthStore();
  
  return useQuery({
    queryKey: certificateKeys.myCertificatesList(page, limit),
    queryFn: () => certificateAPI.getMyCertificates({ page, limit }),
    enabled: isAuthenticated,
    staleTime: 10 * 60 * 1000,
  });
};

// Admin certificates hook 
export const useAdminCertificates = (filters = {}) => {
  const { user, isAuthenticated, token } = useAuthStore();
  const isAdmin = user?.role === 'ADMIN';
  
  return useQuery({
    queryKey: certificateKeys.adminCertificatesList(filters),
    queryFn: () => certificateAPI.getAllCertificates(filters),
    enabled: isAuthenticated && isAdmin && !!token, // 
    keepPreviousData: true,
    retry: false, 
  });
};

// Certificate stats hook 
export const useCertificateStats = () => {
  const { user, isAuthenticated, token } = useAuthStore();
  const isAdmin = user?.role === 'ADMIN';
  
  return useQuery({
    queryKey: certificateKeys.stats(),
    queryFn: () => certificateAPI.getCertificateStats(),
    enabled: isAuthenticated && isAdmin && !!token, 
    staleTime: 2 * 60 * 1000,
    retry: false, //
  });
};

// Hook for verifying certificate (public)
export const useVerifyCertificate = (certificateCode) => {
  return useQuery({
    queryKey: certificateKeys.verify(certificateCode),
    queryFn: () => certificateAPI.verifyCertificate(certificateCode),
    enabled: !!certificateCode,
    retry: false,
  });
};

// Hook for issuing certificate (Admin)
export const useIssueCertificate = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ userId, sessionId }) => 
      certificateAPI.issueCertificate(userId, sessionId),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: certificateKeys.adminCertificates() });
      queryClient.invalidateQueries({ queryKey: certificateKeys.stats() });
      if (response?.data?.emailSent === false) {
        toast.warning('Certificate issued and PDF stored, but email was not sent');
      } else {
        toast.success('Certificate issued, stored, and emailed');
      }
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Failed to issue certificate');
    }
  });
};

// Hook for batch issuing certificates (Admin)
export const useBatchIssueCertificates = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (sessionId) => certificateAPI.batchIssueCertificates(sessionId),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: certificateKeys.adminCertificates() });
      queryClient.invalidateQueries({ queryKey: certificateKeys.stats() });
      const failed = response?.data?.failed || 0;
      const issued = response?.data?.issued || 0;
      if (failed > 0) {
        toast.warning(`${issued} certificates issued, ${failed} failed`);
      } else {
        toast.success('Certificates issued, stored, and emailed');
      }
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Failed to issue certificates');
    }
  });
};
