
import { create } from 'zustand';

export const useAttendanceModalStore = create((set) => ({
  isOpen: false,
  sessionId: null,
  sessionData: null,
  
  openModal: (sessionId, sessionData) => 
    set({ 
      isOpen: true, 
      sessionId, 
      sessionData 
    }),
  
  closeModal: () => 
    set({ 
      isOpen: false, 
      sessionId: null, 
      sessionData: null 
    }),
}));