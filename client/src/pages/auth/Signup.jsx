import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Award,
  Users,
  GraduationCap,
  ShieldCheck,
  Eye,
  EyeOff,
  CheckCircle2,
  Loader2,
  Sparkles,
  ChevronRight,
  MapPin,
  Mail,
  Phone,
  User,
  Lock
} from 'lucide-react';
import { useSignup } from '../../hooks/useAuth';

const counties = [
  'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Uasin Gishu',
  'Kiambu', 'Machakos', 'Kajiado', 'Meru', 'Eldoret',
  'Thika', 'Malindi', 'Kitale', 'Garissa', 'Kakamega'
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const slideRight = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6 } }
};

function SignupPage() {
  const navigate = useNavigate();
  const signupMutation = useSignup();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    county: '',
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const handleBlur = (e) => {
    setTouched({ ...touched, [e.target.name]: true });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/.test(formData.password)) {
      newErrors.password = 'Must include uppercase, lowercase, number & special character';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Mark all fields as touched
    const allTouched = Object.keys(formData).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setTouched(allTouched);

    if (!validateForm()) {
      return;
    }

    const { confirmPassword, ...submitData } = formData;
    const result = await signupMutation.mutateAsync(submitData);

    if (!result?.error) {
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    }
  };

  // Password strength calculation
  const getPasswordStrength = (password) => {
    if (!password) return { score: 0, label: '', color: '' };
    
    let score = 0;
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[!@#$%^&*]/.test(password)) score++;
    
    const levels = [
      { score: 0, label: 'Weak', color: 'var(--error-text)' },
      { score: 2, label: 'Fair', color: 'var(--warning-text)' },
      { score: 3, label: 'Good', color: 'var(--info-text)' },
      { score: 4, label: 'Strong', color: 'var(--success-text)' }
    ];
    
    const level = levels.reduce((prev, curr) => 
      score >= curr.score ? curr : prev
    );
    
    return { score, label: level.label, color: level.color };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  const benefits = [
    {
      icon: Award,
      title: 'Verified Certificates',
      description: 'Earn credentials employers trust.'
    },
    {
      icon: Users,
      title: 'Expert Trainers',
      description: 'Learn from industry professionals.'
    },
    {
      icon: GraduationCap,
      title: 'Live Sessions',
      description: 'Interactive training with real feedback.'
    },
    {
      icon: ShieldCheck,
      title: 'Career Skills',
      description: 'Practical skills for the workplace.'
    }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8" 
         style={{ background: 'var(--bg-page)' }}>
      <div className="max-w-6xl w-full grid lg:grid-cols-[1.1fr_0.9fr] gap-8 lg:gap-12">
        
        {/* ─── LEFT PANEL (Marketing) ─── */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={slideRight}
          className="relative overflow-hidden rounded-2xl p-8 lg:p-12 hidden lg:flex flex-col justify-center"
          style={{
            background: 'linear-gradient(135deg, var(--bg-page), var(--bg-card))',
            border: '1px solid var(--border-color)'
          }}
        >
          {/* Neon Glow */}
          <div
            className="absolute top-0 right-0 w-72 h-72 rounded-full"
            style={{
              background: 'var(--color-neon-volt)',
              filter: 'blur(140px)',
              opacity: 0.08
            }}
          />

          <div className="relative z-10">
            {/* Logo/Brand */}
            <div className="flex items-center gap-3 mb-8">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ background: 'var(--color-forest-green)' }}
              >
                <Sparkles size={20} style={{ color: 'var(--color-neon-volt)' }} />
              </div>
              <span className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                AICN
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl lg:text-5xl font-bold leading-tight" style={{ color: 'var(--text-primary)' }}>
              Build Skills.
              <br />
              <span style={{ color: 'var(--color-neon-volt)' }}>Earn Certifications.</span>
              <br />
              Grow Your Career.
            </h1>

            <p className="mt-4 text-body-large" style={{ color: 'var(--text-secondary)' }}>
              Join learners across Kenya and Africa building practical digital skills
              through expert-led training sessions.
            </p>

            {/* Benefits Grid */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-2 gap-4 mt-8"
            >
              {benefits.map((benefit, idx) => (
                <motion.div
                  key={benefit.title}
                  variants={fadeUp}
                  className="card-base p-4"
                >
                  <benefit.icon size={20} style={{ color: 'var(--color-neon-volt)' }} />
                  <h4 className="text-sm font-semibold mt-2" style={{ color: 'var(--text-primary)' }}>
                    {benefit.title}
                  </h4>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    {benefit.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>

            {/* Trust Stats */}
            <div className="flex items-center gap-6 mt-8 pt-6 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
              <div>
                <p className="text-2xl font-bold" style={{ color: 'var(--color-neon-volt)' }}>
                  15,000+
                </p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Learners</p>
              </div>
              <div>
                <p className="text-2xl font-bold" style={{ color: 'var(--color-neon-volt)' }}>
                  200+
                </p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Courses</p>
              </div>
              <div>
                <p className="text-2xl font-bold" style={{ color: 'var(--color-neon-volt)' }}>
                  95%
                </p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Completion Rate</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ─── RIGHT PANEL (Signup Form) ─── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="card-base p-6 sm:p-8 lg:p-10"
        >
          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
              Create Account
            </h2>
            <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
              Already have an account?{' '}
              <Link to="/login" className="font-semibold hover:underline" style={{ color: 'var(--color-neon-volt)' }}>
                Sign In
              </Link>
            </p>
          </div>

          {/* Success Message */}
          <AnimatePresence>
            {signupMutation.isSuccess && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="rounded-lg p-4 mb-6 overflow-hidden"
                style={{
                  background: 'var(--success-bg)',
                  border: '1px solid var(--success-border)'
                }}
              >
                <div className="flex items-start gap-3">
                  <CheckCircle2 size={20} className="flex-shrink-0 mt-0.5" style={{ color: 'var(--success-text)' }} />
                  <div>
                    <p className="font-semibold" style={{ color: 'var(--success-text)' }}>
                      Welcome to AICN!
                    </p>
                    <p className="text-sm" style={{ color: 'var(--success-text)' }}>
                      Your account has been created. Redirecting to sign in...
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
                  Full Name *
                </label>
                <div className="relative">
                  <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                  <input
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="w-full h-12 pl-10 pr-4 rounded-lg border transition-colors focus:outline-none"
                    style={{
                      background: 'var(--input-bg)',
                      borderColor: errors.name && touched.name ? 'var(--error-border)' : 'var(--border-subtle)',
                      color: 'var(--text-primary)'
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'var(--color-neon-volt)'}
                    onBlur={(e) => {
                      handleBlur(e);
                      if (!errors.name) e.target.style.borderColor = 'var(--border-subtle)';
                    }}
                    disabled={signupMutation.isLoading}
                    placeholder="John Doe"
                  />
                </div>
                {errors.name && touched.name && (
                  <p className="mt-1 text-xs" style={{ color: 'var(--error-text)' }}>{errors.name}</p>
                )}
              </div>

              {/* County */}
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
                  County *
                </label>
                <div className="relative">
                  <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                  <select
                    name="county"
                    value={formData.county}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="w-full h-12 pl-10 pr-4 rounded-lg border transition-colors focus:outline-none appearance-none"
                    style={{
                      background: 'var(--input-bg)',
                      borderColor: errors.county && touched.county ? 'var(--error-border)' : 'var(--border-subtle)',
                      color: 'var(--text-primary)'
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'var(--color-neon-volt)'}
                    onBlur={(e) => {
                      handleBlur(e);
                      if (!errors.county) e.target.style.borderColor = 'var(--border-subtle)';
                    }}
                    disabled={signupMutation.isLoading}
                  >
                    <option value="">Select County</option>
                    {counties.map(county => (
                      <option key={county} value={county}>{county}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
                Email Address *
              </label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                <input
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="w-full h-12 pl-10 pr-4 rounded-lg border transition-colors focus:outline-none"
                  style={{
                    background: 'var(--input-bg)',
                    borderColor: errors.email && touched.email ? 'var(--error-border)' : 'var(--border-subtle)',
                    color: 'var(--text-primary)'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--color-neon-volt)'}
                  onBlur={(e) => {
                    handleBlur(e);
                    if (!errors.email) e.target.style.borderColor = 'var(--border-subtle)';
                  }}
                  disabled={signupMutation.isLoading}
                  placeholder="john@example.com"
                />
              </div>
              {errors.email && touched.email && (
                <p className="mt-1 text-xs" style={{ color: 'var(--error-text)' }}>{errors.email}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
                Phone Number *
              </label>
              <div className="relative">
                <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                <input
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="w-full h-12 pl-10 pr-4 rounded-lg border transition-colors focus:outline-none"
                  style={{
                    background: 'var(--input-bg)',
                    borderColor: errors.phone && touched.phone ? 'var(--error-border)' : 'var(--border-subtle)',
                    color: 'var(--text-primary)'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--color-neon-volt)'}
                  onBlur={(e) => {
                    handleBlur(e);
                    if (!errors.phone) e.target.style.borderColor = 'var(--border-subtle)';
                  }}
                  disabled={signupMutation.isLoading}
                  placeholder="254712345678"
                />
              </div>
              {errors.phone && touched.phone && (
                <p className="mt-1 text-xs" style={{ color: 'var(--error-text)' }}>{errors.phone}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
                Password *
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="w-full h-12 pl-10 pr-12 rounded-lg border transition-colors focus:outline-none"
                  style={{
                    background: 'var(--input-bg)',
                    borderColor: errors.password && touched.password ? 'var(--error-border)' : 'var(--border-subtle)',
                    color: 'var(--text-primary)'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--color-neon-volt)'}
                  onBlur={(e) => {
                    handleBlur(e);
                    if (!errors.password) e.target.style.borderColor = 'var(--border-subtle)';
                  }}
                  disabled={signupMutation.isLoading}
                  placeholder="Create a strong password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && touched.password && (
                <p className="mt-1 text-xs" style={{ color: 'var(--error-text)' }}>{errors.password}</p>
              )}

              {/* Password Strength */}
              {formData.password && (
                <div className="mt-2">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--border-color)' }}>
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${(passwordStrength.score / 4) * 100}%`,
                          background: passwordStrength.color
                        }}
                      />
                    </div>
                    <span className="text-xs font-medium" style={{ color: passwordStrength.color }}>
                      {passwordStrength.label}
                    </span>
                  </div>
                  <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                    At least 8 characters with uppercase, lowercase, number & special character
                  </p>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
                Confirm Password *
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                <input
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="w-full h-12 pl-10 pr-12 rounded-lg border transition-colors focus:outline-none"
                  style={{
                    background: 'var(--input-bg)',
                    borderColor: errors.confirmPassword && touched.confirmPassword ? 'var(--error-border)' : 'var(--border-subtle)',
                    color: 'var(--text-primary)'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--color-neon-volt)'}
                  onBlur={(e) => {
                    handleBlur(e);
                    if (!errors.confirmPassword) e.target.style.borderColor = 'var(--border-subtle)';
                  }}
                  disabled={signupMutation.isLoading}
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.confirmPassword && touched.confirmPassword && (
                <p className="mt-1 text-xs" style={{ color: 'var(--error-text)' }}>{errors.confirmPassword}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={signupMutation.isLoading}
              className="btn-neon w-full h-12 text-base font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {signupMutation.isLoading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  Create My Account
                  <ChevronRight size={18} />
                </>
              )}
            </button>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center gap-4 pt-2">
              {[
                'Secure Registration',
                'No Payment Required',
                'Expert-Led Training'
              ].map((text) => (
                <span key={text} className="text-xs flex items-center gap-1.5" style={{ color: 'var(--text-muted)' }}>
                  <CheckCircle2 size={12} style={{ color: 'var(--color-neon-volt)' }} />
                  {text}
                </span>
              ))}
            </div>

            {/* Footer */}
            <p className="text-xs text-center" style={{ color: 'var(--text-muted)' }}>
              By creating an account, you agree to our{' '}
              <Link to="/terms" className="hover:underline" style={{ color: 'var(--color-neon-volt)' }}>
                Terms of Service
              </Link>
              {' '}and{' '}
              <Link to="/privacy" className="hover:underline" style={{ color: 'var(--color-neon-volt)' }}>
                Privacy Policy
              </Link>
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

export default SignupPage;