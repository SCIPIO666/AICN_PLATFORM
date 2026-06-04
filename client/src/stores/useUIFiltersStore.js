import { create } from 'zustand';

const useUIFiltersStore = create((set) => ({
  // Session filters
  sessionFilters: {
    upcoming: true,
    skillArea: '',
    locationType: '',
    county: '',
    page: 1,
    limit: 12,
  },
  
  setSessionFilters: (newFilters) => set((state) => ({ 
    sessionFilters: { ...state.sessionFilters, ...newFilters, page: 1 } 
  })),
  
  resetSessionFilters: () => set({ 
    sessionFilters: { upcoming: true, skillArea: '', locationType: '', county: '', page: 1, limit: 12 }
  }),
  
  // Enrolment filters
  enrolmentFilters: {
    status: '',
    fromDate: '',
    toDate: '',
    page: 1,
    limit: 10,
  },
  
  setEnrolmentFilters: (newFilters) => set((state) => ({ 
    enrolmentFilters: { ...state.enrolmentFilters, ...newFilters, page: 1 } 
  })),
  
  // Trainer filters
  trainerFilters: {
    skill: '',
    search: '',
    page: 1,
    limit: 12,
  },
  
  setTrainerFilters: (newFilters) => set((state) => ({ 
    trainerFilters: { ...state.trainerFilters, ...newFilters, page: 1 } 
  })),
  
  // Admin user filters
  userFilters: {
    role: '',
    search: '',
    page: 1,
    limit: 10,
  },
  
  setUserFilters: (newFilters) => set((state) => ({ 
    userFilters: { ...state.userFilters, ...newFilters, page: 1 } 
  })),
}));

export default useUIFiltersStore;