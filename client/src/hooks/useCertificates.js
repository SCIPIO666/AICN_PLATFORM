import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as certificateAPI from '../api/certificates';
import useAuthStore from '../stores/useAuthStore';

// Query keys
export const certificateKeys = {
  all: ['certificates'],
  myCertificates: () => [...certificateKeys.all, 'my'],
  myCertificatesList: (page, limit) => [...certificateKeys.myCertificates(), { page, limit }],
  verify: (code) => [...certificateKeys.all, 'verify', code],
};

// Hook for getting my certificates
export const useMyCertificates = (page = 1, limit = 10) => {
  const { isAuthenticated } = useAuthStore();
  
  return useQuery({
    queryKey: certificateKeys.myCertificatesList(page, limit),
    queryFn: () => certificateAPI.getMyCertificates({ page, limit }),
    enabled: isAuthenticated,
    staleTime: 10 * 60 * 1000, // 10 minutes
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: certificateKeys.myCertificates() });
    },
  });
};

// Hook for batch issuing certificates (Admin)
export const useBatchIssueCertificates = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (sessionId) => certificateAPI.batchIssueCertificates(sessionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: certificateKeys.all });
    },
  });
};