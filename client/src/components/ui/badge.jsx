
export default function Badge({ children, variant = 'default', className = '' }) {
  const base =
    'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-[4px] ' +
    'text-[0.75rem] font-medium leading-[1.43] transition-all duration-200 ' +
    'whitespace-nowrap'

  const variants = {
    default:
      'bg-[var(--card-hover)] text-[var(--text-secondary)] ' +
      'border border-[var(--border-color)]',
    neon:
      'bg-[#faff69]/25 text-[#3a3d00] border border-[#faff69]/60 font-semibold ' +
      'dark:bg-[#2a2d00] dark:text-[#faff69] dark:border-[#faff69]/40',

    success:
      'bg-[var(--success-bg)] text-[var(--success-text)] ' +
      'border border-[var(--success-border)]',

    warning:
      'bg-[var(--warning-bg)] text-[var(--warning-text)] ' +
      'border border-[var(--warning-border)]',

    error:
      'bg-[var(--error-bg)] text-[var(--error-text)] ' +
      'border border-[var(--error-border)]',

    outline:
      'bg-transparent text-[var(--text-primary)] ' +
      'border border-[var(--border-color)] hover:bg-[var(--card-hover)]',
  }

  return (
    <span className={[base, variants[variant], className].filter(Boolean).join(' ')}>
      {children}
    </span>
  )
}