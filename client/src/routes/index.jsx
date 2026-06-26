// LEARNER PAGES (Shells)
import LearnerDashboard from '../pages/learner/Dashboard'
import LearnerSessions from '../pages/learner/Sessions'
import SessionDetails from '../pages/learner/SessionDetails'
import MyEnrolments from '../pages/learner/MyEnrolments'
import EnrolmentDetails from '../pages/learner/EnrolmentDetails'
import MyCertificates from '../pages/learner/MyCertificates'
import CertificateDetails from '../pages/learner/CertificateDetails'
// import Trainers from '../pages/learner/Trainers'
// import TrainerDetails from '../pages/learner/TrainerDetails'
import ApplyTrainer from '../pages/learner/ApplyTrainer'


// TRAINER PAGES 
import TrainerDashboard from '@/pages/trainer/TrainerDashboard'
import TrainerSessions from '../pages/trainer/TrainerSessions '
import TrainerSessionDetails from '../pages/trainer/TrainerSessionDetails'
import SessionRoster from '../pages/trainer/SessionRoster'
import Attendance from '../pages/trainer/Attendance'
import SessionAttendance from '../pages/trainer/SessionAttendance'
import TrainerProfile from '@/pages/trainer/TrainerProfile'
import ManageCertificates from '@/pages/trainer/ManageCertificates'
import IssueCertificates from '@/pages/trainer/IssueCertificates'

// ADMIN PAGES 
import AdminDashboard from '../pages/admin/AdminDashboard'
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


// SHARED PAGES 
import Profile from '@/pages/shared/Profile'
import Settings from '@/pages/shared/Settings'

// ==================== LEARNER ROUTES ====================
export const learnerRoutes = [
  { path: "dashboard/learner", element: <LearnerDashboard />, roles: ['LEARNER', 'TRAINER', 'ADMIN'] },
  // { path: "dashboard/learner/sessions", element: <LearnerSessions />, roles: ['LEARNER', 'TRAINER', 'ADMIN'] },
  // { path: "dashboard/learner/sessions/:id", element: <SessionDetails />, roles: ['LEARNER', 'TRAINER', 'ADMIN'] },
  { path: "dashboard/learner/my-enrolments", element: <MyEnrolments />, roles: ['LEARNER', 'TRAINER', 'ADMIN'] },
  { path: "dashboard/learner/my-enrolments/:id", element: <EnrolmentDetails />, roles: ['LEARNER', 'TRAINER', 'ADMIN'] },
  { path: "dashboard/learner/my-certificates", element: <MyCertificates />, roles: ['LEARNER', 'TRAINER', 'ADMIN'] },
  { path: "dashboard/learner/my-certificates/:id", element: <CertificateDetails />, roles: ['LEARNER', 'TRAINER', 'ADMIN'] },
  
  { path: "dashboard/learner/apply-trainer", element: <ApplyTrainer />, roles: ['LEARNER'] },

]

// ==================== TRAINER ROUTES ====================
export const trainerRoutes = [
  { path: "dashboard/trainer", element: <TrainerDashboard />, roles: ['TRAINER', 'ADMIN'] },
  { path: "dashboard/trainer/sessions", element: <TrainerSessions />, roles: ['TRAINER', 'ADMIN'] },
  // { path: "dashboard/trainer/sessions/:id", element: <TrainerSessionDetails />, roles: ['TRAINER', 'ADMIN'] },
  // { path: "dashboard/trainer/sessions/:id/roster", element: <SessionRoster />, roles: ['TRAINER', 'ADMIN'] },
  // { path: "dashboard/trainer/attendance", element: <Attendance />, roles: ['TRAINER', 'ADMIN'] },
  // { path: "dashboard/trainer/attendance/:sessionId", element: <SessionAttendance />, roles: ['TRAINER', 'ADMIN'] },
  { path: "dashboard/trainer/profile", element: <TrainerProfile />, roles: ['TRAINER', 'ADMIN'] },
  {path : "dashboard/trainer/certificates", element : <IssueCertificates/>,roles: ['TRAINER', 'ADMIN']},

]

// ==================== ADMIN ROUTES ====================
export const adminRoutes = [
  { path: "dashboard/admin", element: <AdminDashboard />, roles: ['ADMIN'] },
  { path: "dashboard/admin/users", element: <Users />, roles: ['ADMIN'] },
  { path: "dashboard/admin/users/:id", element: <UserDetails />, roles: ['ADMIN'] },
  { path: "dashboard/admin/sessions", element: <AdminSessions />, roles: ['ADMIN'] },
  { path: "dashboard/admin/sessions/:id", element: <AdminSessionDetails />, roles: ['ADMIN'] },
  { path: "dashboard/admin/applications", element: <TrainerApplications />, roles: ['ADMIN'] },
  { path: "dashboard/admin/applications/:id", element: <ApplicationDetails />, roles: ['ADMIN'] },
  { path: "dashboard/admin/announcements", element: <Announcements />, roles: ['ADMIN'] },
  { path: "dashboard/admin/announcements/create", element: <AnnouncementForm />, roles: ['ADMIN'] },
  { path: "dashboard/admin/announcements/:id/edit", element: <AnnouncementForm />, roles: ['ADMIN'] },
  { path: "dashboard/admin/certificates", element: <AdminCertificates />, roles: ['ADMIN'] },
  { path: "dashboard/admin/settings", element: <SystemSettings />, roles: ['ADMIN'] },
]

// ==================== SHARED ROUTES ====================
export const sharedRoutes = [
  { path: "dashboard/profile", element: <Profile />, roles: ['LEARNER', 'TRAINER', 'ADMIN'] },
  { path: "dashboard/settings", element: <Settings />, roles: ['LEARNER', 'TRAINER', 'ADMIN'] },
]

// Combine all for routing
export const allRoutes = [...learnerRoutes, ...trainerRoutes, ...adminRoutes, ...sharedRoutes]