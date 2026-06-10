import { useTheme } from '../../contexts/ThemeContext';

/**
 * ThemeToggle — ClickHouse design language
 *
 * Light mode icon: moon (switches to dark)
 * Dark mode icon: sun in neon-volt (#faff69)
 */
export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      className={[
        'relative inline-flex items-center justify-center',
        'w-10 h-10 rounded-[4px]',
        'border border-[var(--border-color)]',
        'hover:bg-[var(--card-hover)]',
        'transition-all duration-200',
      ].join(' ')}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? (
        /* Sun — neon volt in dark mode */
        <svg
          className="w-5 h-5 text-[#faff69]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ) : (
        /* Moon — neutral in light mode */
        <svg
          className="w-5 h-5 text-[var(--text-primary)]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      )}
    </button>
  );
}