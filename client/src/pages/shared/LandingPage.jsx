import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import PublicNavbar from '@/components/PublicNavbar';

export default function LandingPage() {
  const { isAuthenticated } = useAuth();
  
  return (
    <div>
      <PublicNavbar />
      
      {/* Hero Section */}
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        paddingTop: '70px'
      }}>
        <div style={{ textAlign: 'center', color: 'white', padding: '40px' }}>
          <h1 style={{ fontSize: '56px', fontWeight: 'bold', marginBottom: '20px' }}>
            AICN Training Management System
          </h1>
          <p style={{ fontSize: '20px', marginBottom: '40px', opacity: 0.95 }}>
            Empowering African tech talent through quality training
          </p>
          
          {!isAuthenticated ? (
            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
              <Link to="/signup">
                <button style={{
                  padding: '12px 32px',
                  backgroundColor: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  color: '#667eea',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'transform 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'scale(1)';
                }}>
                  Get Started
                </button>
              </Link>
              <Link to="/login">
                <button style={{
                  padding: '12px 32px',
                  backgroundColor: 'transparent',
                  border: '2px solid white',
                  borderRadius: '10px',
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'white';
                  e.target.style.color = '#667eea';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = 'white';
                }}>
                  Sign In
                </button>
              </Link>
            </div>
          ) : (
            <Link to="/dashboard">
              <button style={{
                padding: '12px 32px',
                backgroundColor: 'white',
                border: 'none',
                borderRadius: '10px',
                color: '#667eea',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer'
              }}>
                Go to Dashboard →
              </button>
            </Link>
          )}
        </div>
      </div>
      
      {/* Features Section */}
      <div style={{ padding: '80px 40px', backgroundColor: '#f9fafb' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: '36px', fontWeight: 'bold', marginBottom: '60px', color: '#1e293b' }}>
            Features
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>
            {/* Feature 1 */}
            <div style={{ textAlign: 'center', padding: '30px', backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📚</div>
              <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '12px', color: '#1e293b' }}>
                Browse Sessions
              </h3>
              <p style={{ color: '#6b7280' }}>
                Discover and enrol in training sessions tailored to your needs
              </p>
            </div>
            
            {/* Feature 2 */}
            <div style={{ textAlign: 'center', padding: '30px', backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎓</div>
              <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '12px', color: '#1e293b' }}>
                Get Certified
              </h3>
              <p style={{ color: '#6b7280' }}>
                Earn verifiable certificates upon session completion
              </p>
            </div>
            
            {/* Feature 3 */}
            <div style={{ textAlign: 'center', padding: '30px', backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>👨‍🏫</div>
              <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '12px', color: '#1e293b' }}>
                Expert Trainers
              </h3>
              <p style={{ color: '#6b7280' }}>
                Learn from industry professionals with real-world experience
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}