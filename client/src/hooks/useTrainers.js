import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as trainerAPI from '../api/trainers';
import { getMe } from '@/api/auth';
import useAuthStore from '../stores/useAuthStore';
import { toast } from '@/stores/toastStore';
// Query keys
export const trainerKeys = {
  all: ['trainers'],
  publicTrainers: () => [...trainerKeys.all, 'public'],
  publicTrainersList: (filters) => [...trainerKeys.publicTrainers(), { ...filters }],
  myProfile: () => [...trainerKeys.all, 'my-profile'],
  mySessions: () => [...trainerKeys.all, 'my-sessions'],
  mySessionsList: (filters) => [...trainerKeys.mySessions(), { ...filters }],
  applications: () => [...trainerKeys.all, 'applications'],
  applicationsList: (filters) => [...trainerKeys.applications(), { ...filters }],
  applicationDetail: (id) => [...trainerKeys.applications(), id],
};


export const useTrainers = (filters = {}) => {
  return useQuery({
    queryKey: trainerKeys.publicTrainersList(filters),
    queryFn: () => trainerAPI.getTrainers(filters),
    staleTime: 15 * 60 * 1000, // 15 minutes
    keepPreviousData: true,
  });
};

export const useMyTrainerProfile = () => {
  const { user, isAuthenticated } = useAuthStore();
  const isTrainer = user?.role === 'TRAINER' || user?.role === 'ADMIN';
  
  return useQuery({
    queryKey: trainerKeys.myProfile(),
    queryFn: () => trainerAPI.getMyTrainerProfile(),
    enabled: isAuthenticated, //&& isTrainer
    staleTime: 5 * 60 * 1000,
  });
};


export const useApplyAsTrainer = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (applicationData) => trainerAPI.applyForTrainer(applicationData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: trainerKeys.myProfile() });
      toast.info('application sent successfully')
    },
    onError : (error)=>{
      toast.error(error?.message || 'Application failed, please try again');
    }
  });
};


export const useUpdateTrainerProfile = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (profileData) => trainerAPI.updateMyTrainerProfile(profileData),
    onSuccess: (data) => {
      queryClient.setQueryData(trainerKeys.myProfile(), data);
    },
  });
};


export const useMyTrainerSessions = (filters = {}) => {
  const { user, isAuthenticated } = useAuthStore();
  const isTrainer = user?.role === 'TRAINER' || user?.role === 'ADMIN';
  
  return useQuery({
    queryKey: trainerKeys.mySessionsList(filters),
    queryFn: () => trainerAPI.getMyTrainerSessions(filters),
    enabled: isAuthenticated && isTrainer,
    staleTime: 3 * 60 * 1000,
    keepPreviousData: true,
  });
};


export const useTrainerApplications = (filters = {}) => {
  const { user, isAuthenticated } = useAuthStore();
  const isAdmin = user?.role === 'ADMIN';
  
  return useQuery({
    queryKey: trainerKeys.applicationsList(filters),
    queryFn: () => trainerAPI.getAllTrainerApplications(filters),
    enabled: isAuthenticated && isAdmin,
    staleTime: 2 * 60 * 1000,
    keepPreviousData: true,
  });
};

export const useApproveTrainer = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ applicationId, message }) => 
      trainerAPI.approveTrainerApplication(applicationId, message),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: trainerKeys.applications() });
      queryClient.invalidateQueries({ queryKey: trainerKeys.publicTrainers() });
    },
  });
};

export const useRejectTrainer = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ applicationId, reason, feedback }) => 
      trainerAPI.rejectTrainerApplication(applicationId, reason, feedback),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: trainerKeys.applications() });
    },
  });
};


