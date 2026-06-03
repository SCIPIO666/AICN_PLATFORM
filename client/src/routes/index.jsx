// Copy from docs: react-router-dom createBrowserRouter
import { createBrowserRouter, Navigate } from 'react-router-dom';
import RootLayout from '../layouts/RootLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import LandingPage from '../pages/LandingPage';
import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/DashboardPage';
import ProductsPage from '../pages/ProductsPage.jsx';
import ProtectedRoute from '../components/ProtectedRoute';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: 'login', element: <LoginPage /> },
      {
        path: 'dashboard',
        element: (
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        ),
        children: [
          { index: true, element: <DashboardPage /> },
          { path: 'products', element: <ProductsPage /> },
        ],
      },
    ],
  },
]);