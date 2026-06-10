/**
 * Card — ClickHouse design language
 *
 * Variants:
 *   default — charcoal-bordered, card-bg surface
 *   neon    — neon-volt border highlight (featured / selected)
 *   inset   — "pressed into surface" inset shadow
 *   flat    — borderless, transparent (for nested sections)
 */
export default function Card({
  children,
  variant = 'default',
  className = '',
  onClick,
}) {
  const base =
    'bg-[var(--bg-card)] rounded-[8px] transition-all duration-300';

  const variants = {
    default: 'border border-[var(--border-color)] p-7',
    neon:    'border border-[#faff69] p-7',
    inset:
      'border border-[var(--border-color)] p-7 ' +
      'shadow-[inset_0px_4px_25px_rgba(0,0,0,0.14),0px_4px_4px_rgba(0,0,0,0.06)]',
    flat: 'p-7',
  };

  const interactive = onClick
    ? 'cursor-pointer hover:shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] hover:border-[var(--border-color)]'
    : '';

  /* Neon hover for neon variant */
  const neonHover =
    variant === 'neon' && onClick
      ? 'hover:shadow-[0_0_20px_rgba(250,255,105,0.15)]'
      : '';

  return (
    <div
      className={[base, variants[variant], interactive, neonHover, className]
        .filter(Boolean)
        .join(' ')}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

Card.Header = function CardHeader({ children, className = '' }) {
  return (
    <div
      className={[
        'pb-4 mb-4 border-b border-[var(--border-color)]',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </div>
  );
};

Card.Body = function CardBody({ children, className = '' }) {
  return <div className={className || undefined}>{children}</div>;
};

Card.Footer = function CardFooter({ children, className = '' }) {
  return (
    <div
      className={[
        'pt-4 mt-4 border-t border-[var(--border-color)]',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </div>
  );
};