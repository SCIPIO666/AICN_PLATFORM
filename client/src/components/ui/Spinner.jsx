export default function Spinner({ size = 'md', fullScreen = false }) {
  const sizes = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-2',
    lg: 'w-12 h-12 border-3',
  };

  const spinner = (
    <div className={`inline-block animate-spin rounded-full border-solid border-neon-volt border-t-transparent ${sizes[size]}`} />
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-bg-page/80 backdrop-blur-sm z-50">
        {spinner}
      </div>
    );
  }

  return spinner;
}