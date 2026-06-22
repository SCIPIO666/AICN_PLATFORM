
import { create } from 'zustand';

export const useAdminModalStore = create((set) => ({
  // User Modals
  isUserDetailsOpen: false,
  selectedUser: null,
  
  // Session Modals
  isSessionDetailsOpen: false,
  selectedSession: null,
  isSessionFormOpen: false,
  sessionToEdit: null,
  
  // Announcement Modals
  isAnnouncementFormOpen: false,
  announcementToEdit: null,
  
  // Application Modals
  isApplicationDetailsOpen: false,
  selectedApplication: null,
  
  // Certificate Modals
  isCertificateDetailsOpen: false,
  selectedCertificate: null,
  
  // User Modal Actions
  openUserDetails: (user) => set({ isUserDetailsOpen: true, selectedUser: user }),
  closeUserDetails: () => set({ isUserDetailsOpen: false, selectedUser: null }),
  
  // Session Modal Actions
  openSessionDetails: (session) => set({ isSessionDetailsOpen: true, selectedSession: session }),
  closeSessionDetails: () => set({ isSessionDetailsOpen: false, selectedSession: null }),
  
  openSessionForm: (session = null) => set({ isSessionFormOpen: true, sessionToEdit: session }),
  closeSessionForm: () => set({ isSessionFormOpen: false, sessionToEdit: null }),
  
  // Announcement Modal Actions
  openAnnouncementForm: (announcement = null) => set({ isAnnouncementFormOpen: true, announcementToEdit: announcement }),
  closeAnnouncementForm: () => set({ isAnnouncementFormOpen: false, announcementToEdit: null }),
  
  // Application Modal Actions
  openApplicationDetails: (application) => set({ isApplicationDetailsOpen: true, selectedApplication: application }),
  closeApplicationDetails: () => set({ isApplicationDetailsOpen: false, selectedApplication: null }),
  
  // Certificate Modal Actions
  openCertificateDetails: (certificate) => set({ isCertificateDetailsOpen: true, selectedCertificate: certificate }),
  closeCertificateDetails: () => set({ isCertificateDetailsOpen: false, selectedCertificate: null }),
}));