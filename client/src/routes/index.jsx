// LEARNER 
import LearnerDashboard from '../pages/learner/Dashboard'
import LearnerSessions from '../pages/learner/Sessions'
import SessionDetails from '@/pages/learner/SessionDetails'
import MyEnrolments from '../pages/learner/MyEnrolments'
import EnrolmentDetails from '../pages/learner/EnrolmentDetails'
import MyCertificates from '../pages/learner/MyCertificates'
import CertificateDetails from '../pages/learner/CertificateDetails'
import Trainers from '../pages/learner/Trainers'
import TrainerDetails from '../pages/learner/TrainerDetails'
import ApplyTrainer from '../pages/learner/ApplyTrainer'
import ApplicationStatus from '../pages/learner/ApplicationStatus'

// TRAINER
import TrainerDashboard from '../pages/trainer/Dashboard'
import TrainerSessions from '../pages/trainer/MySessions'
import TrainerSessionDetails from '../pages/trainer/SessionDetails'
import SessionRoster from '../pages/trainer/SessionRoster'
import Attendance from '../pages/trainer/Attendance'
import SessionAttendance from '../pages/trainer/SessionAttendance'
import TrainerProfile from '../pages/trainer/Profile'

// admin
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

// Shared
import Profile from '../pages/shared/Profile'
import Settings from '../pages/shared/Settings'

// learner
export const learnerRoutes = [
  { path: "dashboard/learner", element: <LearnerDashboard />, roles: ['LEARNER', 'TRAINER', 'ADMIN'] },
  { path: "dashboard/learner/sessions", element: <LearnerSessions />, roles: ['LEARNER', 'TRAINER', 'ADMIN'] },
  { path: "dashboard/learner/sessions/:id", element: <SessionDetails />, roles: ['LEARNER', 'TRAINER', 'ADMIN'] },
  { path: "dashboard/learner/my-enrolments", element: <MyEnrolments />, roles: ['LEARNER', 'TRAINER', 'ADMIN'] },
  { path: "dashboard/learner/my-enrolments/:id", element: <EnrolmentDetails />, roles: ['LEARNER', 'TRAINER', 'ADMIN'] },
  { path: "dashboard/learner/my-certificates", element: <MyCertificates />, roles: ['LEARNER', 'TRAINER', 'ADMIN'] },
  { path: "dashboard/learner/my-certificates/:id", element: <CertificateDetails />, roles: ['LEARNER', 'TRAINER', 'ADMIN'] },
  { path: "dashboard/learner/trainers", element: <Trainers />, roles: ['LEARNER', 'TRAINER', 'ADMIN'] },
  { path: "dashboard/learner/trainers/:id", element: <TrainerDetails />, roles: ['LEARNER', 'TRAINER', 'ADMIN'] },
  { path: "dashboard/learner/apply-trainer", element: <ApplyTrainer />, roles: ['LEARNER'] },
  { path: "dashboard/learner/apply-trainer/status", element: <ApplicationStatus />, roles: ['LEARNER'] },
]

// trainer
export const trainerRoutes = [
  { path: "dashboard/trainer", element: <TrainerDashboard />, roles: ['TRAINER', 'ADMIN'] },
  { path: "dashboard/trainer/sessions", element: <TrainerSessions />, roles: ['TRAINER', 'ADMIN'] },
  { path: "dashboard/trainer/sessions/:id", element: <TrainerSessionDetails />, roles: ['TRAINER', 'ADMIN'] },
  { path: "dashboard/trainer/sessions/:id/roster", element: <SessionRoster />, roles: ['TRAINER', 'ADMIN'] },
  { path: "dashboard/trainer/attendance", element: <Attendance />, roles: ['TRAINER', 'ADMIN'] },
  { path: "dashboard/trainer/attendance/:sessionId", element: <SessionAttendance />, roles: ['TRAINER', 'ADMIN'] },
  { path: "dashboard/trainer/profile", element: <TrainerProfile />, roles: ['TRAINER', 'ADMIN'] },
]

// admin
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

//shared
export const sharedRoutes = [
  { path: "dashboard/profile", element: <Profile />, roles: ['LEARNER', 'TRAINER', 'ADMIN'] },
  { path: "dashboard/settings", element: <Settings />, roles: ['LEARNER', 'TRAINER', 'ADMIN'] },
]

// everything
export const allRoutes = [...learnerRoutes, ...trainerRoutes, ...adminRoutes, ...sharedRoutes]