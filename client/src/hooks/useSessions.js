import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as sessionAPI from '../api/sessions';

// Query keys
export const sessionKeys = {
  all: ['sessions'],
  lists: () => [...sessionKeys.all, 'list'],
  list: (filters) => [...sessionKeys.lists(), { ...filters }],
  details: () => [...sessionKeys.all, 'detail'],
  detail: (id) => [...sessionKeys.details(), id],
};

// Hook for getting sessions with filters
export const useSessions = (filters = {}) => {
  return useQuery({
    queryKey: sessionKeys.list(filters),
    queryFn: () => sessionAPI.getSessions(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    keepPreviousData: true, // Keep old data while fetching new
  });
};

// Hook for getting single session
export const useSession = (id) => {
  return useQuery({
    queryKey: sessionKeys.detail(id),
    queryFn: () => sessionAPI.getSessionById(id),
    enabled: !!id, // Only run if id exists
    staleTime: 5 * 60 * 1000,
  });
};

// Hook for creating session
export const useCreateSession = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (sessionData) => sessionAPI.createSession(sessionData),
    onSuccess: () => {
      // Invalidate all session lists
      queryClient.invalidateQueries({ queryKey: sessionKeys.lists() });
    },
  });
};

// Hook for updating session
export const useUpdateSession = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }) => sessionAPI.updateSession(id, data),
    onSuccess: (data, variables) => {
      // Update the cache for the specific session
      queryClient.setQueryData(sessionKeys.detail(variables.id), data);
      // Invalidate all lists
      queryClient.invalidateQueries({ queryKey: sessionKeys.lists() });
    },
  });
};

// Hook for cancelling session
export const useCancelSession = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id) => sessionAPI.cancelSession(id),
    onSuccess: (data, id) => {
      queryClient.setQueryData(sessionKeys.detail(id), data);
      queryClient.invalidateQueries({ queryKey: sessionKeys.lists() });
    },
  });
};