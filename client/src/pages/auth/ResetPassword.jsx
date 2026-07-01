import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useResetPassword } from '../../hooks/useAuth';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [formData, setFormData] = useState({ newPassword: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState('');
  const [success, setSuccess] = useState(false);

  const resetMutation = useResetPassword();

  // If no token in URL, show an error immediately
  const missingToken = !token;

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setLocalError('');
  };

  const validate = () => {
    if (!formData.newPassword) return 'Please enter a new password';
    if (formData.newPassword.length < 8) return 'Password must be at least 8 characters';
    if (!/[A-Z]/.test(formData.newPassword)) return 'Password must contain at least one uppercase letter';
    if (!/[0-9]/.test(formData.newPassword)) return 'Password must contain at least one number';
    if (formData.newPassword !== formData.confirmPassword) return 'Passwords do not match';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const error = validate();
    if (error) { setLocalError(error); return; }

    try {
      await resetMutation.mutateAsync({
        token,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword,
      });
      setSuccess(true);
      // Auto-redirect to login after 3s
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setLocalError(
        err.response?.data?.message || 'Reset failed. Your link may have expired.'
      );
    }
  };

  const getStrength = (pw) => {
    if (!pw) return { level: 0, label: '', color: 'transparent' };
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    const map = [
      { label: '', color: 'transparent' },
      { label: 'Weak', color: '#ef4444' },
      { label: 'Fair', color: '#f97316' },
      { label: 'Good', color: '#eab308' },
      { label: 'Strong', color: 'var(--color-forest-green)' },
    ];
    return { level: score, ...map[score] };
  };

  const strength = getStrength(formData.newPassword);

  // ── Missing token ──────────────────────────────────────────────────────────
  if (missingToken) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-4"
        style={{ backgroundColor: 'var(--bg-page)' }}
      >
        <div className="w-full max-w-md text-center space-y-6">
          <div
            className="mx-auto h-16 w-16 rounded-full flex items-center justify-center"
            style={{ backgroundColor: 'var(--error-bg)', border: '1px solid var(--error-border)' }}
          >
            <svg className="h-8 w-8" style={{ color: 'var(--error-text)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Invalid reset link
          </h2>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            This password reset link is missing or invalid. Links expire after 1 hour and can only be used once.
          </p>
          <Link
            to="/forgot-password"
            className="btn-primary inline-block py-2.5 px-6 text-sm font-semibold"
          >
            Request a new link
          </Link>
        </div>
      </div>
    );
  }

  // ── Success ────────────────────────────────────────────────────────────────
  if (success) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-4"
        style={{ backgroundColor: 'var(--bg-page)' }}
      >
        <div className="w-full max-w-md text-center space-y-6">
          <div
            className="mx-auto h-16 w-16 rounded-full flex items-center justify-center"
            style={{ backgroundColor: 'var(--color-forest-green)' }}
          >
            <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Password reset!
          </h2>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Your password has been updated. Redirecting you to sign in...
          </p>
          <Link
            to="/login"
            className="block text-sm font-medium hover:underline"
            style={{ color: 'var(--color-forest-green)' }}
          >
            Go to sign in now →
          </Link>
        </div>
      </div>
    );
  }

  // ── Reset form ─────────────────────────────────────────────────────────────
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8"
      style={{ backgroundColor: 'var(--bg-page)' }}
    >
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center">
          <div
            className="mx-auto h-12 w-12 rounded-lg flex items-center justify-center mb-4"
            style={{
              backgroundColor: 'var(--color-forest-green)',
              border: '1px solid var(--color-border-olive)',
            }}
          >
            <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Set a new password
          </h2>
          <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
            Choose something strong that you haven't used before.
          </p>
        </div>

        {/* Error */}
        {localError && (
          <div
            className="rounded-lg p-4 border-l-4 animate-slide-in"
            style={{ backgroundColor: 'var(--error-bg)', borderColor: 'var(--error-border)' }}
          >
            <div className="flex items-center gap-3">
              <svg className="h-5 w-5 flex-shrink-0" style={{ color: 'var(--error-text)' }}
                fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd" />
              </svg>
              <p className="text-sm font-medium" style={{ color: 'var(--error-text)' }}>
                {localError}
              </p>
            </div>
          </div>
        )}

        {/* Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div
            className="space-y-5 rounded-lg p-6"
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              boxShadow: 'var(--shadow-subtle)',
            }}
          >
            {/* New password */}
            <div>
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium mb-1"
                style={{ color: 'var(--text-secondary)' }}
              >
                New password
              </label>
              <div className="relative">
                <input
                  id="newPassword"
                  name="newPassword"
                  type={showPassword ? 'text' : 'password'}
                  autoFocus
                  required
                  value={formData.newPassword}
                  onChange={handleChange}
                  className="input-themed block w-full px-3 py-2.5 pr-10 text-sm"
                  placeholder="At least 8 characters"
                  disabled={resetMutation.isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute inset-y-0 right-3 flex items-center"
                  style={{ color: 'var(--text-muted)' }}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>

              {/* Strength bar */}
              {formData.newPassword && (
                <div className="mt-2 space-y-1">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="h-1 flex-1 rounded-full transition-all duration-300"
                        style={{
                          backgroundColor: i <= strength.level ? strength.color : 'var(--border-color)',
                        }}
                      />
                    ))}
                  </div>
                  {strength.label && (
                    <p className="text-xs" style={{ color: strength.color }}>
                      {strength.label} password
                    </p>
                  )}
                </div>
              )}

              {/* Requirements */}
              <ul className="mt-2 space-y-1">
                {[
                  { rule: formData.newPassword.length >= 8, text: 'At least 8 characters' },
                  { rule: /[A-Z]/.test(formData.newPassword), text: 'One uppercase letter' },
                  { rule: /[0-9]/.test(formData.newPassword), text: 'One number' },
                ].map(({ rule, text }) => (
                  <li key={text} className="flex items-center gap-1.5 text-xs"
                    style={{ color: rule ? 'var(--color-forest-green)' : 'var(--text-muted)' }}>
                    <svg className="h-3 w-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      {rule ? (
                        <path fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd" />
                      ) : (
                        <path fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v4a1 1 0 102 0V7zm-1 8a1 1 0 100-2 1 1 0 000 2z"
                          clipRule="evenodd" />
                      )}
                    </svg>
                    {text}
                  </li>
                ))}
              </ul>
            </div>

            {/* Confirm password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium mb-1"
                style={{ color: 'var(--text-secondary)' }}
              >
                Confirm new password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="input-themed block w-full px-3 py-2.5 text-sm"
                placeholder="Repeat your new password"
                disabled={resetMutation.isLoading}
                style={{
                  borderColor:
                    formData.confirmPassword && formData.confirmPassword !== formData.newPassword
                      ? 'var(--error-border)'
                      : undefined,
                }}
              />
              {formData.confirmPassword && formData.confirmPassword !== formData.newPassword && (
                <p className="mt-1 text-xs" style={{ color: 'var(--error-text)' }}>
                  Passwords don't match
                </p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={resetMutation.isLoading}
            className="btn-primary relative w-full flex justify-center py-3 px-4 text-sm font-semibold"
          >
            {resetMutation.isLoading ? (
              <div className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Resetting password...</span>
              </div>
            ) : (
              'Reset password'
            )}
          </button>

          <div className="text-center">
            <Link
              to="/login"
              className="text-sm font-medium transition-colors hover:underline"
              style={{ color: 'var(--color-forest-green)' }}
            >
              ← Back to sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}