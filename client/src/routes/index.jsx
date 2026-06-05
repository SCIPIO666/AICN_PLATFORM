
import LearnerDashboard from '../pages/learner/Dashboard';
import Sessions from '../pages/learner/Sessions';
import MyEnrolments from '../pages/learner/MyEnrolments';
import MyCertificates from '../pages/learner/MyCertificates';
import Trainers from '../pages/learner/Trainers';
import ApplyTrainer from '../pages/learner/ApplyTrainer';

import TrainerDashboard from '../pages/trainer/Dashboard';
import TrainerSessions from '../pages/trainer/MySessions';
import Attendance from '../pages/trainer/Attendance';
import TrainerProfile from '../pages/trainer/Profile';

import AdminDashboard from '../pages/admin/Dashboard';
import Users from '../pages/admin/Users';
import AdminSessions from '../pages/admin/Sessions';
import TrainerApplications from '../pages/admin/TrainerApplications';
import Announcements from '../pages/admin/Announcements';

import Profile from '../pages/shared/Profile';
import Settings from '../pages/shared/Settings';

/
export const learnerRoutes = [
  { path: "learner", element: <LearnerDashboard />, roles: ['LEARNER', 'TRAINER', 'ADMIN'] },
  { path: "learner/sessions", element: <Sessions />, roles: ['LEARNER', 'TRAINER', 'ADMIN'] },
  { path: "learner/my-enrolments", element: <MyEnrolments />, roles: ['LEARNER', 'TRAINER', 'ADMIN'] },
  { path: "learner/my-certificates", element: <MyCertificates />, roles: ['LEARNER', 'TRAINER', 'ADMIN'] },
  { path: "learner/trainers", element: <Trainers />, roles: ['LEARNER', 'TRAINER', 'ADMIN'] },
  { path: "learner/apply-trainer", element: <ApplyTrainer />, roles: ['LEARNER', 'TRAINER', 'ADMIN'] },
];

export const trainerRoutes = [
  { path: "trainer", element: <TrainerDashboard />, roles: ['TRAINER', 'ADMIN'] },
  { path: "trainer/sessions", element: <TrainerSessions />, roles: ['TRAINER', 'ADMIN'] },
  { path: "trainer/attendance/:sessionId", element: <Attendance />, roles: ['TRAINER', 'ADMIN'] },
  { path: "trainer/profile", element: <TrainerProfile />, roles: ['TRAINER', 'ADMIN'] },
];

export const adminRoutes = [
  { path: "admin", element: <AdminDashboard />, roles: ['ADMIN'] },
  { path: "admin/users", element: <Users />, roles: ['ADMIN'] },
  { path: "admin/sessions", element: <AdminSessions />, roles: ['ADMIN'] },
  { path: "admin/trainer-applications", element: <TrainerApplications />, roles: ['ADMIN'] },
  { path: "admin/announcements", element: <Announcements />, roles: ['ADMIN'] },
];

export const sharedRoutes = [
  { path: "profile", element: <Profile />, roles: [] },
  { path: "settings", element: <Settings />, roles: [] },
];