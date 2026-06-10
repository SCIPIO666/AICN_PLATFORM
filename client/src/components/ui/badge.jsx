export default function Badge({ children, variant = 'default', className = '' }) {
  const variants = {
    default: 'bg-charcoal/20 text-text-secondary dark:bg-charcoal/30',
    neon: 'bg-neon-volt/20 text-neon-volt border border-neon-volt/30',
    success: 'bg-forest-green/20 text-forest-green border border-forest-green/30',
    warning: 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/30',
    error: 'bg-red-500/20 text-red-500 border border-red-500/30',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-sharp text-caption font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}