import { useState, useMemo, useEffect } from "react";
import SearchInput from "../ui/SearchInput";
import Button from "../ui/Button";
import Pagination from "../ui/Pagination";
import EmptyState from "./EmptyState";

const CardGridPage = ({
  title,
  subtitle,
  data = [],
  searchPlaceholder,
  searchKeys = ["name", "description"],
  renderCard,
  createLabel,
  onCreate,
}) => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState(9);

  const safeData = Array.isArray(data) ? data : [];

  // FILTER
  const filtered = useMemo(() => {
    if (!search.trim()) return safeData;

    const q = search.toLowerCase();

    return safeData.filter((item) =>
      searchKeys.some((k) =>
        String(item?.[k] ?? "").toLowerCase().includes(q)
      )
    );
  }, [search, safeData, searchKeys]);

  // TOTAL PAGES (FIXED)
  const totalPages = Math.max(1, Math.ceil(filtered.length / rows));

  // PAGE SAFETY (CRITICAL FIX)
  useEffect(() => {
    setPage((prev) => Math.min(prev, totalPages));
  }, [filtered.length, rows]);

  // RESET PAGE ON SEARCH
  useEffect(() => {
    setPage(1);
  }, [search]);

  // PAGINATED DATA
  const paginated = useMemo(() => {
    const start = (page - 1) * rows;
    return filtered.slice(start, start + rows);
  }, [filtered, page, rows]);

  return (
    <div className="flex flex-col w-full h-full px-3 py-4 overflow-y-auto sm:px-4 md:px-6 sm:py-6">
      
      {/* Header */}
      <div className="flex flex-col gap-4 mb-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
          )}
        </div>

        <div className="flex flex-col w-full gap-2 sm:flex-row lg:w-auto">
          <div className="w-full sm:w-64">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder={searchPlaceholder}
            />
          </div>

          {onCreate && (
            <Button className="w-full sm:w-auto" onClick={onCreate}>
              {createLabel}
            </Button>
          )}
        </div>
      </div>

      {/* Grid */}
      {paginated.length === 0 ? (
        <EmptyState title="No results found" />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 sm:gap-5">
          {paginated.map((item, index) => (
            <div key={item?.id || index}>
              {renderCard(item)}
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="mt-6">
        <Pagination
          totalRows={filtered.length}
          currentPage={page}
          totalPages={totalPages}   // FIXED
          rowsPerPage={rows}
          onPageChange={setPage}
          onRowsPerPageChange={(n) => {
            setRows(n);
            setPage(1);
          }}
        />
      </div>
    </div>
  );
};

export default CardGridPage;