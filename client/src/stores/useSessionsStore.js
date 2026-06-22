
import { create } from 'zustand';
const useSessionsDetailsModalStore = create((set, get) => ({
  modals: [detailsModal,enrollModal],
  openModal: (modalId, props = {}) => {
    set((state) => ({
      modals: {
        ...state.modals,
        [modalId]: {
          isOpen: true,
          props: props,
        },
      },
    }));
  },
  
  closeModal: (modalId) => {
    set((state) => {
      const newModals = { ...state.modals };
      delete newModals[modalId];
      return { modals: newModals };
    });
  },
  

  closeAllModals: () => {
    set({ modals: [] });
  },
  

  getModalState: (modalId) => {
    return get().modals[modalId] || { isOpen: false, props: {} };
  },
  
  isModalOpen: (modalId) => {
    return !!get().modals[modalId]?.isOpen;
  },
}));

export default useModalStore;