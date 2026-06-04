import { create } from 'zustand';

const useUIModalStore = create((set) => ({
  modals: {
    login: false,
    signup: false,
    enrolment: false,
    certificate: false,
    announcement: false,
  },
  modalData: null,
  
  openModal: (modalName, data = null) => set((state) => ({ 
    modals: { ...state.modals, [modalName]: true },
    modalData: data 
  })),
  
  closeModal: (modalName) => set((state) => ({ 
    modals: { ...state.modals, [modalName]: false },
    modalData: null 
  })),
  
  closeAllModals: () => set({ 
    modals: { login: false, signup: false, enrolment: false, certificate: false, announcement: false },
    modalData: null 
  }),
}));

export default useUIModalStore;