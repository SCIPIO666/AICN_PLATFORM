import { Outlet, Navigate } from 'react-router-dom';
import { useMe } from '../hooks/useAuth';
import { useAuthStore } from '../stores';
import DashboardNavbar from './DashboardNavbar';
import Sidebar from './Sidebar';
import Loader from '../components/common/Loader';

function DashboardLayout() {
  const { isAuthenticated, token } = useAuthStore();
  const { data: user, isLoading, error } = useMe();
  
  // Show loading while checking auth
  if (isLoading) {
    return <Loader fullScreen text="Loading dashboard..." />;
  }
  
  // If not authenticated or no user data, redirect to login
  if (!isAuthenticated || !user || error) {
    return <Navigate to="/login" replace />;
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNavbar user={user} />
      <div className="flex pt-16">
        <Sidebar userRole={user.role} />
        <main className="flex-1 ml-64 p-6">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;