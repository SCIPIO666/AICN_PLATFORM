import { useNavigate } from 'react-router-dom'
import useAuthStore from '../stores/auth.store'

export default function Navbar() {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  
  const handleLogout = () => {
    logout()
    navigate('/login')
  }
  
  if (!user) return null
  
  // Get role badge color
  const getRoleBadgeStyle = () => {
    switch(user.role) {
      case 'ADMIN':
        return { backgroundColor: '#dc2626', color: 'white' }
      case 'TRAINER':
        return { backgroundColor: '#059669', color: 'white' }
      default:
        return { backgroundColor: '#2563eb', color: 'white' }
    }
  }
  
  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: '260px',
      right: 0,
      height: '60px',
      backgroundColor: 'white',
      borderBottom: '1px solid #e5e7eb',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      zIndex: 10
    }}>
      {/* Page Title - will be dynamic based on route */}
      <div>
        <h1 style={{ fontSize: '20px', fontWeight: '600', color: '#111827' }}>
          Welcome back, {user.name}
        </h1>
      </div>
      
      {/* User Menu */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Role Badge */}
        <div style={{
          padding: '4px 12px',
          borderRadius: '20px',
          fontSize: '12px',
          fontWeight: '500',
          ...getRoleBadgeStyle()
        }}>
          {user.role}
        </div>
        
        {/* User Avatar Placeholder */}
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          backgroundColor: '#e5e7eb',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
          color: '#4b5563'
        }}>
          {user.name.charAt(0).toUpperCase()}
        </div>
        
        {/* Logout Button */}
        <button
          onClick={handleLogout}
          style={{
            padding: '8px 16px',
            backgroundColor: '#f3f4f6',
            border: '1px solid #e5e7eb',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#fee2e2'
            e.target.style.borderColor = '#fecaca'
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = '#f3f4f6'
            e.target.style.borderColor = '#e5e7eb'
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  )
}