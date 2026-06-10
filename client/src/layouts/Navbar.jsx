import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ThemeToggle from '../components/ui/ThemeToggle';

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };
  
  if (!user) return null;
  
  const getRoleBadgeClass = () => {
    switch(user.role) {
      case 'ADMIN':
        return 'bg-red-600 text-white';
      case 'TRAINER':
        return 'bg-forest-green text-white';
      default:
        return 'bg-blue-600 text-white';
    }
  };
  
  return (
    <nav className="fixed top-0 right-0 left-[280px] h-[60px] bg-bg-nav backdrop-blur-sm border-b border-border-color flex items-center justify-between px-6 z-10">
      <div>
        <h1 className="text-feature-title font-semibold text-text-primary">
          Welcome back, {user.name}
        </h1>
      </div>
      
      <div className="flex items-center gap-4">
        <ThemeToggle />
        
        <div className={`px-3 py-1 rounded-pill text-caption font-semibold ${getRoleBadgeClass()}`}>
          {user.role}
        </div>
        
        <div className="w-10 h-10 rounded-full bg-mid-gray/20 dark:bg-charcoal flex items-center justify-center font-bold text-text-primary">
          {user.name?.charAt(0).toUpperCase() || 'U'}
        </div>
        
        <button
          onClick={handleLogout}
          className="btn-dark text-sm"
          style={{ padding: '8px 16px' }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}