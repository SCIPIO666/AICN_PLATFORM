// LEARNER PAGES (Shells)
import LearnerDashboard from '../pages/learner/Dashboard'
import LearnerSessions from '../pages/learner/Sessions'
import SessionDetails from '../pages/learner/SessionDetails'
import MyEnrolments from '../pages/learner/MyEnrolments'
import EnrolmentDetails from '../pages/learner/EnrolmentDetails'
import MyCertificates from '../pages/learner/MyCertificates'
import CertificateDetails from '../pages/learner/CertificateDetails'
import Trainers from '../pages/learner/Trainers'
import TrainerDetails from '../pages/learner/TrainerDetails'
import ApplyTrainer from '../pages/learner/ApplyTrainer'
import ApplicationStatus from '../pages/learner/ApplicationStatus'

// TRAINER PAGES (Shells)
import TrainerDashboard from '../pages/trainer/Dashboard'
import TrainerSessions from '../pages/trainer/MySessions'
import TrainerSessionDetails from '../pages/trainer/SessionDetails'
import SessionRoster from '../pages/trainer/SessionRoster'
import Attendance from '../pages/trainer/Attendance'
import SessionAttendance from '../pages/trainer/SessionAttendance'
import TrainerProfile from '../pages/trainer/Profile'

// ADMIN PAGES (Shells)
import AdminDashboard from '../pages/admin/Dashboard'
import Users from '../pages/admin/Users'
import UserDetails from '../pages/admin/UserDetails'
import AdminSessions from '../pages/admin/Sessions'
import AdminSessionDetails from '../pages/admin/SessionDetails'
import TrainerApplications from '../pages/admin/TrainerApplications'
import ApplicationDetails from '../pages/admin/ApplicationDetails'
import Announcements from '../pages/admin/Announcements'
import AnnouncementForm from '../pages/admin/AnnouncementForm'
import AdminCertificates from '../pages/admin/Certificates'
import SystemSettings from '../pages/admin/SystemSettings'

// SHARED PAGES (Shells)
import Profile from '../pages/shared/Profile'
import Settings from '../pages/shared/Settings'

// ==================== LEARNER ROUTES (relative paths) ====================
export const learnerRoutes = [
  { path: "learner", element: <LearnerDashboard />, roles: ['LEARNER', 'TRAINER', 'ADMIN'] },
  { path: "learner/sessions", element: <LearnerSessions />, roles: ['LEARNER', 'TRAINER', 'ADMIN'] },
  { path: "learner/sessions/:id", element: <SessionDetails />, roles: ['LEARNER', 'TRAINER', 'ADMIN'] },
  { path: "learner/my-enrolments", element: <MyEnrolments />, roles: ['LEARNER', 'TRAINER', 'ADMIN'] },
  { path: "learner/my-enrolments/:id", element: <EnrolmentDetails />, roles: ['LEARNER', 'TRAINER', 'ADMIN'] },
  { path: "learner/my-certificates", element: <MyCertificates />, roles: ['LEARNER', 'TRAINER', 'ADMIN'] },
  { path: "learner/my-certificates/:id", element: <CertificateDetails />, roles: ['LEARNER', 'TRAINER', 'ADMIN'] },
  { path: "learner/trainers", element: <Trainers />, roles: ['LEARNER', 'TRAINER', 'ADMIN'] },
  { path: "learner/trainers/:id", element: <TrainerDetails />, roles: ['LEARNER', 'TRAINER', 'ADMIN'] },
  { path: "learner/apply-trainer", element: <ApplyTrainer />, roles: ['LEARNER'] },
  { path: "learner/apply-trainer/status", element: <ApplicationStatus />, roles: ['LEARNER'] },
]

// ==================== TRAINER ROUTES (relative paths) ====================
export const trainerRoutes = [
  { path: "trainer", element: <TrainerDashboard />, roles: ['TRAINER', 'ADMIN'] },
  { path: "trainer/sessions", element: <TrainerSessions />, roles: ['TRAINER', 'ADMIN'] },
  { path: "trainer/sessions/:id", element: <TrainerSessionDetails />, roles: ['TRAINER', 'ADMIN'] },
  { path: "trainer/sessions/:id/roster", element: <SessionRoster />, roles: ['TRAINER', 'ADMIN'] },
  { path: "trainer/attendance", element: <Attendance />, roles: ['TRAINER', 'ADMIN'] },
  { path: "trainer/attendance/:sessionId", element: <SessionAttendance />, roles: ['TRAINER', 'ADMIN'] },
  { path: "trainer/profile", element: <TrainerProfile />, roles: ['TRAINER', 'ADMIN'] },
]

// ==================== ADMIN ROUTES (relative paths) ====================
export const adminRoutes = [
  { path: "admin", element: <AdminDashboard />, roles: ['ADMIN'] },
  { path: "admin/users", element: <Users />, roles: ['ADMIN'] },
  { path: "admin/users/:id", element: <UserDetails />, roles: ['ADMIN'] },
  { path: "admin/sessions", element: <AdminSessions />, roles: ['ADMIN'] },
  { path: "admin/sessions/:id", element: <AdminSessionDetails />, roles: ['ADMIN'] },
  { path: "admin/applications", element: <TrainerApplications />, roles: ['ADMIN'] },
  { path: "admin/applications/:id", element: <ApplicationDetails />, roles: ['ADMIN'] },
  { path: "admin/announcements", element: <Announcements />, roles: ['ADMIN'] },
  { path: "admin/announcements/create", element: <AnnouncementForm />, roles: ['ADMIN'] },
  { path: "admin/announcements/:id/edit", element: <AnnouncementForm />, roles: ['ADMIN'] },
  { path: "admin/certificates", element: <AdminCertificates />, roles: ['ADMIN'] },
  { path: "admin/settings", element: <SystemSettings />, roles: ['ADMIN'] },
]

// ==================== SHARED ROUTES (relative paths) ====================
export const sharedRoutes = [
  { path: "profile", element: <Profile />, roles: ['LEARNER', 'TRAINER', 'ADMIN'] },
  { path: "settings", element: <Settings />, roles: ['LEARNER', 'TRAINER', 'ADMIN'] },
]

// Combine all for reference
export const allRoutes = [...learnerRoutes, ...trainerRoutes, ...adminRoutes, ...sharedRoutes]