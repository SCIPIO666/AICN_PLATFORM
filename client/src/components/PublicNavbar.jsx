import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function PublicNavbar() {
  const { isAuthenticated } = useAuth();
  
  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height: '70px',
      backgroundColor: 'white',
      borderBottom: '1px solid #e5e7eb',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 40px',
      zIndex: 50,
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    }}>
      {/* Logo */}
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
        <div style={{
          width: '40px',
          height: '40px',
          backgroundColor: '#2563eb',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '20px'
        }}>
          🎓
        </div>
        <span style={{ fontWeight: 'bold', fontSize: '20px', color: '#1e293b' }}>
          AICN Training
        </span>
      </Link>
      
      {/* Navigation Links */}
      <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
        <Link to="/" style={{ textDecoration: 'none', color: '#4b5563', fontWeight: '500' }}>
          Home
        </Link>
        <Link to="/verify-certificate" style={{ textDecoration: 'none', color: '#4b5563', fontWeight: '500' }}>
          Verify Certificate
        </Link>
      </div>
      
      {/* Auth Buttons */}
      <div style={{ display: 'flex', gap: '12px' }}>
        {!isAuthenticated ? (
          <>
            <Link to="/login">
              <button style={{
                padding: '8px 20px',
                backgroundColor: 'transparent',
                border: '1px solid #2563eb',
                borderRadius: '8px',
                color: '#2563eb',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#eff6ff';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
              }}>
                Login
              </button>
            </Link>
            <Link to="/signup">
              <button style={{
                padding: '8px 20px',
                backgroundColor: '#2563eb',
                border: 'none',
                borderRadius: '8px',
                color: 'white',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#1d4ed8';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#2563eb';
              }}>
                Sign Up
              </button>
            </Link>
          </>
        ) : (
          <Link to="/dashboard">
            <button style={{
              padding: '8px 20px',
              backgroundColor: '#10b981',
              border: 'none',
              borderRadius: '8px',
              color: 'white',
              fontWeight: '500',
              cursor: 'pointer'
            }}>
              Go to Dashboard
            </button>
          </Link>
        )}
      </div>
    </nav>
  );
}