export default function Card({ children, variant = 'default', className = '', onClick }) {
  const variants = {
    default: 'card-base',
    neon: 'card-neon',
    inset: 'card-inset',
  };

  return (
    <div 
      className={`${variants[variant]} ${className} ${onClick ? 'cursor-pointer hover:shadow-elevated transition-all duration-300' : ''}`} 
      onClick={onClick}
    >
      {children}
    </div>
  );
}

Card.Header = ({ children, className = '' }) => (
  <div className={`pb-4 border-b border-border-subtle dark:border-border-subtle mb-4 ${className}`}>
    {children}
  </div>
);

Card.Body = ({ children, className = '' }) => (
  <div className={className}>{children}</div>
);

Card.Footer = ({ children, className = '' }) => (
  <div className={`pt-4 mt-4 border-t border-border-subtle dark:border-border-subtle ${className}`}>
    {children}
  </div>
);