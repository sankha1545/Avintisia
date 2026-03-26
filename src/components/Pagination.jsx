import {
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
} from 'lucide-react';

const Pagination = ({ totalRows, rowsPerPage, currentPage, totalPages, onRowsPerPageChange, onPageChange }) => {
  const PaginationButton = ({ children, onClick, disabled }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-8 h-8 flex items-center justify-center border border-border rounded text-text-muted transition-colors cursor-pointer
        ${disabled ? 'opacity-40 cursor-not-allowed' : 'hover:bg-gray-50 hover:text-text-secondary'}
      `}
    >
      {children}
    </button>
  );

  return (
    <div className="flex items-center justify-between px-6 py-3 bg-white border-t border-card-border text-sm">
      {/* Left - Row Count */}
      <span className="text-text-secondary text-[13px]">{totalRows} rows</span>

      {/* Right - Rows per page & Page navigation */}
      <div className="flex items-center gap-6">
        {/* Rows per page */}
        <div className="flex items-center gap-2">
          <span className="text-text-secondary text-[13px]">Rows per page</span>
          <select
            value={rowsPerPage}
            onChange={(e) => onRowsPerPageChange(Number(e.target.value))}
            className="border border-border rounded px-2 py-1 text-[13px] text-text-secondary bg-white outline-none cursor-pointer appearance-auto"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>

        {/* Page Info */}
        <span className="text-text-secondary text-[13px]">
          page {currentPage} of {totalPages}
        </span>

        {/* Pagination Buttons */}
        <div className="flex items-center gap-1">
          <PaginationButton
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
          >
            <ChevronsLeft size={16} />
          </PaginationButton>
          <PaginationButton
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft size={16} />
          </PaginationButton>
          <PaginationButton
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight size={16} />
          </PaginationButton>
          <PaginationButton
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
          >
            <ChevronsRight size={16} />
          </PaginationButton>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
