import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom'; // Add Outlet here
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
import VerifyCertificate from '../pages/shared/VerifyCertificate';

// routes
import { learnerRoutes, trainerRoutes, adminRoutes, sharedRoutes } from './index';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      // Public routes
      { index: true, element: <LandingPage /> },
      { path: 'verify-certificate', element: <VerifyCertificate /> },
      { path: 'login', element: <PublicRoute><Login /></PublicRoute> },
      { path: 'signup', element: <PublicRoute><Signup /></PublicRoute> },
      { path: 'forgot-password', element: <PublicRoute><ForgotPassword /></PublicRoute> },
      { path: 'reset-password', element: <PublicRoute><ResetPassword /></PublicRoute> },
      { path: 'unauthorized', element: <Unauthorized /> },
      
      // Protected routes
      {
        path: 'dashboard',
        element: <ProtectedRoute><div><Outlet /></div></ProtectedRoute>,
        children: [
          { index: true, element: <RoleBasedRoute /> },
          
          // Dynamically add routes
          ...learnerRoutes.map(route => ({
            path: route.path,
            element: (
              <RoleBasedRoute allowedRoles={route.roles}>
                {route.element}
              </RoleBasedRoute>
            ),
          })),
          
          ...trainerRoutes.map(route => ({
            path: route.path,
            element: (
              <RoleBasedRoute allowedRoles={route.roles}>
                {route.element}
              </RoleBasedRoute>
            ),
          })),
          
          ...adminRoutes.map(route => ({
            path: route.path,
            element: (
              <RoleBasedRoute allowedRoles={route.roles}>
                {route.element}
              </RoleBasedRoute>
            ),
          })),
          
          ...sharedRoutes.map(route => ({
            path: route.path,
            element: <ProtectedRoute>{route.element}</ProtectedRoute>,
          })),
        ],
      },
      
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
]);