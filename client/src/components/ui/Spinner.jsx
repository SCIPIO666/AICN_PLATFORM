/**
 * Spinner — ClickHouse design language
 * Neon-volt (#faff69) tri-arc SVG spin animation
 * fullScreen: overlays the viewport with blur
 */
export default function Spinner({ size = 'md', fullScreen = false }) {
  const sizes = { sm: 'w-5 h-5', md: 'w-8 h-8', lg: 'w-12 h-12' };
  const strokes = { sm: 2, md: 2.5, lg: 3 };

  const sw = strokes[size];

  const spinner = (
    <div className={`inline-block ${sizes[size]}`}>
      <svg
        className="animate-spin"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Loading"
        role="status"
      >
        {/* Arc 1 — dim outer ring */}
        <circle
          cx="12" cy="12" r="10"
          stroke="#faff69"
          strokeWidth={sw}
          strokeLinecap="round"
          strokeDasharray="30 40"
          opacity="0.3"
        />
        {/* Arc 2 — mid-opacity offset */}
        <circle
          cx="12" cy="12" r="10"
          stroke="#faff69"
          strokeWidth={sw}
          strokeLinecap="round"
          strokeDasharray="15 55"
          strokeDashoffset="25"
          opacity="0.7"
        />
        {/* Arc 3 — bright accent */}
        <circle
          cx="12" cy="12" r="10"
          stroke="#f4f692"
          strokeWidth={sw - 0.5}
          strokeLinecap="round"
          strokeDasharray="8 62"
          strokeDashoffset="45"
        />
      </svg>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[var(--bg-page)]/80 backdrop-blur-sm z-50">
        {spinner}
      </div>
    );
  }

  return spinner;
}