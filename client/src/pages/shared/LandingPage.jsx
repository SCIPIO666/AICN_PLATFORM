import { Link } from 'react-router-dom';
import { useAuthStore } from '../../stores';

export default function LandingPage() {
  const { isAuthenticated } = useAuthStore();
  
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-24">
          <h1 className="text-5xl font-bold mb-4">AICN Training Management System</h1>
          <p className="text-xl mb-8">Empowering African tech talent through quality training</p>
          {!isAuthenticated ? (
            <div className="space-x-4">
              <Link to="/signup" className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100">
                Get Started
              </Link>
              <Link to="/login" className="border-2 border-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600">
                Sign In
              </Link>
            </div>
          ) : (
            <Link to="/dashboard" className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100">
              Go to Dashboard →
            </Link>
          )}
        </div>
      </div>
      
      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="text-4xl mb-4">📚</div>
            <h3 className="text-xl font-semibold mb-2">Browse Sessions</h3>
            <p className="text-gray-600">Discover training sessions tailored to your needs</p>
          </div>
          <div className="text-center p-6">
            <div className="text-4xl mb-4">🎓</div>
            <h3 className="text-xl font-semibold mb-2">Get Certified</h3>
            <p className="text-gray-600">Earn certificates upon session completion</p>
          </div>
          <div className="text-center p-6">
            <div className="text-4xl mb-4">👨‍🏫</div>
            <h3 className="text-xl font-semibold mb-2">Expert Trainers</h3>
            <p className="text-gray-600">Learn from industry professionals</p>
          </div>
        </div>
      </div>
    </div>
  );
}