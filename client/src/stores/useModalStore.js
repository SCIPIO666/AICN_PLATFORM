
import { create } from 'zustand';

const useModalStore = create((set) => ({
  isOpen: false,
  modalType: null, // 'trainerProfile', 'sessionDetails', 'enrolConfirm'
  modalData: null,

  openModal: (type, data) => 
    set({ 
      isOpen: true, 
      modalType: type, 
      modalData: data 
    }),
  
  closeModal: () => 
    set({ 
      isOpen: false, 
      modalType: null, 
      modalData: null 
    }),
}));

export default useModalStore;