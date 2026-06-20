import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { 
  BrainCircuit, 
  Menu, 
  X, 
  ChevronDown,
  User,
  Settings,
  GraduationCap,
  LayoutDashboard,
  Award,
  ShieldCheck,
  CalendarDays,
  Users,
  Home,
  Info,
  Sparkles,
  LogOut
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import ThemeToggle from '../components/ui/ThemeToggle';

export default function PublicNavbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
    setIsUserMenuOpen(false);
  };

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/sessions', label: 'Sessions', icon: CalendarDays },
    { to: '/trainers', label: 'Trainers', icon: Users },
    { to: '/verify-certificate', label: 'Verify', icon: ShieldCheck },
    { to: '/about', label: 'About', icon: Info },
  ];

  const isActive = (path) => location.pathname === path;

  // Get user initials for avatar
  const getInitials = () => {
    if (!user?.name) return '?';
    return user.name
      .split(' ')
      .slice(0, 2)
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <nav 
      className="
        fixed
        top-0
        left-0
        right-0
        h-[80px]
        z-50
        flex
        items-center
        px-4
        md:px-8
        lg:px-12
      "
      style={{
        background: 'var(--bg-nav)',
        borderBottom: '1px solid var(--border-color)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
    >
      {/* Neon glow behind logo */}
      <div
        className="absolute left-8 top-1/2 -translate-y-1/2 w-24 h-24 rounded-full opacity-15 blur-2xl pointer-events-none"
        style={{ background: 'var(--color-neon-volt)' }}
      />

      <div className="relative max-w-7xl mx-auto w-full flex items-center justify-between">
        {/* ─── LOGO ─── */}
        <Link
          to="/"
          className="flex items-center gap-3 group relative z-10"
        >
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105"
            style={{ background: 'var(--color-forest-green)' }}
          >
            <GraduationCap 
              size={24} 
              style={{ color: 'var(--color-neon-volt)' }} 
            />
          </div>
          <div className="flex flex-col">
            <span
              className="text-feature-title font-bold leading-none"
              style={{ color: 'var(--text-primary)' }}
            >
              AICN
            </span>
            <span
              className="text-[10px] font-medium uppercase tracking-wider hidden lg:block"
              style={{ color: 'var(--text-muted)' }}
            >
              Digital Skills Network
            </span>
          </div>
        </Link>

        {/* ─── DESKTOP NAVIGATION ─── */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const active = isActive(link.to);
            return (
              <Link
                key={link.to}
                to={link.to}
                className="
                  relative
                  px-4
                  py-2
                  rounded-lg
                  text-sm
                  font-medium
                  transition-all
                  duration-200
                  hover:bg-opacity-10
                "
                style={{
                  color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
                  background: active ? 'var(--neon-active-bg)' : 'transparent',
                }}
              >
                <span className="flex items-center gap-2">
                  <link.icon size={16} />
                  {link.label}
                </span>
                {active && (
                  <span
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full"
                    style={{ background: 'var(--neon-border)' }}
                  />
                )}
              </Link>
            );
          })}

          {/* Notification Pill */}
          <Link
            to="/sessions"
            className="ml-2 px-2.5 py-0.5 rounded-full text-[10px] font-semibold"
            style={{
              background: 'rgba(250,255,105,0.15)',
              color: 'var(--neon-text)',
              border: '1px solid rgba(250,255,105,0.25)'
            }}
          >
            12 Upcoming
          </Link>
        </div>

        {/* ─── ACTIONS ─── */}
        <div className="flex items-center gap-2 relative z-10">
          <ThemeToggle />

          {!isAuthenticated ? (
            <>
              <Link
                to="/login"
                className="
                  px-4
                  py-2
                  rounded-lg
                  text-sm
                  font-medium
                  transition-all
                  duration-200
                  hover:bg-opacity-10
                "
                style={{
                  color: 'var(--text-secondary)',
                }}
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="
                  btn-neon
                  px-5
                  py-2
                  rounded-lg
                  text-sm
                  font-semibold
                  flex
                  items-center
                  gap-2
                "
              >
                <Sparkles size={16} />
                Get Started
              </Link>
            </>
          ) : (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="
                  flex
                  items-center
                  gap-2
                  px-3
                  py-2
                  rounded-lg
                  transition-all
                  duration-200
                  hover:bg-opacity-10
                "
                style={{
                  background: isUserMenuOpen ? 'var(--card-hover)' : 'transparent',
                }}
              >
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold"
                  style={{
                    background: 'linear-gradient(135deg, var(--color-forest-green), var(--color-neon-volt))',
                    color: 'var(--color-pure-black)'
                  }}
                >
                  {getInitials()}
                </div>
                <span className="hidden sm:block text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                  {user?.name?.split(' ')[0] || 'User'}
                </span>
                <ChevronDown
                  size={16}
                  className="hidden sm:block transition-transform duration-200"
                  style={{
                    color: 'var(--text-muted)',
                    transform: isUserMenuOpen ? 'rotate(180deg)' : 'rotate(0)'
                  }}
                />
              </button>

              {/* User Dropdown */}
              {isUserMenuOpen && (
                <div
                  className="
                    absolute
                    right-0
                    top-full
                    mt-2
                    w-56
                    rounded-xl
                    overflow-hidden
                    shadow-elevated
                  "
                  style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-color)',
                    backdropFilter: 'blur(20px)',
                  }}
                >
                  <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
                    <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {user?.name || 'User'}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      {user?.email || ''}
                    </p>
                    <span
                      className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full font-medium"
                      style={{
                        background: 'var(--success-bg)',
                        color: 'var(--success-text)'
                      }}
                    >
                      {user?.role?.toLowerCase()}
                    </span>
                  </div>

                  <div className="py-1">
                    <Link
                      to="/dashboard"
                      className="flex items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-opacity-5"
                      style={{ color: 'var(--text-secondary)' }}
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <LayoutDashboard size={16} />
                      Dashboard
                    </Link>
                    <Link
                      to="/profile"
                      className="flex items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-opacity-5"
                      style={{ color: 'var(--text-secondary)' }}
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <User size={16} />
                      Profile
                    </Link>
                    <Link
                      to="/profile/trainer"
                      className="flex items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-opacity-5"
                      style={{ color: 'var(--text-secondary)' }}
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <Award size={16} />
                      Trainer Profile
                    </Link>
                    <Link
                      to="/dashboard/settings"
                      className="flex items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-opacity-5"
                      style={{ color: 'var(--text-secondary)' }}
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <Settings size={16} />
                      Settings
                    </Link>
                    <hr className="my-1" style={{ borderColor: 'var(--border-subtle)' }} />
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm w-full text-left transition-colors hover:bg-opacity-5"
                      style={{ color: 'var(--error-text)' }}
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ─── MOBILE MENU TOGGLE ─── */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg transition-colors hover:bg-opacity-10"
            style={{ color: 'var(--text-primary)' }}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* ─── MOBILE MENU ─── */}
      {isMobileMenuOpen && (
        <div
          className="
            absolute
            top-[80px]
            left-0
            right-0
            md:hidden
            border-t
            shadow-elevated
            animate-slide-down
          "
          style={{
            background: 'var(--bg-card)',
            borderColor: 'var(--border-color)',
            backdropFilter: 'blur(20px)',
          }}
        >
          <div className="flex flex-col p-4 space-y-1">
            {navLinks.map((link) => {
              const active = isActive(link.to);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className="
                    flex
                    items-center
                    gap-3
                    px-4
                    py-3
                    rounded-lg
                    text-sm
                    font-medium
                    transition-colors
                  "
                  style={{
                    color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
                    background: active ? 'var(--card-hover)' : 'transparent'
                  }}
                >
                  <link.icon size={18} />
                  {link.label}
                  {active && (
                    <span
                      className="ml-auto w-1.5 h-1.5 rounded-full"
                      style={{ background: 'var(--neon-border)' }}
                    />
                  )}
                </Link>
              );
            })}

            {!isAuthenticated && (
              <>
                <hr className="my-2" style={{ borderColor: 'var(--border-subtle)' }} />
                <Link
                  to="/login"
                  className="
                    flex
                    items-center
                    gap-3
                    px-4
                    py-3
                    rounded-lg
                    text-sm
                    font-medium
                    transition-colors
                  "
                  style={{ color: 'var(--text-secondary)' }}
                >
                  <User size={18} />
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="
                    flex
                    items-center
                    justify-center
                    gap-2
                    btn-neon
                    px-4
                    py-3
                    rounded-lg
                    text-sm
                    font-semibold
                    mt-2
                  "
                >
                  <Sparkles size={18} />
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}