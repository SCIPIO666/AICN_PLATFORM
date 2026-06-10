import { Button } from "./Button";
export default function Pagination({ currentPage, totalPages, onPageChange }) {
  const getPages = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else if (currentPage <= 3) {
      for (let i = 1; i <= 4; i++) pages.push(i);
      pages.push('...');
      pages.push(totalPages);
    } else if (currentPage >= totalPages - 2) {
      pages.push(1);
      pages.push('...');
      for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      pages.push('...');
      for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
      pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="sm" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
        ← Previous
      </Button>
      
      {getPages().map((page, idx) => (
        <button
          key={idx}
          onClick={() => typeof page === 'number' && onPageChange(page)}
          className={`
            px-3 py-1 rounded-sharp transition-all duration-200 text-sm font-medium
            ${page === currentPage
              ? 'bg-neon-volt text-pure-black'
              : page === '...'
              ? 'cursor-default text-text-muted'
              : 'hover:bg-hover-gray text-text-primary'
            }
          `}
          disabled={page === '...'}
        >
          {page}
        </button>
      ))}
      
      <Button variant="ghost" size="sm" onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>
        Next →
      </Button>
    </div>
  );
}