import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from './components/ui/toaster';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import PublicRoute from './routes/PublicRoute';
import RoleBasedRoute from './routes/RoleBasedRoute';
import AppLayout from './layouts/AppLayout';
import { learnerRoutes, trainerRoutes, adminRoutes, sharedRoutes } from './routes';

// Auth Pages
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';

// Shared Pages
import Unauthorized from './pages/shared/Unauthorized';
import LandingPage from './pages/shared/LandingPage';
import VerifyCertificate from './pages/shared/VerifyCertificate';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/verify-certificate" element={<VerifyCertificate />} />
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
            <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
            <Route path="/reset-password" element={<PublicRoute><ResetPassword /></PublicRoute>} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* Protected routes with layout */}
            <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
              {/* Role-based redirect */}
              <Route path="/dashboard" element={<RoleBasedRoute />} />
              

              {learnerRoutes.map(route => (
                <Route 
                  key={route.path}
                  path={`/dashboard/${route.path}`}
                  element={
                    <RoleBasedRoute allowedRoles={route.roles}>
                      {route.element}
                    </RoleBasedRoute>
                  }
                />
              ))}
              
              {trainerRoutes.map(route => (
                <Route 
                  key={route.path}
                  path={`/dashboard/${route.path}`}
                  element={
                    <RoleBasedRoute allowedRoles={route.roles}>
                      {route.element}
                    </RoleBasedRoute>
                  }
                />
              ))}
              
              {adminRoutes.map(route => (
                <Route 
                  key={route.path}
                  path={`/dashboard/${route.path}`}
                  element={
                    <RoleBasedRoute allowedRoles={route.roles}>
                      {route.element}
                    </RoleBasedRoute>
                  }
                />
              ))}
              
              {sharedRoutes.map(route => (
                <Route 
                  key={route.path}
                  path={`/dashboard/${route.path}`}
                  element={
                    <ProtectedRoute>
                      {route.element}
                    </ProtectedRoute>
                  }
                />
              ))}
            </Route>
          </Routes>
          <Toaster />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;