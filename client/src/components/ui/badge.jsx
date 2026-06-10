/**
 * Badge — ClickHouse design language
 *
 * Variants: default | neon | success | warning | error | outline
 * All use sharp 4px radius per ClickHouse spec.
 */
export default function Badge({ children, variant = 'default', className = '' }) {
  const base =
    'inline-flex items-center px-2.5 py-0.5 rounded-[4px] ' +
    'text-[0.75rem] font-medium leading-[1.43]';

  const variants = {
    default:
      'bg-[var(--card-hover)] text-[var(--text-secondary)] ' +
      'border border-[var(--border-color)]',

    neon:
      'bg-[#faff69]/10 text-[#faff69] border border-[#faff69]/30 ' +
      'dark:bg-[#faff69]/10 dark:text-[#faff69]',

    success:
      'bg-[#166534]/15 text-[#166534] border border-[#166534]/30 ' +
      'dark:bg-[#166534]/20 dark:text-[#4ade80]',

    warning:
      'bg-yellow-500/10 text-yellow-600 border border-yellow-500/30 ' +
      'dark:text-yellow-400',

    error:
      'bg-red-500/10 text-red-600 border border-red-500/30 ' +
      'dark:text-red-400',

    outline:
      'bg-transparent text-[var(--text-primary)] border border-[var(--border-color)]',
  };

  return (
    <span className={[base, variants[variant], className].filter(Boolean).join(' ')}>
      {children}
    </span>
  );
}