export  function Button({ 
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
    neon: 'bg-[#faff69] text-[#151515] border border-[#faff69] hover:bg-[#e5e65e] active:bg-[#d4d64e] transition-all',
    dark: 'bg-[#141414] text-white border border-[#333333] hover:bg-[#2a2a2a] active:bg-[#3a3a3a] transition-all dark:bg-[#1a1a1a] dark:hover:bg-[#2a2a2a]',
    forest: 'bg-[#166534] text-white border border-[#14572f] hover:bg-[#14572f] active:bg-[#0e4524] transition-all',
    ghost: 'bg-transparent text-[var(--text-primary)] border border-[var(--border-color)] hover:bg-[var(--card-hover)] active:bg-[var(--card-hover)] transition-all',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm h-9',
    md: 'px-4 py-2 text-base h-11',
    lg: 'px-6 py-3 text-lg h-12',
  };

  const baseStyle = 'inline-flex items-center justify-center font-semibold transition-all duration-200 rounded-[4px] disabled:opacity-50 disabled:cursor-not-allowed';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
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