import { NavLink } from 'react-router-dom'
import { getNavigationByRole } from '../config/navigation'
import { useAuth } from '../contexts/AuthContext'

export default function Sidebar() {
  const { user } = useAuth()
  
  if (!user) return null
  
  const navigationItems = getNavigationByRole(user.role)
  
  // Group items for better organization
  const mainItems = navigationItems.filter(i => 
    !i.path.includes('/profile') && !i.path.includes('/settings')
  )
  const accountItems = navigationItems.filter(i => 
    i.path.includes('/profile') || i.path.includes('/settings')
  )
  
  return (
    <aside style={{
      width: '280px',
      height: '100vh',
      position: 'fixed',
      left: 0,
      top: 0,
      backgroundColor: '#1e293b',
      color: '#e2e8f0',
      overflowY: 'auto',
      padding: '20px 0'
    }}>
      {/* Logo */}
      <div style={{ padding: '0 20px 20px 20px', borderBottom: '1px solid #334155', marginBottom: '20px' }}>
        <div style={{ fontWeight: 'bold', fontSize: '20px', color: '#60a5fa' }}>
          AICN Training
        </div>
        <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>
          {user.role} Portal
        </div>
      </div>
      
      {/* Main Navigation */}
      <div style={{ marginBottom: '30px' }}>
        <div style={{ padding: '8px 20px', fontSize: '11px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase' }}>
          MAIN
        </div>
        {mainItems.map((item) => (
          <NavLink
            key={item.id}
            to={item.path}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              padding: '10px 20px',
              margin: '2px 8px',
              backgroundColor: isActive ? '#3b82f6' : 'transparent',
              borderRadius: '8px',
              textDecoration: 'none',
              color: isActive ? 'white' : '#cbd5e1',
              fontSize: '14px',
              transition: 'all 0.2s'
            })}
          >
            <span style={{ marginRight: '12px', fontSize: '18px' }}>{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>
      
      {/* Account Navigation */}
      {accountItems.length > 0 && (
        <div>
          <div style={{ padding: '8px 20px', fontSize: '11px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase' }}>
            ACCOUNT
          </div>
          {accountItems.map((item) => (
            <NavLink
              key={item.id}
              to={item.path}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                padding: '10px 20px',
                margin: '2px 8px',
                backgroundColor: isActive ? '#3b82f6' : 'transparent',
                borderRadius: '8px',
                textDecoration: 'none',
                color: isActive ? 'white' : '#cbd5e1',
                fontSize: '14px',
                transition: 'all 0.2s'
              })}
            >
              <span style={{ marginRight: '12px', fontSize: '18px' }}>{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>
      )}
      
      {/* User Info */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '20px',
        right: '20px',
        padding: '12px',
        backgroundColor: '#0f172a',
        borderRadius: '8px',
        fontSize: '12px'
      }}>
        <div style={{ fontWeight: '500', color: '#e2e8f0' }}>{user?.name}</div>
        <div style={{ fontSize: '11px', color: '#64748b' }}>{user?.email}</div>
      </div>
    </aside>
  )
}