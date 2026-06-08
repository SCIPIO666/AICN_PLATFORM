import { Link } from 'react-router-dom';
import { useAuthStore } from '../../stores';

export default function LandingPage() {
  const { isAuthenticated } = useAuthStore();
  
  return (
    <div className="min-h-screen">
      {/* heroe */}
      <h1 className='text-pink-500'>LANDING PAGE</h1>
    
    </div>
  );
}