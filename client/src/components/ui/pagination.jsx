import { Button } from './Button';

/**
 * Pagination — ClickHouse design language
 *
 * Active page: neon-volt (#faff69) bg, pure-black text
 * Ghost prev/next: standard ghost button
 * Ellipsis: muted, non-interactive
 */
export default function Pagination({ currentPage, totalPages, onPageChange }) {
  const getPages = () => {
    const pages = [];
    const max = 5;

    if (totalPages <= max) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else if (currentPage <= 3) {
      for (let i = 1; i <= 4; i++) pages.push(i);
      pages.push('…');
      pages.push(totalPages);
    } else if (currentPage >= totalPages - 2) {
      pages.push(1);
      pages.push('…');
      for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      pages.push('…');
      for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
      pages.push('…');
      pages.push(totalPages);
    }
    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <nav
      className="flex items-center gap-1"
      aria-label="Pagination"
    >
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        ← Prev
      </Button>

      {getPages().map((page, idx) => {
        const isActive  = page === currentPage;
        const isEllipsis = page === '…';

        return (
          <button
            key={`${page}-${idx}`}
            onClick={() => !isEllipsis && onPageChange(page)}
            disabled={isEllipsis}
            aria-current={isActive ? 'page' : undefined}
            className={[
              'min-w-[2rem] h-8 px-2 rounded-[4px] text-sm font-medium',
              'transition-all duration-200',
              isActive
                ? 'bg-[#faff69] text-[#000000]'
                : isEllipsis
                ? 'cursor-default text-[var(--text-muted)]'
                : 'text-[var(--text-primary)] hover:bg-[var(--card-hover)]',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            {page}
          </button>
        );
      })}

      <Button
        variant="ghost"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
      >
        Next →
      </Button>
    </nav>
  );
}