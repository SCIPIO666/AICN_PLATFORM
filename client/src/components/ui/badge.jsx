/**
 * Badge — ClickHouse design language
 *
 * Variants: default | neon | success | warning | error | outline
 * All use sharp 4px radius per ClickHouse spec.
 */
export default function Badge({ children, variant = 'default', className = '' }) {
  const base =
    'inline-flex items-center px-2.5 py-0.5 rounded-[4px] ' +
    'text-[0.75rem] font-medium leading-[1.43] transition-all duration-200';

  const variants = {
    default:
      'bg-[var(--card-hover)] text-[var(--text-secondary)] ' +
      'border border-[var(--border-color)]',

    neon:
      'bg-[var(--neon-volt)]/20 text-[var(--neon-volt-dark)] border border-[var(--neon-volt)]/40 ' +
      'dark:bg-[var(--neon-volt)]/15 dark:text-[var(--neon-volt)] dark:border-[var(--neon-volt)]/30',

    success:
      'bg-[var(--success-bg)] text-[var(--success-text)] border border-[var(--success-border)] ' +
      'dark:bg-[var(--success-bg-dark)] dark:text-[var(--success-text-dark)] dark:border-[var(--success-border-dark)]',

    warning:
      'bg-[var(--warning-bg)] text-[var(--warning-text)] border border-[var(--warning-border)] ' +
      'dark:bg-[var(--warning-bg-dark)] dark:text-[var(--warning-text-dark)] dark:border-[var(--warning-border-dark)]',

    error:
      'bg-[var(--error-bg)] text-[var(--error-text)] border border-[var(--error-border)] ' +
      'dark:bg-[var(--error-bg-dark)] dark:text-[var(--error-text-dark)] dark:border-[var(--error-border-dark)]',

    outline:
      'bg-transparent text-[var(--text-primary)] border border-[var(--border-color)] hover:bg-[var(--card-hover)]',
  };

  return (
    <span className={[base, variants[variant], className].filter(Boolean).join(' ')}>
      {children}
    </span>
  );
}