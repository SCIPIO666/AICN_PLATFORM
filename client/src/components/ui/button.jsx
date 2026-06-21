/**
 * Button — ClickHouse design language
 *
 * Variants:
 *   neon    — #faff69 on near-black, the primary CTA
 *   dark    — near-black surface, white text
 *   forest  — forest-green, "Get Started" / conversion CTA
 *   ghost   — transparent, olive-tinted border (#4f5100)
 *
 * Sizes: sm | md | lg
 */
export function Button({
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
  const base =
    'inline-flex items-center justify-center font-semibold transition-all duration-200 ' +
    'rounded-[4px] disabled:opacity-50 disabled:cursor-not-allowed select-none';

  const variants = {
    /* Neon primary — #faff69 bg, dark text. Hover: dark bg. Active: pale-yellow text */
    neon:
      'bg-[#faff69] text-[#151515] border border-[#faff69] ' +
      'hover:bg-[#1d1d1d] hover:text-[#faff69] ' +
      'active:text-[#f4f692]',

    /* Dark solid — near-black surface */
    dark:
      'bg-[#141414] text-white border border-[#333333] ' +
      'hover:bg-[#3a3a3a] hover:text-white/80 ' +
      'active:text-[#f4f692]',

    /* Forest green — primary conversion */
    forest:
      'bg-[#166534] text-white border border-[#141414] ' +
      'hover:bg-[#3a3a3a] hover:text-white/80 ' +
      'active:text-[#f4f692]',

    /* Ghost — transparent, olive border */
    ghost:
      'bg-transparent text-[var(--text-primary)] border border-[#4f5100] ' +
      'hover:bg-[var(--card-hover)] ' +
      'active:text-[#f4f692] ' +
      /* Light mode*/
      'light:border-[var(--border-color)]',
    destructive:
      'bg-[var(--error-bg)] text-[var(--error-text)] border border-[var(--error-border)] ' +
      'hover:bg-[var(--error-text)] hover:text-white hover:border-[var(--error-text)] ' +
      'active:scale-[0.98] ' +
      'focus:ring-2 focus:ring-[var(--error-text)]/50',
  };

  /* Ghost light-mode */
  const ghostLight = variant === 'ghost'
    ? 'dark:border-[#4f5100] border-[var(--border-color)]'
    : '';

  const sizes = {
    sm: 'px-3 py-1.5 text-sm  h-9',
    md: 'px-4 py-3   text-base h-11',
    lg: 'px-6 py-3   text-lg   h-12',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={[
        base,
        variants[variant],
        ghostLight,
        sizes[size],
        fullWidth ? 'w-full' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {isLoading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12" cy="12" r="10"
            stroke="currentColor" strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      )}
      {children}
    </button>
  );
}