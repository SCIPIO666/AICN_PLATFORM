import { createBrowserRouter, Navigate } from 'react-router-dom';
import RootLayout from '../layouts/RootLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import LandingPage from '../pages/shared/LandingPage';
import LoginPage from '../pages/auth/Login';
import SignupPage from '../pages/auth/Signup';
import ForgotPasswordPage from '../pages/auth/ForgotPassword';
import ResetPasswordPage from '../pages/auth/ResetPassword';
import UnauthorizedPage from '../pages/shared/UnauthorizedPage';
import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';
import VerifyCertificatesPage from '@/pages/shared/VerifyCertificatesPage';

// Learner Pages
import LearnerDashboard from '../pages/learner/Dashboard';
import SessionsPage from '../pages/learner/Sessions';
import MyEnrolmentsPage from '../pages/learner/MyEnrolments';
import MyCertificatesPage from '../pages/learner/MyCertificates';
import TrainersPage from '../pages/learner/Trainers';
import ApplyTrainerPage from '../pages/learner/ApplyTrainer';

// Trainer Pages
import TrainerDashboard from '../pages/trainer/Dashboard';
import TrainerSessionsPage from '../pages/trainer/MySessions';
import AttendancePage from '../pages/trainer/Attendance';
import TrainerProfilePage from '../pages/trainer/Profile';

// Admin Pages
import AdminDashboard from '../pages/admin/Dashboard';
import UsersPage from '../pages/admin/Users';
import AdminSessionsPage from '../pages/admin/Sessions';
import TrainerApplicationsPage from '../pages/admin/TrainerApplications';
import AnnouncementsPage from '../pages/admin/Announcements';

// Shared Pages
import ProfilePage from '../pages/shared/Profile';
import SettingsPage from '../pages/shared/Settings';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      // Public routes
      { index: true, element: <LandingPage /> },
      { path: 'login', element: <PublicRoute><LoginPage /></PublicRoute> },
      { path: 'signup', element: <PublicRoute><SignupPage /></PublicRoute> },
      { path: 'forgot-password', element: <PublicRoute><ForgotPasswordPage /></PublicRoute> },
      { path: 'reset-password', element: <PublicRoute><ResetPasswordPage /></PublicRoute> },
      { path: 'verify-cert', element: <VerifyCertificatesPage /> },
      { path: 'unauthorized', element: <UnauthorizedPage /> },
      
      // Protected dashboard routes
      {
        path: 'dashboard',
        element: <ProtectedRoute><DashboardLayout /></ProtectedRoute>,
        children: [
          // Role-based redirect
          { index: true, element: <Navigate to="/dashboard/learner" replace /> },
          
          // Learner routes
          { path: 'learner', element: <ProtectedRoute allowedRoles={['LEARNER', 'TRAINER', 'ADMIN']}><LearnerDashboard /></ProtectedRoute> },
          { path: 'learner/sessions', element: <ProtectedRoute allowedRoles={['LEARNER', 'TRAINER', 'ADMIN']}><SessionsPage /></ProtectedRoute> },
          { path: 'learner/my-enrolments', element: <ProtectedRoute allowedRoles={['LEARNER', 'TRAINER', 'ADMIN']}><MyEnrolmentsPage /></ProtectedRoute> },
          { path: 'learner/my-certificates', element: <ProtectedRoute allowedRoles={['LEARNER', 'TRAINER', 'ADMIN']}><MyCertificatesPage /></ProtectedRoute> },
          { path: 'learner/trainers', element: <ProtectedRoute allowedRoles={['LEARNER', 'TRAINER', 'ADMIN']}><TrainersPage /></ProtectedRoute> },
          { path: 'learner/apply-trainer', element: <ProtectedRoute allowedRoles={['LEARNER', 'TRAINER', 'ADMIN']}><ApplyTrainerPage /></ProtectedRoute> },
          
          // Trainer routes
          { path: 'trainer', element: <ProtectedRoute allowedRoles={['TRAINER', 'ADMIN']}><TrainerDashboard /></ProtectedRoute> },
          { path: 'trainer/sessions', element: <ProtectedRoute allowedRoles={['TRAINER', 'ADMIN']}><TrainerSessionsPage /></ProtectedRoute> },
          { path: 'trainer/attendance/:sessionId', element: <ProtectedRoute allowedRoles={['TRAINER', 'ADMIN']}><AttendancePage /></ProtectedRoute> },
          { path: 'trainer/profile', element: <ProtectedRoute allowedRoles={['TRAINER', 'ADMIN']}><TrainerProfilePage /></ProtectedRoute> },
          
          // Admin routes
          { path: 'admin', element: <ProtectedRoute allowedRoles={['ADMIN']}><AdminDashboard /></ProtectedRoute> },
          { path: 'admin/users', element: <ProtectedRoute allowedRoles={['ADMIN']}><UsersPage /></ProtectedRoute> },
          { path: 'admin/sessions', element: <ProtectedRoute allowedRoles={['ADMIN']}><AdminSessionsPage /></ProtectedRoute> },
          { path: 'admin/trainer-applications', element: <ProtectedRoute allowedRoles={['ADMIN']}><TrainerApplicationsPage /></ProtectedRoute> },
          { path: 'admin/announcements', element: <ProtectedRoute allowedRoles={['ADMIN']}><AnnouncementsPage /></ProtectedRoute> },
          
          // Shared routes
          { path: 'profile', element: <ProtectedRoute><ProfilePage /></ProtectedRoute> },
          { path: 'settings', element: <ProtectedRoute><SettingsPage /></ProtectedRoute> },
        ]
      },
      
      { path: '*', element: <Navigate to="/" replace /> }
    ]
  }
]);