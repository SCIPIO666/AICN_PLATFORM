import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import ThemeToggle from '../components/ui/ThemeToggle';

export default function PublicNavbar() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="
      fixed
      top-0
      left-0
      right-0
      h-[70px]
      nav-surface
      flex
      items-center
      justify-between
      px-10
      z-50
      shadow-subtle
    ">
      {/* Logo */}
      <Link
        to="/"
        className="flex items-center gap-3"
      >
        <div
          className="
            w-10
            h-10
            rounded-card
            flex
            items-center
            justify-center
          "
          style={{ background: 'var(--color-forest-green)' }}
        >
          <GraduationCap 
            size={22} 
            style={{ color: 'var(--color-neon-volt)' }} 
          />
        </div>

        <span
          className="
            text-feature-title
            font-bold
          "
          style={{ color: 'var(--text-primary)' }}
        >
          AICN
        </span>
      </Link>

      {/* Navigation */}
      <div className="flex items-center gap-8">
        <Link
          to="/"
          className="
            text-caption
            font-medium
            transition-colors
          "
          style={{ color: 'var(--text-secondary)' }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
        >
          Home
        </Link>

        <Link
          to="/verify-certificate"
          className="
            text-caption
            font-medium
            transition-colors
          "
          style={{ color: 'var(--text-secondary)' }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
        >
          Verify Certificate
        </Link>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <ThemeToggle />

        {!isAuthenticated ? (
          <>
            <Link to="/login">
              <button className="btn-outline">
                Login
              </button>
            </Link>
            <Link to="/sessions">
              <button className="btn-outline">
                Sessions
              </button>
            </Link>

            <Link to="/trainers">
              <button className="btn-outline">
                Trainers
              </button>
            </Link>

            <Link to="/signup">
              <button className="btn-primary">
                Sign Up
              </button>
            </Link>
          </>
        ) : (
          <>
            <Link to="/dashboard">
              <button className="btn-neon">
                Dashboard
              </button>
            </Link>
            <button
              onClick={handleLogout}
              className="btn-outline"
              style={{ padding: '8px 16px' }}
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}