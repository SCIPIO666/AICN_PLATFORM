export default function Card({ children, variant = 'default', className = '', onClick }) {
  const variants = {
    default: 'border border-[var(--border-color)] bg-[var(--bg-card)] rounded-[8px] p-7',
    neon: 'border-2 border-[#faff69] bg-[var(--bg-card)] rounded-[8px] p-7',
    inset: 'border border-[var(--border-color)] bg-[var(--bg-card)] rounded-[8px] p-7 shadow-[inset_0px_4px_25px_rgba(0,0,0,0.14),0px_4px_4px_rgba(0,0,0,0.06)]',
  };

  return (
    <div 
      className={`${variants[variant]} ${className} ${onClick ? 'cursor-pointer hover:shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] transition-all duration-300' : ''}`} 
      onClick={onClick}
    >
      {children}
    </div>
  );
}

Card.Header = ({ children, className = '' }) => (
  <div className={`pb-4 border-b border-[var(--border-color)] mb-4 ${className}`}>
    {children}
  </div>
);

Card.Body = ({ children, className = '' }) => (
  <div className={className}>{children}</div>
);

Card.Footer = ({ children, className = '' }) => (
  <div className={`pt-4 mt-4 border-t border-[var(--border-color)] ${className}`}>
    {children}
  </div>
);