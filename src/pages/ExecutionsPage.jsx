"use client";

import { useState, useMemo, useEffect } from "react";
import { executionsData } from "../data/sidebarData";

import ExecutionHeader from "../components/features/Executions/ExecutionHeader";
import ExecutionFilters from "../components/features/Executions/ExecutionFilters";
import ExecutionGrid from "../components/features/Executions/ExecutionGrid";
import ExecutionViewModal from "../components/features/Executions/ExecutionViewModal";

import Pagination from "../components/common/ui/Pagination";

// Static enrichment
const SEED_EXEC = [
  {
    status: "success",
    duration: "34s",
    logs: ["[INFO] Execution started", "[SUCCESS] Task completed"],
  },
  {
    status: "running",
    duration: "12s",
    logs: ["[INFO] Processing..."],
  },
  {
    status: "failed",
    duration: "5s",
    logs: ["[ERROR] Timeout"],
  },
];

const staticExecutions = executionsData.map((e, i) => ({
  ...e,
  ...SEED_EXEC[i % 3],
  pipeline: `Pipeline ${(i % 3) + 1}`,
}));

const ExecutionsPage = () => {
  // DATA (no need for useState since static)
  const data = Array.isArray(staticExecutions) ? staticExecutions : [];

  // FILTERS
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // VIEW MODAL
  const [viewExec, setViewExec] = useState(null);

  // PAGINATION
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState(9);

  // FILTERED DATA
  const filtered = useMemo(() => {
    let d = data;

    if (statusFilter !== "All") {
      const normalized = statusFilter.toLowerCase();
      d = d.filter((i) => i.status === normalized);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      d = d.filter((i) =>
        `${i.name} ${i.agent} ${i.pipeline}`.toLowerCase().includes(q)
      );
    }

    return d;
  }, [data, search, statusFilter]);

  // PAGE SAFETY (prevents empty page bug)
  useEffect(() => {
    const totalPages = Math.max(1, Math.ceil(filtered.length / rows));
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [filtered, page, rows]);

  // PAGINATED DATA
  const paginated = useMemo(() => {
    const start = (page - 1) * rows;
    return filtered.slice(start, start + rows);
  }, [filtered, page, rows]);

  return (
    <div className="flex flex-col w-full h-full gap-4">
      
      {/* HEADER */}
      <ExecutionHeader
        search={search}
        setSearch={(v) => {
          setSearch(v);
          setPage(1);
        }}
      />

      {/* FILTERS */}
      <ExecutionFilters
        statusFilter={statusFilter}
        setStatusFilter={(v) => {
          setStatusFilter(v);
          setPage(1);
        }}
      />

      {/* GRID */}
      <ExecutionGrid
        data={paginated}
        onView={setViewExec}
      />

      {/* PAGINATION */}
      <Pagination
        totalRows={filtered.length}
        currentPage={page}
        totalPages={Math.max(1, Math.ceil(filtered.length / rows))}
        rowsPerPage={rows}
        onPageChange={setPage}
        onRowsPerPageChange={(n) => {
          setRows(n);
          setPage(1);
        }}
      />

      {/* VIEW MODAL */}
      <ExecutionViewModal
        execution={viewExec}
        onClose={() => setViewExec(null)}
      />
    </div>
  );
};

export default ExecutionsPage;