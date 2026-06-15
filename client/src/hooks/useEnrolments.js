import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as enrolmentAPI from '../api/enrolments';
import useAuthStore from '../stores/useAuthStore';
import { toast } from '@/stores/toastStore';

// Query keys
export const enrolmentKeys = {
  all: ['enrolments'],
  myEnrolments: () => [...enrolmentKeys.all, 'my'],
  myEnrolmentsList: (filters) => [...enrolmentKeys.myEnrolments(), { ...filters }],
  detail: (id) => [...enrolmentKeys.all, 'detail', id],
};

// Hook for getting my enrolments
export const useMyEnrolments = (filters = {}) => {
  const { isAuthenticated } = useAuthStore();
  
  return useQuery({
    queryKey: enrolmentKeys.myEnrolmentsList(filters),
    queryFn: () => enrolmentAPI.getMyEnrolments(filters),
    enabled: isAuthenticated,
    staleTime: 2 * 60 * 1000, // 2 minutes
    keepPreviousData: true,
  });
};

// Hook for enrolling in a session
export const useEnrolInSession = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (sessionId) => enrolmentAPI.enrolInSession(sessionId),
    onSuccess: () => {
      // Invalidate my enrolments
      queryClient.invalidateQueries({ queryKey: enrolmentKeys.myEnrolments() });
      // Invalidate session details to update enrolled count
      queryClient.invalidateQueries({ queryKey: ['sessions', 'detail'] });
    },
  });
};

// Hook for cancelling enrolment
export const useCancelEnrolment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ enrolmentId, reason }) => 
      enrolmentAPI.cancelEnrolment(enrolmentId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: enrolmentKeys.myEnrolments() });
    toast.success('Enrolment cancelled')
    },
  onError: (error) => {
    toast.error(error.response?.data?.message || 'Cancellation failed')
  },
    
  });
};

// Hook for marking attendance (Trainer/Admin)
export const useMarkAttendance = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ enrolmentId, status }) => 
      enrolmentAPI.markAttendance(enrolmentId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: enrolmentKeys.myEnrolments() });
      queryClient.invalidateQueries({ queryKey: ['trainer', 'sessions'] });
    },
  });
};