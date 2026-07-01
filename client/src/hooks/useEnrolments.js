import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as enrolmentAPI from '../api/enrolments';
import useAuthStore from '../stores/useAuthStore';
import { toast } from '@/stores/toastStore';

export const enrolmentKeys = {
  all: ['enrolments'],
  myEnrolments: () => [...enrolmentKeys.all, 'my'],
  myEnrolmentsList: (filters) => [...enrolmentKeys.myEnrolments(), { ...filters }],
  detail: (id) => [...enrolmentKeys.all, 'detail', id],
};

export const useMyEnrolments = (filters = {}) => {
  const { isAuthenticated } = useAuthStore();
  return useQuery({
    queryKey: enrolmentKeys.myEnrolmentsList(filters),
    queryFn: () => enrolmentAPI.getMyEnrolments(filters),
    enabled: isAuthenticated,
    staleTime: 2 * 60 * 1000,
    keepPreviousData: true,
  });
};

export const useEnrolInSession = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (sessionId) => enrolmentAPI.enrolInSession(sessionId),
    onSuccess: () => {
      // Invalidate both so SessionCard status updates & MyEnrolments page refreshes
      queryClient.invalidateQueries({ queryKey: enrolmentKeys.myEnrolments() });
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
      toast.success('Enrolled successfully!');
    },
    onError: (error) => {
      const status = error?.response?.status;
      const message = error?.response?.data?.message || '';
      if (status === 409 || message.toLowerCase().includes('already enrolled')) {
        toast.error('You are already enrolled in this session.');
        return;
      }
      if (message.toLowerCase().includes('capacity') || message.toLowerCase().includes('full')) {
        toast.error('This session is full. No spots remaining.');
        return;
      }
      if (message.toLowerCase().includes('cancelled')) {
        toast.error('This session has been cancelled and is no longer accepting enrolments.');
        return;
      }
      if (message.toLowerCase().includes('not available') || message.toLowerCase().includes('not scheduled')) {
        toast.error('This session is not currently open for enrolment.');
        return;
      }
      toast.error(message || 'Enrolment failed. Please try again.');
    },
  });
};

export const useCancelEnrolment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ enrolmentId, reason }) => enrolmentAPI.cancelEnrolment(enrolmentId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: enrolmentKeys.myEnrolments() });
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
      toast.success('Enrolment cancelled successfully.');
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Cancellation failed. Please try again.');
    },
  });
};

export const useMarkAttendance = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ enrolmentId, status }) => enrolmentAPI.markAttendance(enrolmentId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: enrolmentKeys.myEnrolments() });
      queryClient.invalidateQueries({ queryKey: ['trainer', 'sessions'] });
      toast.success('Attendance marked.');
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Failed to mark attendance.');
    },
  });
};