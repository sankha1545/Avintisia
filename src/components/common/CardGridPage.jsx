import { useState, useMemo } from "react";
import Icons from "./Icons";
import SearchInput from "./SearchInput";
import Button from "./Button";
import Pagination from "./Pagination";


// ============================
// STATUS BADGE
// ============================
const statusColors = {
  active: "bg-green-100 text-green-600",
  idle: "bg-yellow-100 text-yellow-600",
  stopped: "bg-gray-100 text-gray-500",
  running: "bg-blue-100 text-blue-600",
  failed: "bg-red-100 text-red-500",
};

export const StatusBadge = ({ status }) => (
  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium capitalize ${statusColors[status] || "bg-gray-100 text-gray-500"}`}>
    <span className="w-1.5 h-1.5 rounded-full bg-current" />
    {status}
  </span>
);



export const DotMenu = ({ onView, onEdit, onDelete }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen((o) => !o);
        }}
        className="p-1 rounded hover:bg-gray-100"
      >
        <Icons name="moreVertical" size={16} />
      </button>

      {open && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />

          {/* Menu */}
          <div className="absolute right-0 z-50 overflow-hidden bg-white border rounded-lg shadow-lg top-8 w-36">

            {onView && (
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  onView();
                  setOpen(false);
                }}
                className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-50"
              >
                View
              </div>
            )}

            {onEdit && (
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit();
                  setOpen(false);
                }}
                className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-50"
              >
                Edit
              </div>
            )}

            {onDelete && (
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                  setOpen(false);
                }}
                className="px-3 py-2 text-sm text-red-500 cursor-pointer hover:bg-red-50"
              >
                Delete
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};


// ============================
// CARD
// ============================
export const Card = ({
  title,
  description,
  meta = [],
  status,
  createdOn,
  onView,
  onEdit,
  onDelete,
}) => (
  <div className="flex flex-col w-full min-w-0 gap-2 p-4 transition bg-white border border-gray-200 rounded-xl hover:shadow-md">

    {/* Top */}
    <div className="flex items-start justify-between">
      <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
      <DotMenu onView={onView} onEdit={onEdit} onDelete={onDelete} />
    </div>

    <p className="flex-1 text-xs leading-relaxed text-gray-500">
      {description}
    </p>

    {meta.length > 0 && (
      <div className="flex flex-wrap gap-1">
        {meta.map((m, i) => (
          <span key={i} className="px-2 py-0.5 text-[11px] bg-gray-100 text-gray-600 rounded-full">
            {m}
          </span>
        ))}
      </div>
    )}

    {status && <StatusBadge status={status} />}

    <p className="mt-1 text-[11px] text-gray-400">
      <span className="font-medium text-gray-300">Created On: </span>
      {createdOn}
    </p>
  </div>
);


// ============================
// EMPTY STATE
// ============================
export const EmptyState = ({ title, subtitle, action }) => (
  <div className="flex flex-col items-center justify-center gap-3 py-16">
    <div className="flex items-center justify-center bg-gray-100 rounded-full w-14 h-14">
      <Icons name="search" size={20} className="text-gray-400" />
    </div>
    <div className="text-center">
      <p className="font-semibold text-gray-700">{title}</p>
      {subtitle && <p className="mt-1 text-sm text-gray-400">{subtitle}</p>}
    </div>
    {action}
  </div>
);


// ============================
// MODAL
// ============================
export const Modal = ({ title, onClose, children }) => (
  <div onClick={onClose} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
    <div onClick={(e) => e.stopPropagation()} className="w-full max-w-lg bg-white rounded-xl shadow-xl max-h-[90vh] overflow-y-auto">
      <div className="flex items-center justify-between px-5 pt-5">
        <h3 className="text-base font-semibold">{title}</h3>
        <button onClick={onClose}>
          <Icons name="x" size={18} />
        </button>
      </div>
      <div className="px-5 pt-4 pb-5">{children}</div>
    </div>
  </div>
);


// ============================
// MAIN PAGE WRAPPER
// ============================
const CardGridPage = ({
  title,
  subtitle,
  data,
  searchPlaceholder,
  searchKeys = ["name", "description"],
  renderCard,
  createLabel,
  onCreate,
}) => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState(9);

  const filtered = useMemo(() => {
    if (!search.trim()) return data;
    const q = search.toLowerCase();
    return data.filter((item) =>
      searchKeys.some((k) =>
        String(item[k] ?? "").toLowerCase().includes(q)
      )
    );
  }, [search, data, searchKeys]);

  const paginated = filtered.slice((page - 1) * rows, page * rows);

  return (
    <div className="w-full h-full px-3 py-4 overflow-y-auto sm:px-4 md:px-6 sm:py-6">

      {/* HEADER */}
      <div className="flex flex-col gap-4 mb-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
        </div>

        <div className="flex flex-col w-full gap-2 sm:flex-row lg:w-auto">
          <div className="w-full sm:w-64">
            <SearchInput
              value={search}
              onChange={(v) => {
                setSearch(v);
                setPage(1);
              }}
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

      {/* GRID */}
      {paginated.length === 0 ? (
        <EmptyState title="No results found" />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 sm:gap-5">
          {paginated.map((item) => renderCard(item))}
        </div>
      )}

      {/* PAGINATION */}
      <div className="mt-6">
        <Pagination
          totalRows={filtered.length}
          currentPage={page}
          totalPages={Math.ceil(filtered.length / rows)}
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