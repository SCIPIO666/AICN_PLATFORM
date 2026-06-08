import { useState, useEffect } from 'react';
import { Link, useNavigate} from 'react-router-dom';
import { useLogin, useMe } from '../../hooks/useAuth';
import { useAuthStore } from '../../stores';

function LoginPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [localError, setLocalError] = useState('');

  
  const loginMutation = useLogin();

  const { data: user, isLoading: isUserLoading } = useMe();
  const { isLoading: isAuthLoading, error: authError, isAuthenticated } = useAuthStore();
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      // Redirect based on role
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
    
    // Basic validation
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
      // Error handled by mutation
      console.error('Login error:', error);
    }
  };
  
  const isLoading = loginMutation.isLoading || isAuthLoading || isUserLoading;
  
  return (
    <div >
      <div >
        {/* Header */}
        <div>
          <h2 >
            Sign in to your account
          </h2>
          <p >
            Or{' '}
            <Link to="/signup" >
              create a new account
            </Link>
          </p>
        </div>
        
        {/* Error Display */}
        {(localError || authError) && (
          <div >
                <h3 >
                  {localError || authError}
                </h3>
  
          </div>
        )}
        
        {/* Login Form */}
        <form className="" onSubmit={handleSubmit}>

          <div className="">
            <div>
              <label htmlFor="email" className="sr-only">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className=""
                placeholder="Email address"
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="password" className="">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={handleChange}
                className=""
                placeholder="Password"
                disabled={isLoading}
              />
            </div>
          </div>
          
          <div className="">
            <div className="">
              <input
                id=""
                name="remember-me"
                type="checkbox"
                className=""
              />
              <label htmlFor="" className="">
                Remember me
              </label>
            </div>
            
            <div className="text-sm">
              <Link to="/forgot-password" className="">
                Forgot your password?
              </Link>
            </div>
          </div>
          
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className=""
            >
              {isLoading ? (
              
               <div>...Loading</div>
              ) : (
                'Sign in'
              )}
            </button>
          </div>
        </form>
        
      
      </div>
    </div>
  );
}

export default LoginPage;