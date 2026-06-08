import { NavLink } from 'react-router-dom'
import { getNavigationByRole, getGroupedNavigation } from '../config/navigation'
import useAuthStore from '../stores/useAuthStore'

export default function Sidebar() {
  const { user } = useAuthStore()
  
  if (!user) return null
  
  const navigationItems = getNavigationByRole(user.role)
  const groupedNav = getGroupedNavigation(user.role)
  
  console.log('📂 Sidebar rendering with navigation for role:', user.role)
  console.log('📋 Navigation items:', navigationItems.map(i => i.label))
  
  const renderNavItems = (items) => {
    if (items.length === 0) return null
    
    return (
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {items.map((item) => (
          <li key={item.id} style={{ marginBottom: '8px' }}>
            <NavLink
              to={item.path}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                padding: '10px 16px',
                backgroundColor: isActive ? '#e5e7eb' : 'transparent',
                borderRadius: '8px',
                textDecoration: 'none',
                color: '#374151',
                fontSize: '14px',
                fontWeight: isActive ? '600' : '400',
                transition: 'all 0.2s'
              })}
              title={item.label}
            >
              <span style={{ marginRight: '12px', fontSize: '20px' }}>
                {item.icon}
              </span>
              <span>{item.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    )
  }
  
  const renderSection = (title, items) => {
    if (!items || items.length === 0) return null
    
    return (
      <div style={{ marginBottom: '24px' }}>
        <div style={{ 
          padding: '8px 16px', 
          fontSize: '12px', 
          fontWeight: '600',
          color: '#6b7280',
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}>
          {title}
        </div>
        {renderNavItems(items)}
      </div>
    )
  }
  
  return (
    <aside style={{
      width: '260px',
      height: '100vh',
      position: 'fixed',
      left: 0,
      top: 0,
      backgroundColor: '#f9fafb',
      borderRight: '1px solid #e5e7eb',
      overflowY: 'auto',
      padding: '20px 0'
    }}>
      {/* Logo Section */}
      <div style={{ padding: '0 16px 20px 16px', borderBottom: '1px solid #e5e7eb', marginBottom: '20px' }}>
        <div style={{ fontWeight: 'bold', fontSize: '20px', color: '#2563eb' }}>
          AICN Training
        </div>
        <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
          {user.role} Portal
        </div>
      </div>
      
      {/* Navigation Sections based on role */}
      {user.role === 'ADMIN' && (
        <>
          {renderSection('Overview', groupedNav.main)}
          {renderSection('Management', groupedNav.management)}
          {renderSection('Account', groupedNav.settings)}
        </>
      )}
      
      {user.role === 'TRAINER' && (
        <>
          {renderSection('Teaching', groupedNav.main)}
          {renderSection('Account', groupedNav.settings)}
        </>
      )}
      
      {user.role === 'LEARNER' && (
        <>
          {renderSection('Learning', groupedNav.main)}
          {renderSection('Account', groupedNav.settings)}
        </>
      )}
    </aside>
  )
}