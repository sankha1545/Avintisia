import {
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
} from "lucide-react";

const Pagination = ({
  totalRows,
  rowsPerPage,
  currentPage,
  totalPages,
  onRowsPerPageChange,
  onPageChange,
}) => {

  const PaginationButton = ({ children, onClick, disabled }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        w-8 h-8 flex items-center justify-center 
        border border-border rounded 
        text-text-muted transition-colors
        ${disabled 
          ? "opacity-40 cursor-not-allowed" 
          : "hover:bg-gray-50 hover:text-text-secondary"}
      `}
    >
      {children}
    </button>
  );

  return (
    <div className="w-full max-w-full px-3 py-3 overflow-hidden bg-white border-t border-card-border sm:px-4 md:px-6">

      {/* MAIN WRAPPER */}
      <div className="flex flex-col gap-3  sm:flex-row sm:items-center sm:justify-between">

        {/* LEFT: ROW COUNT */}
        <span className="text-text-secondary text-[13px]">
          {totalRows} rows
        </span>

        {/* RIGHT SECTION */}
        <div className="flex flex-col w-full gap-3  sm:flex-row sm:items-center sm:gap-6 sm:w-auto">

          {/* Rows per page */}
          <div className="flex items-center gap-2">
            <span className="text-text-secondary text-[13px] whitespace-nowrap">
              Rows per page
            </span>

            <select
              value={rowsPerPage}
              onChange={(e) => onRowsPerPageChange(Number(e.target.value))}
              className="border border-border rounded px-2 py-1 text-[13px] text-text-secondary bg-white outline-none cursor-pointer"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>

          {/* Page Info */}
          <span className="text-text-secondary text-[13px] whitespace-nowrap">
            page {currentPage} of {totalPages}
          </span>

          {/* Buttons */}
          <div className="flex flex-wrap items-center gap-1">
            <PaginationButton
              onClick={() => onPageChange(1)}
              disabled={currentPage === 1}
            >
              <ChevronsLeft size={14} />
            </PaginationButton>

            <PaginationButton
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft size={14} />
            </PaginationButton>

            <PaginationButton
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight size={14} />
            </PaginationButton>

            <PaginationButton
              onClick={() => onPageChange(totalPages)}
              disabled={currentPage === totalPages}
            >
              <ChevronsRight size={14} />
            </PaginationButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pagination;