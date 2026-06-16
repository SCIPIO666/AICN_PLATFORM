import { create } from 'zustand'

export const useCertificateUI = create((set)=>({
  isModalOpen: false,        
  selectedCertificate: null, 

  openViewModal: () => set({ 
    isModalOpen: true, 
    selectedEnrolment: null 
  }),

toggleModal: () => set((state) => ({ 
    isModalOpen: !state.isModalOpen 
  })),

closeViewModal: () => set({ isModalOpen: false, modalMode: null, selectedEnrolment: null }),
}))
