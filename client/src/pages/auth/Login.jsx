import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLogin, useMe } from '../../hooks/useAuth';
import { useAuthStore } from '../../stores';

function LoginPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
          email: 'calvince@africaictcsnetwork.org',
    password: 'admin123',
    //           email: 'learner@aicn.africa',
    // password: 'Test123!@#'

      
    // email: 'dev@example.com',
    // password: 'Test123!@#',
  });
    //   email: 'calvince@africaictcsnetwork.org',
    // password: 'admin123',
// learner123   akinyi@example.com
  const [localError, setLocalError] = useState('');

  const loginMutation = useLogin();
  const { data: user, isLoading: isUserLoading } = useMe();
  const { isLoading: isAuthLoading, error: authError, isAuthenticated } = useAuthStore();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'ADMIN') {
        navigate('/dashboard/admin');
      } else if (user.role === 'TRAINER') {
        navigate('/dashboard/trainer');
      } else {
        navigate('/dashboard/learner');
      }
    }
  }, [isAuthenticated, user, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setLocalError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setLocalError('Please fill in all fields');
      return;
    }

    try {
      const result = await loginMutation.mutateAsync(formData);
      if (result?.error) {
        setLocalError(result.error);
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const isLoading = loginMutation.isLoading || isAuthLoading || isUserLoading;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8"
         style={{ backgroundColor: 'var(--bg-page)' }}>
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 rounded-lg flex items-center justify-center mb-4"
               style={{ 
                 backgroundColor: 'var(--color-forest-green)',
                 border: '1px solid var(--color-border-olive)'
               }}>
            <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold tracking-tight"
              style={{ color: 'var(--text-primary)' }}>
            Sign in to your account
          </h2>
          <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
            Or{' '}
            <Link to="/signup" 
                  className="font-semibold transition-colors duration-200 hover:underline"
                  style={{ color: 'var(--color-forest-green)' }}>
              create a new account
            </Link>
          </p>
        </div>

        {/* Error Display */}
        {(localError || authError) && (
          <div className="rounded-lg p-4 border-l-4 animate-slide-in"
               style={{ 
                 backgroundColor: 'var(--error-bg)',
                 borderColor: 'var(--error-border)'
               }}>
            <div className="flex items-center gap-3">
              <svg className="h-5 w-5 flex-shrink-0" style={{ color: 'var(--error-text)' }} 
                   fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" 
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" 
                      clipRule="evenodd" />
              </svg>
              <h3 className="text-sm font-medium" style={{ color: 'var(--error-text)' }}>
                {localError || authError}
              </h3>
            </div>
          </div>
        )}

        {/* Login Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4 rounded-lg p-6"
               style={{ 
                 backgroundColor: 'var(--bg-card)',
                 border: '1px solid var(--border-color)',
                 boxShadow: 'var(--shadow-subtle)'
               }}>
            <div>
              <label htmlFor="email" 
                     className="block text-sm font-medium mb-1"
                     style={{ color: 'var(--text-secondary)' }}>
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="input-themed block w-full px-3 py-2.5 text-sm placeholder-gray-400"
                placeholder="Email address"
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="password" 
                     className="block text-sm font-medium mb-1"
                     style={{ color: 'var(--text-secondary)' }}>
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={handleChange}
                className="input-themed block w-full px-3 py-2.5 text-sm placeholder-gray-400"
                placeholder="Password"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 rounded cursor-pointer"
                style={{ 
                  accentColor: 'var(--color-forest-green)',
                  borderColor: 'var(--border-color)'
                }}
              />
              <label htmlFor="remember-me" 
                     className="ml-2 block text-sm cursor-pointer"
                     style={{ color: 'var(--text-secondary)' }}>
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <Link to="/forgot-password" 
                    className="font-medium transition-colors duration-200 hover:underline"
                    style={{ color: 'var(--color-forest-green)' }}>
                Forgot your password?
              </Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary relative w-full flex justify-center py-3 px-4 text-sm font-semibold"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" 
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Signing in...</span>
                </div>
              ) : (
                'Sign in'
              )}
            </button>
          </div>
        </form>

        {/* Dev Accounts Info */}
        <div className="mt-6 rounded-lg p-4 border border-dashed"
             style={{ 
               backgroundColor: 'var(--bg-card)',
               borderColor: 'var(--border-color)'
             }}>
          <div className="flex items-center gap-2 mb-3">
            <svg className="h-4 w-4" style={{ color: 'var(--text-muted)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-xs font-semibold uppercase tracking-wider"
                  style={{ color: 'var(--text-muted)' }}>
              Development Accounts
            </span>
          </div>
          <div className="space-y-2 text-xs font-mono"
               style={{ color: 'var(--text-secondary)' }}>
            <div className="flex items-center justify-between py-1 px-2 rounded"
                 style={{ backgroundColor: 'var(--bg-page)' }}>
              <span>admin@aicn.africa</span>
              <span className="opacity-60">ADMIN</span>
            </div>
            <div className="flex items-center justify-between py-1 px-2 rounded"
                 style={{ backgroundColor: 'var(--bg-page)' }}>
              <span>trainer@aicn.africa</span>
              <span className="opacity-60">TRAINER</span>
            </div>
            <div className="flex items-center justify-between py-1 px-2 rounded"
                 style={{ backgroundColor: 'var(--bg-page)' }}>
              <span>learner@aicn.africa</span>
              <span className="opacity-60">LEARNER</span>
            </div>
            <div className="mt-2 pt-2 border-t"
                 style={{ borderColor: 'var(--border-subtle)' }}>
              <span className="opacity-75">Password: Test123!@#</span>
              <p> learner123   akinyi@example.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;