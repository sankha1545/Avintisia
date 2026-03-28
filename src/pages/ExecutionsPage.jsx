import { useState, useMemo } from "react";
import { executionsData } from "../data/sidebarData";
import {
  Modal,
  DotMenu,
  EmptyState,
  StatusBadge,
} from "../components/common/CardGridPage";
import Button from "../components/common/Button";
import Pagination from "../components/common/Pagination";
import SearchInput from "../components/common/SearchInput";
import Icons from "../components/common/Icons";


// ============================
// MOCK DATA
// ============================
const SEED_EXEC = [
  { status: "success", duration: "34s", logs: ["[INFO] Execution started", "[SUCCESS] Task completed"] },
  { status: "running", duration: "12s", logs: ["[INFO] Processing..."] },
  { status: "failed", duration: "5s", logs: ["[ERROR] Timeout"] },
];

const staticExecutions = executionsData.map((e, i) => ({
  ...e,
  ...SEED_EXEC[i % 3],
  pipeline: `Pipeline ${(i % 3) + 1}`,
}));


// ============================
// LOG MODAL
// ============================
const LogModal = ({ execution, onClose }) => (
  <Modal title={`Logs: ${execution.name}`} onClose={onClose}>
    <div className="flex flex-col gap-4">

      {/* Header */}
      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
        <StatusBadge status={execution.status} />
        <span>Duration: <strong className="text-gray-700">{execution.duration}</strong></span>
        <span>Agent: <strong className="text-gray-700">{execution.agent}</strong></span>
      </div>

      {/* Logs */}
      <div className="bg-[#0f111a] rounded-lg p-3 max-h-52 overflow-y-auto text-xs font-mono space-y-1">
        {execution.logs.map((log, i) => (
          <div key={i} className="text-gray-400">{log}</div>
        ))}
      </div>

      {/* I/O */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <p className="mb-1 text-xs font-semibold text-gray-400">INPUT</p>
          <div className="p-2 font-mono text-xs bg-gray-100 rounded">{execution.input}</div>
        </div>
        <div>
          <p className="mb-1 text-xs font-semibold text-gray-400">OUTPUT</p>
          <div className="p-2 font-mono text-xs bg-gray-100 rounded">{execution.output}</div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button variant="ghost" onClick={onClose}>Close</Button>
      </div>
    </div>
  </Modal>
);


// ============================
// CARD
// ============================
const ExecutionCard = ({ item, onView }) => (
  <div
    onClick={onView}
    className="flex flex-col w-full gap-2 p-4 transition bg-white border cursor-pointer rounded-xl hover:shadow-md"
  >
    {/* Header */}
    <div className="flex justify-between">
      <div>
        <h3 className="text-sm font-semibold text-gray-900">{item.name}</h3>
        <p className="text-xs text-gray-400">{item.agent} · {item.pipeline}</p>
      </div>
      <DotMenu onView={onView} />
    </div>

    {/* Description */}
    <p className="text-xs text-gray-500">{item.description}</p>

    {/* Status */}
    <StatusBadge status={item.status} />

    {/* Log Preview */}
    <div className="bg-[#0f111a] rounded px-2 py-1 text-xs text-gray-400 font-mono">
      {item.logs[item.logs.length - 1]}
    </div>

    {/* Footer */}
    <div className="flex justify-between text-xs text-gray-400">
      <div className="flex items-center gap-1">
        <Icons name="activity" size={12} />
        {item.duration}
      </div>
      <span>{item.createdOn}</span>
    </div>
  </div>
);


// ============================
// MAIN PAGE
// ============================
const ExecutionsPage = () => {
  const [data] = useState(staticExecutions);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [viewExec, setViewExec] = useState(null);
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState(9);

  const filtered = useMemo(() => {
    let d = data;

    if (statusFilter !== "All") {
      d = d.filter((i) => i.status === statusFilter.toLowerCase());
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      d = d.filter((i) =>
        `${i.name} ${i.agent} ${i.pipeline}`.toLowerCase().includes(q)
      );
    }

    return d;
  }, [data, search, statusFilter]);

  const paginated = filtered.slice((page - 1) * rows, page * rows);

  return (
    <div className="flex flex-col w-full h-full gap-4">

      {/* HEADER */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold sm:text-2xl">Executions</h1>
          <p className="text-sm text-gray-500">
            View execution history, logs, and results.
          </p>
        </div>

        <div className="w-full sm:w-64">
          <SearchInput
            value={search}
            onChange={(v) => {
              setSearch(v);
              setPage(1);
            }}
            placeholder="Search executions..."
          />
        </div>
      </div>

      {/* FILTERS */}
      <div className="flex flex-wrap items-center gap-2">
        {["All", "Success", "Running", "Failed"].map((s) => (
          <button
            key={s}
            onClick={() => {
              setStatusFilter(s);
              setPage(1);
            }}
            className={`px-3 py-1 rounded-full text-sm border ${
              statusFilter === s
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-500 border-gray-200"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* GRID */}
      {paginated.length === 0 ? (
        <EmptyState title="No executions found" />
      ) : (
        <div className="grid grid-cols-1 gap-4  sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {paginated.map((item) => (
            <ExecutionCard
              key={item.id}
              item={item}
              onView={() => setViewExec(item)}
            />
          ))}
        </div>
      )}

      {/* PAGINATION */}
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

      {/* MODAL */}
      {viewExec && (
        <LogModal
          execution={viewExec}
          onClose={() => setViewExec(null)}
        />
      )}
    </div>
  );
};

export default ExecutionsPage;