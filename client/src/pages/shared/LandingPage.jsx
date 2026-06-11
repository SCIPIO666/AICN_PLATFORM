import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import PublicNavbar from '@/components/PublicNavbar';

export default function LandingPage() {
  const { isAuthenticated } = useAuth();
  
  return (
    <div>
      <PublicNavbar />
      
      {/* Hero Section */}
  
    </div>
  );
}