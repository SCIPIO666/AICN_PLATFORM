export default function Button({ 
  children, 
  variant = 'dark', 
  size = 'md', 
  isLoading = false,
  disabled = false,
  onClick,
  type = 'button',
  className = '',
  fullWidth = false,
  ...props 
}) {
  const variants = {
    neon: 'btn-neon',
    dark: 'btn-dark',
    forest: 'btn-forest',
    ghost: 'btn-ghost',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm h-9',
    md: 'px-4 py-2 text-base h-11',
    lg: 'px-6 py-3 text-lg h-12',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className} disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200`}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  );
}