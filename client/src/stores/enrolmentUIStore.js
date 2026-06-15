import { create } from 'zustand'

export const useEnrolmentUI = create((set)=>({
  //ui state variables
  isModalOpen: false,
  modalMode: null,
  selectedEnrolment: null,

  //variable setters
   openCreateModal: () => set({ isModalOpen: true, modalMode: 'create', selectedEnrolment: null }),
  openEditModal: (enrolment) => set({ isModalOpen: true, modalMode: 'edit', selectedEnrolment: enrolment }),
  openDeleteModal: (enrolment) => set({ isModalOpen: true, modalMode: 'delete', selectedEnrolment: enrolment }),
 openCancelModal: (enrolment) => set({
    isModalOpen: true,
    modalMode: 'cancel',
    selectedEnrolment: enrolment,
  }),
closeModal: () => set({ isModalOpen: false, modalMode: null, selectedEnrolment: null }),

}))