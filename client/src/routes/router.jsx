import { createBrowserRouter, Navigate } from 'react-router-dom';
import AppLayout from '../layouts/AppLayout';
import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';
import RoleBasedRoute from './RoleBasedRoute';

// Auth Pages
import Login from '../pages/auth/Login';
import Signup from '../pages/auth/Signup';
import ForgotPassword from '../pages/auth/ForgotPassword';
import ResetPassword from '../pages/auth/ResetPassword';

// Shared Pages
import Unauthorized from '../pages/shared/Unauthorized';
import LandingPage from '../pages/shared/LandingPage';
import VerifyCertificate from '@/pages/shared/VerifyCertificate';
import NotFound from '@/pages/shared/NotFound.jsx';
import PublicSessions from '../pages/shared/PublicSessions'
import PublicTrainers from '@/pages/shared/PublicTrainers';

// Routes configuration
import { learnerRoutes, trainerRoutes, adminRoutes, sharedRoutes } from './index';

export const router = createBrowserRouter([
  // Public routes - NO LAYOUT
  {
    path: '/',
    element: <LandingPage />,
  },
    {
    path: '/unauthorized',
    element: <Unauthorized />,
  },
    {
    path: '/trainers',
    element: <PublicTrainers />,
  },
    {
    path: '/sessions',
    element: <PublicSessions />,
  },
  {
    path: '/verify-certificate',
    element: <VerifyCertificate />,
  },
  {
    path: '/login',
    element: <PublicRoute><Login /></PublicRoute>,
  },
  {
    path: '/signup',
    element: <PublicRoute><Signup /></PublicRoute>,
  },
  {
    path: '/forgot-password',
    element: <PublicRoute><ForgotPassword /></PublicRoute>,
  },
  {
    path: '/reset-password',
    element: <PublicRoute><ResetPassword /></PublicRoute>,
  },

  
  // Protected routes - WITH LAYOUT
  {
    path: '/dashboard',
    element: <ProtectedRoute><AppLayout /></ProtectedRoute>,
    children: [
      {
        index: true,
        element: <RoleBasedRoute />,
      },
      
      // Learner Routes
      ...learnerRoutes.map(route => ({
        path: route.path.replace('dashboard/', ''),
        element: (
          <RoleBasedRoute allowedRoles={route.roles}>
            {route.element}
          </RoleBasedRoute>
        ),
      })),
      
      // Trainer Routes
      ...trainerRoutes.map(route => ({
        path: route.path.replace('dashboard/', ''),
        element: (
          <RoleBasedRoute allowedRoles={route.roles}>
            {route.element}
          </RoleBasedRoute>
        ),
      })),
      
      // Admin Routes
      ...adminRoutes.map(route => ({
        path: route.path.replace('dashboard/', ''),
        element: (
          <RoleBasedRoute allowedRoles={route.roles}>
            {route.element}
          </RoleBasedRoute>
        ),
      })),
      
      // Shared Routes
      ...sharedRoutes.map(route => ({
        path: route.path.replace('dashboard/', ''),
        element: <ProtectedRoute>{route.element}</ProtectedRoute>,
      })),
    ],
  },
  
  // 404 Catch all
  {
    path: '*',
    element: <NotFound />,
  },
]);