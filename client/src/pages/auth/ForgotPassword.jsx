import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForgotPassword } from '../../hooks/useAuth';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [localError, setLocalError] = useState('');

  const forgotMutation = useForgotPassword();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    if (!email.trim()) {
      setLocalError('Please enter your email address');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setLocalError('Please enter a valid email address');
      return;
    }

    try {
      await forgotMutation.mutateAsync(email.trim());
      setSubmitted(true);
    } catch (error) {
      setLocalError(
        error.response?.data?.message || 'Something went wrong. Please try again.'
      );
    }
  };

  // ── Success state ──────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8"
        style={{ backgroundColor: 'var(--bg-page)' }}
      >
        <div className="w-full max-w-md space-y-8 text-center">
          {/* Animated checkmark */}
          <div
            className="mx-auto h-16 w-16 rounded-full flex items-center justify-center mb-4"
            style={{ backgroundColor: 'var(--color-forest-green)' }}
          >
            <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <div>
            <h2 className="text-3xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
              Check your inbox
            </h2>
            <p className="mt-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
              If an account exists for{' '}
              <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                {email}
              </span>
              , you'll receive a password reset link shortly.
            </p>
          </div>

          <div
            className="rounded-lg p-5 text-left space-y-3"
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              boxShadow: 'var(--shadow-subtle)',
            }}
          >
            <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
              What to do next
            </p>
            <ul className="space-y-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
              {[
                "Check your spam/junk folder if you don't see it within a few minutes",
                'The link expires in 1 hour',
                'Only the most recent link will work if you request multiple times',
              ].map((tip, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span
                    className="mt-0.5 h-4 w-4 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold text-white"
                    style={{ backgroundColor: 'var(--color-forest-green)' }}
                  >
                    {i + 1}
                  </span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => {
                setSubmitted(false);
                setEmail('');
              }}
              className="btn-outline w-full py-2.5 text-sm font-semibold"
            >
              Try a different email
            </button>
            <Link
              to="/login"
              className="block text-sm font-medium transition-colors hover:underline"
              style={{ color: 'var(--color-forest-green)' }}
            >
              ← Back to sign in
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── Request form ───────────────────────────────────────────────────────────
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
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
              />
            </svg>
          </div>
          <h2 className="text-3xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Forgot your password?
          </h2>
          <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
            No problem. Enter your email and we'll send you a reset link.
          </p>
        </div>

        {/* Error */}
        {localError && (
          <div
            className="rounded-lg p-4 border-l-4 animate-slide-in"
            style={{
              backgroundColor: 'var(--error-bg)',
              borderColor: 'var(--error-border)',
            }}
          >
            <div className="flex items-center gap-3">
              <svg
                className="h-5 w-5 flex-shrink-0"
                style={{ color: 'var(--error-text)' }}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
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
            className="space-y-4 rounded-lg p-6"
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              boxShadow: 'var(--shadow-subtle)',
            }}
          >
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium mb-1"
                style={{ color: 'var(--text-secondary)' }}
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                autoFocus
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setLocalError('');
                }}
                className="input-themed block w-full px-3 py-2.5 text-sm placeholder-gray-400"
                placeholder="you@example.com"
                disabled={forgotMutation.isLoading}
              />
            </div>

            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              We'll only send a reset link if this email is registered on the platform.
            </p>
          </div>

          <button
            type="submit"
            disabled={forgotMutation.isLoading}
            className="btn-primary relative w-full flex justify-center py-3 px-4 text-sm font-semibold"
          >
            {forgotMutation.isLoading ? (
              <div className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span>Sending reset link...</span>
              </div>
            ) : (
              'Send reset link'
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