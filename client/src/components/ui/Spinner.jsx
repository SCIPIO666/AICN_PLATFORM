export default function Spinner({ size = 'md', fullScreen = false }) {
  const sizes = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  const strokeWidths = {
    sm: 2,
    md: 2.5,
    lg: 3,
  };

  const spinner = (
    <div className={`inline-block ${sizes[size]}`}>
      <svg
        className="animate-spin"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Intertwining arc 1 */}
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="#faff69"
          strokeWidth={strokeWidths[size]}
          strokeLinecap="round"
          strokeDasharray="30 40"
          className="opacity-30"
        />
        
        {/* Intertwining arc 2 - offset */}
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="#faff69"
          strokeWidth={strokeWidths[size]}
          strokeLinecap="round"
          strokeDasharray="15 55"
          strokeDashoffset="25"
          className="opacity-70"
        />
        
        {/* Intertwining arc 3 - accent */}
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="#f4f692"
          strokeWidth={strokeWidths[size] - 0.5}
          strokeLinecap="round"
          strokeDasharray="8 62"
          strokeDashoffset="45"
        />
      </svg>
    </div>
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