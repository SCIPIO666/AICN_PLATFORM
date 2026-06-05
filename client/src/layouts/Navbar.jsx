import { Link } from 'react-router-dom';
import { useAuthStore } from '../stores';

export default function Navbar() {
  const { isAuthenticated } = useAuthStore();
  
  return (
    <nav className="bg-white shadow-md fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <img src="/logo.png" alt="AICN" className="h-8 w-8" />
            <span className="font-bold text-xl text-blue-600">AICN Training</span>
          </Link>
          
          {!isAuthenticated ? (
            <div className="flex space-x-4">
              <Link to="/login" className="text-gray-700 hover:text-blue-600">Login</Link>
              <Link to="/signup" className="bg-blue-600 text-white px-4 py-2 rounded-lg">Sign Up</Link>
            </div>
          ) : (
            <Link to="/dashboard" className="text-gray-700 hover:text-blue-600">Dashboard</Link>
          )}
        </div>
      </div>
    </nav>
  );
}