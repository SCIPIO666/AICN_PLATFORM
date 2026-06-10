
import { getNavigationByRole } from '../config/navigation'

import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Sidebar() {
   const { user } = useAuth()
  
  if (!user) return null
  
  const navItems= getNavigationByRole(user.role)
  
  const mainItems = navItems.filter(i => 
    !i.path.includes('/profile') && !i.path.includes('/settings')
  )
  const accountItems = navItems.filter(i => 
    i.path.includes('/profile') || i.path.includes('/settings')
  )
  
  return (
    <aside className="fixed left-0 top-16 w-64 h-full bg-bg-nav backdrop-blur-sm border-r border-border-color p-6 transition-all duration-300 overflow-y-auto">
      <nav className="space-y-2">
        {navItems.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center gap-3 px-4 py-2.5 rounded-sharp transition-all duration-200
              ${isActive 
                ? 'bg-neon-volt/10 text-neon-volt border border-neon-volt/30 shadow-glow-sm' 
                : 'text-text-secondary hover:bg-hover-gray hover:text-text-primary'
              }
            `}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="text-sm font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>
      
      {/* User info */}
      <div className="absolute bottom-6 left-6 right-6">
        <div className="border-t border-border-color pt-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-neon-volt/20 flex items-center justify-center">
              <span className="text-sm font-bold text-neon-volt">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-small font-medium text-text-primary truncate">
                {user?.name}
              </p>
              <p className="text-micro text-text-muted">
                {user?.role?.toLowerCase()}
              </p>
            </div>
          </div>
          <div className="text-micro text-text-muted text-center">
            © 2026 AICN
          </div>
        </div>
      </div>
    </aside>
  );
}