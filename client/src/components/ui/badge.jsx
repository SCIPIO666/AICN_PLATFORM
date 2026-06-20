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
      'bg-[var(--neon-active-bg)] text-[var(--neon-text)] ' +
      'border border-[var(--neon-border)] font-semibold ' +
      'hover:opacity-80 transition-opacity',

    primary:
      'bg-[var(--color-forest-green)] text-white ' +
      'border border-[var(--color-forest-green)] font-semibold',

    success:
      'bg-[var(--success-bg)] text-[var(--success-text)] ' +
      'border border-[var(--success-border)]',

    warning:
      'bg-[var(--warning-bg)] text-[var(--warning-text)] ' +
      'border border-[var(--warning-border)]',

    error:
      'bg-[var(--error-bg)] text-[var(--error-text)] ' +
      'border border-[var(--error-border)]',

    info:
      'bg-[var(--info-bg)] text-[var(--info-text)] ' +
      'border border-[var(--info-border)]',

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