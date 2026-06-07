import { Link } from 'react-router-dom';
import { useAuthStore } from '../../stores';

export default function LandingPage() {
  const { isAuthenticated } = useAuthStore();
  
  return (
    <div className="min-h-screen">
      {/* heroe */}
        <div>
            <div>
                <h2></h2>
            </div>
            <div>

            </div>
        </div>
    
    </div>
  );
}