import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  BrainCircuit, 
  ChevronLeft, 
  ChevronRight,
  ChevronDown,
  ChevronUp,
  User,
  Settings,
  LogOut,
  LayoutDashboard,
  CalendarDays,
  Award,
  BookOpen,
  Users,
  BarChart3,
  FileCheck,
  HelpCircle,
  Sparkles,
  Menu
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getNavigationByRole } from '../config/navigation';

// Navigation group definitions
const getNavGroups = (role) => {
  const items = getNavigationByRole(role);
  
  // Group items by category
  const groups = {
    main: [],
    learning: [],
    account: []
  };

  items.forEach(item => {
    if (item.path === '/dashboard' || item.path === '/sessions') {
      groups.main.push(item);
    } else if (item.path === '/certificates' || item.path === '/resources' || item.path === '/trainer') {
      groups.learning.push(item);
    } else {
      groups.account.push(item);
    }
  });

  return groups;
};

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // Load collapse state from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('sidebar-collapsed');
    if (saved !== null) {
      setIsCollapsed(JSON.parse(saved));
    }
  }, []);

  // Save collapse state
  useEffect(() => {
    localStorage.setItem('sidebar-collapsed', JSON.stringify(isCollapsed));
  }, [isCollapsed]);

  // Close mobile sidebar on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [window.location.pathname]);

  if (!user) return null;

  const navGroups = getNavGroups(user.role);
  const isTrainer = user.role === 'TRAINER';
  const isAdmin = user.role === 'ADMIN';

  // Quick stats based on role
  const quickStats = isAdmin
    ? [
        { label: 'Learners', value: '210', icon: Users },
        { label: 'Trainers', value: '14', icon: BrainCircuit },
        { label: 'Sessions', value: '35', icon: CalendarDays }
      ]
    : isTrainer
    ? [
        { label: 'Learners', value: '12', icon: Users },
        { label: 'Sessions', value: '4', icon: CalendarDays },
        { label: 'Rating', value: '98%', icon: Award }
      ]
    : [
        { label: 'Sessions', value: '3', icon: CalendarDays },
        { label: 'Certificates', value: '2', icon: Award },
        { label: 'Upcoming', value: '1', icon: Sparkles }
      ];

  const getInitials = () => {
    if (!user?.name) return '?';
    return user.name
      .split(' ')
      .slice(0, 2)
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
    setIsUserMenuOpen(false);
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const renderNavItem = (item) => {
    // Get icon from lucide-react if it exists
    const IconComponent = item.icon ? 
      (() => {
        const icons = {
          'LayoutDashboard': LayoutDashboard,
          'CalendarDays': CalendarDays,
          'Award': Award,
          'BookOpen': BookOpen,
          'Users': Users,
          'BarChart3': BarChart3,
          'FileCheck': FileCheck,
          'Settings': Settings,
          'User': User,
          'HelpCircle': HelpCircle
        };
        return icons[item.icon] || HelpCircle;
      })() 
      : HelpCircle;

    return (
      <NavLink
        key={item.path}
        to={item.path}
        className={({ isActive }) => `
          relative
          flex items-center gap-3
          px-4 py-2.5
          rounded-lg
          transition-all duration-200
          group
          ${isActive 
            ? 'font-semibold' 
            : ''
          }
          ${isCollapsed ? 'justify-center px-2' : ''}
        `}
        style={({ isActive }) => ({
          color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
          background: isActive ? 'rgba(250,255,105,0.08)' : 'transparent',
          borderLeft: isActive ? '3px solid var--color-forest-green)' : '3px solid transparent',
          boxShadow: isActive ? '0 0 20px rgba(250,255,105,0.05)' : 'none'
        })}
        title={isCollapsed ? item.label : ''}
      >
        <IconComponent size={20} strokeWidth={1.5} className="flex-shrink-0" />
        {!isCollapsed && (
          <span className="text-sm font-medium flex-1">
            {item.label}
          </span>
        )}
        {isCollapsed && (
          <div className="absolute left-12 top-1/2 -translate-y-1/2 bg-black/90 text-white text-xs font-medium px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
            {item.label}
          </div>
        )}
      </NavLink>
    );
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="fixed left-4 top-[90px] z-50 lg:hidden p-2 rounded-lg card-base"
        style={{ background: 'var(--bg-card)' }}
      >
        <Menu size={20} style={{ color: 'var(--text-primary)' }} />
      </button>

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full
          bg-nav-surface
          border-r
          transition-all duration-300
          overflow-y-auto
          z-50
          ${isCollapsed ? 'w-20' : 'w-72'}
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
        style={{
          background: 'var(--bg-nav)',
          backdropFilter: 'blur(20px)',
          borderColor: 'var(--border-color)',
          boxShadow: '2px 0 20px rgba(0,0,0,0.05)'
        }}
      >
        {/* Subtle Glow Effect */}
        <div
          className="absolute top-0 left-0 w-full h-40 pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(250,255,105,0.06), transparent 70%)'
          }}
        />

        <div className="relative flex flex-col h-full p-4">
          {/* ─── BRAND ─── */}
          <div className={`
            flex items-center gap-3 mb-8
            ${isCollapsed ? 'justify-center' : ''}
          `}>
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, var--color-forest-green), var(--color-forest-green))'
              }}
            >
              <BrainCircuit size={22} style={{ color: 'var(--color-pure-black)' }} />
            </div>
            {!isCollapsed && (
              <div>
                <p className="text-lg font-bold leading-none" style={{ color: 'var(--text-primary)' }}>
                  AICN
                </p>
                <p className="text-[10px] font-medium uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                  Digital Skills Network
                </p>
              </div>
            )}
          </div>

          {/* ─── NAVIGATION GROUPS ─── */}
          <nav className="flex-1 space-y-4">
            {/* Main */}
            {navGroups.main.length > 0 && (
              <div>
                {!isCollapsed && (
                  <p className="text-[10px] font-semibold uppercase tracking-wider px-4 mb-2" style={{ color: 'var(--text-muted)' }}>
                    Main
                  </p>
                )}
                <div className="space-y-1">
                  {navGroups.main.map(renderNavItem)}
                </div>
              </div>
            )}

            {/* Learning */}
            {navGroups.learning.length > 0 && (
              <div>
                {!isCollapsed && (
                  <p className="text-[10px] font-semibold uppercase tracking-wider px-4 mb-2" style={{ color: 'var(--text-muted)' }}>
                    Learning
                  </p>
                )}
                <div className="space-y-1">
                  {navGroups.learning.map(renderNavItem)}
                </div>
              </div>
            )}

            {/* Account */}
            {navGroups.account.length > 0 && (
              <div>
                {!isCollapsed && (
                  <p className="text-[10px] font-semibold uppercase tracking-wider px-4 mb-2" style={{ color: 'var(--text-muted)' }}>
                    Account
                  </p>
                )}
                <div className="space-y-1">
                  {navGroups.account.map(renderNavItem)}
                </div>
              </div>
            )}
          </nav>

          {/* ─── QUICK STATS ─── */}
          {!isCollapsed && (
            <div className="card-base p-4 mb-4">
              <p className="text-[10px] font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
                {isAdmin ? 'Platform Overview' : isTrainer ? 'Trainer Impact' : 'Your Progress'}
              </p>
              <div className="grid grid-cols-3 gap-2">
                {quickStats.map((stat) => (
                  <div key={stat.label} className="text-center">
                    <stat.icon size={14} className="mx-auto mb-1" style={{ color: 'var--color-forest-green)' }} />
                    <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                      {stat.value}
                    </p>
                    <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ─── COLLAPSE TOGGLE ─── */}
          <button
            onClick={toggleSidebar}
            className={`
              hidden lg:flex items-center gap-2 w-full px-4 py-2 rounded-lg transition-colors
              ${isCollapsed ? 'justify-center' : ''}
            `}
            style={{ color: 'var(--text-muted)' }}
          >
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            {!isCollapsed && (
              <span className="text-sm font-medium">Collapse</span>
            )}
          </button>

          {/* ─── USER SECTION ─── */}
          <div className="mt-4 pt-4 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
            {!isCollapsed ? (
              // Expanded user section
              <div>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-3 w-full p-2 rounded-lg transition-colors hover:bg-opacity-5"
                  style={{ 
                    background: isUserMenuOpen ? 'var(--card-hover)' : 'transparent'
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                    style={{
                      background: 'linear-gradient(135deg, var--color-forest-green), var(--color-forest-green))',
                      color: 'var(--color-pure-black)'
                    }}
                  >
                    {getInitials()}
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
                      {user?.name}
                    </p>
                    <span
                      className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                      style={{
                        background: 'var(--success-bg)',
                        color: 'var(--success-text)'
                      }}
                    >
                      {user?.role?.toLowerCase()}
                    </span>
                  </div>
                  {isUserMenuOpen ? (
                    <ChevronUp size={16} style={{ color: 'var(--text-muted)' }} />
                  ) : (
                    <ChevronDown size={16} style={{ color: 'var(--text-muted)' }} />
                  )}
                </button>

                {/* User Dropdown */}
                {isUserMenuOpen && (
                  <div className="mt-2 space-y-1">
                    <NavLink
                      to="/profile"
                      className="flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-colors"
                      style={{ color: 'var(--text-secondary)' }}
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <User size={16} />
                      Profile
                    </NavLink>
                    <NavLink
                      to="/dashboard/settings"
                      className="flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-colors"
                      style={{ color: 'var(--text-secondary)' }}
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <Settings size={16} />
                      Settings
                    </NavLink>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 px-4 py-2 rounded-lg text-sm w-full text-left transition-colors"
                      style={{ color: 'var(--error-text)' }}
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                )}

                {/* Footer */}
                <div className="mt-4 text-center">
                  <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                    © 2026 AICN Platform
                  </p>
                  <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                    v1.0 · Powered by AICN Africa
                  </p>
                </div>
              </div>
            ) : (
              // Collapsed user section
              <div className="flex flex-col items-center">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
                  style={{
                    background: 'linear-gradient(135deg, var--color-forest-green), var(--color-forest-green))',
                    color: 'var(--color-pure-black)'
                  }}
                >
                  {getInitials()}
                </div>
                <button
                  onClick={handleLogout}
                  className="mt-2 p-2 rounded-lg transition-colors hover:bg-opacity-5"
                  style={{ color: 'var(--text-muted)' }}
                  title="Logout"
                >
                  <LogOut size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main content padding */}
      <div className={`
        transition-all duration-300
        ${isCollapsed ? 'ml-20' : 'ml-72'}
        hidden lg:block
      `} />
    </>
  );
}