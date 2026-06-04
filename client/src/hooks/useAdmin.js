import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as adminAPI from '../api/admin';
import useAuthStore from '../stores/useAuthStore';

// Query keys
export const adminKeys = {
  stats: ['admin', 'stats'],
  users: ['admin', 'users'],
  usersList: (filters) => [...adminKeys.users, { ...filters }],
  announcements: ['admin', 'announcements'],
  announcementsList: (filters) => [...adminKeys.announcements, { ...filters }],
  announcementDetail: (id) => [...adminKeys.announcements, id],
};

// Hook for getting admin stats
export const useAdminStats = () => {
  const { user, isAuthenticated } = useAuthStore();
  const isAdmin = user?.role === 'ADMIN';
  
  return useQuery({
    queryKey: adminKeys.stats,
    queryFn: () => adminAPI.getAdminStats(),
    enabled: isAuthenticated && isAdmin,
    staleTime: 5 * 60 * 1000,
    refetchInterval: 30000, // Refetch every 30 seconds for live stats
  });
};

// Hook for getting users (Admin only)
export const useUsers = (filters = {}) => {
  const { user, isAuthenticated } = useAuthStore();
  const isAdmin = user?.role === 'ADMIN';
  
  return useQuery({
    queryKey: adminKeys.usersList(filters),
    queryFn: () => adminAPI.getAllUsers(filters),
    enabled: isAuthenticated && isAdmin,
    staleTime: 3 * 60 * 1000,
    keepPreviousData: true,
  });
};

// Hook for updating user role
export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ userId, newRole, approvalMessage, rejectionReason, isRejection }) =>
      adminAPI.updateUserRole(userId, newRole, approvalMessage, rejectionReason, isRejection),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.users });
      queryClient.invalidateQueries({ queryKey: adminKeys.stats });
      queryClient.invalidateQueries({ queryKey: ['trainers', 'applications'] });
    },
  });
};

// Hook for getting announcements (Admin)
export const useAnnouncements = (filters = {}) => {
  const { user, isAuthenticated } = useAuthStore();
  const isAdmin = user?.role === 'ADMIN';
  
  return useQuery({
    queryKey: adminKeys.announcementsList(filters),
    queryFn: () => adminAPI.getAllAnnouncements(filters),
    enabled: isAuthenticated && isAdmin,
    staleTime: 2 * 60 * 1000,
    keepPreviousData: true,
  });
};

// Hook for creating announcement
export const useCreateAnnouncement = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (announcementData) => adminAPI.createAnnouncement(announcementData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.announcements });
    },
  });
};

// Hook for updating announcement
export const useUpdateAnnouncement = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }) => adminAPI.updateAnnouncement(id, data),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(adminKeys.announcementDetail(variables.id), data);
      queryClient.invalidateQueries({ queryKey: adminKeys.announcements });
    },
  });
};

// Hook for deleting announcement
export const useDeleteAnnouncement = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id) => adminAPI.deleteAnnouncement(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.announcements });
    },
  });
};