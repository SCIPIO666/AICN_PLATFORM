
import { create } from 'zustand';

export const useTrainerModalStore = create((set) => ({
  // Create Session Modal
  isCreateSessionOpen: false,
  sessionToEdit: null,
  
  openCreateSession: (session = null) => 
    set({ 
      isCreateSessionOpen: true, 
      sessionToEdit: session 
    }),
  
  closeCreateSession: () => 
    set({ 
      isCreateSessionOpen: false, 
      sessionToEdit: null 
    }),
}));