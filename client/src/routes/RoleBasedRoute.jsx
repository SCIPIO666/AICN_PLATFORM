import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // Using AuthContext

export default function RoleBasedRoute({ children, allowedRoles = [] }) {
  const { user, isLoading, isAuthenticated } = useAuth();
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  //  role-based redirect
  if (!children) {
    // Redirect based on user role
    switch (user?.role) {
      case 'ADMIN':
        return <Navigate to="/dashboard/admin" replace />;
      case 'TRAINER':
        return <Navigate to="/dashboard/trainer" replace />;
      case 'LEARNER':
      default:
        return <Navigate to="/dashboard/learner" replace />;
    }
  }
  
  // role permissions
  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  return children;
}