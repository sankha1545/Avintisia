"use client";

import { useState, useMemo, useEffect } from "react";
import { jobsData } from "../data/sidebarData";

import JobsHeader from "../components/features/Jobs/JobsHeader";
import JobsFilters from "../components/features/Jobs/JobsFilters";
import JobsGrid from "../components/features/Jobs/JobsGrid";

import CreateBaseModal from "../components/common/modal/CreateBaseModal";
import JobDetailModal from "../components/features/Jobs/JobDetailModal";

import Pagination from "../components/common/ui/Pagination";
import DeleteConfirmModal from "../components/common/modal/DeleteConfirmModal";

const JobsPage = () => {
  // DATA (safe initialization)
  const [data, setData] = useState(
    Array.isArray(jobsData) ? jobsData : []
  );

  // MODALS
  const [showCreate, setShowCreate] = useState(false);
  const [viewJob, setViewJob] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // FILTERS
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

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
        `${i.name} ${i.agent} ${i.type}`.toLowerCase().includes(q)
      );
    }

    return d;
  }, [data, search, statusFilter]);

  // TOTAL PAGES
  const totalPages = Math.max(1, Math.ceil(filtered.length / rows));

  // PAGE SAFETY
  useEffect(() => {
    setPage((prev) => Math.min(prev, totalPages));
  }, [filtered.length, rows]); // safer dependency

  // PAGINATED DATA
  const paginated = useMemo(() => {
    const start = (page - 1) * rows;
    return filtered.slice(start, start + rows);
  }, [filtered, page, rows]);

  // DELETE HANDLER
  const handleDelete = () => {
    if (!deleteTarget?.id) return;

    setData((prev) => prev.filter((d) => d.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  // CREATE FIELDS CONFIG
  const jobFields = [
    {
      name: "name",
      label: "Job Name",
      type: "text",
      required: true,
    },
    {
      name: "agent",
      label: "Agent",
      type: "text",
      required: true,
    },
    {
      name: "type",
      label: "Type",
      type: "select",
      options: [
        { value: "batch", label: "Batch" },
        { value: "realtime", label: "Realtime" },
        { value: "scheduled", label: "Scheduled" },
      ],
    },
  ];

  return (
    <>
      <div className="flex flex-col w-full h-full gap-4">

        {/* HEADER */}
        <JobsHeader
          search={search}
          setSearch={(v) => {
            setSearch(v);
            setPage(1);
          }}
          onCreate={() => setShowCreate(true)}
        />

        {/* FILTERS */}
        <JobsFilters
          statusFilter={statusFilter}
          setStatusFilter={(v) => {
            setStatusFilter(v);
            setPage(1);
          }}
        />

        {/* GRID */}
        <JobsGrid
          data={paginated}
          onView={setViewJob}
          onDelete={setDeleteTarget}
          onRetry={(item) =>
            setData((prev) =>
              prev.map((d) =>
                d.id === item.id ? { ...d, status: "queued" } : d
              )
            )
          }
        />

        {/* PAGINATION */}
        <Pagination
          totalRows={filtered.length}
          currentPage={page}
          totalPages={totalPages}
          rowsPerPage={rows}
          onPageChange={setPage}
          onRowsPerPageChange={(n) => {
            setRows(n);
            setPage(1);
          }}
        />

      </div>

      {/* CREATE MODAL */}
      <CreateBaseModal
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
        title="Create Job"
        subtitle="Schedule and manage background jobs."
        fields={jobFields}
        submitLabel="Create Job"
        initialState={{
          name: "",
          agent: "",
          type: "batch",
        }}
        onSubmit={(form) =>
          setData((prev) => [
            {
              id: Date.now(),
              name: form.name,
              agent: form.agent,
              type: form.type,
              status: "queued",
              duration: "—",
              startedAt: "—",
              createdOn: new Date().toLocaleDateString("en-GB"),
            },
            ...prev,
          ])
        }
      />

      {/* VIEW MODAL */}
      <JobDetailModal
        job={viewJob}
        onClose={() => setViewJob(null)}
      />

      {/* DELETE MODAL */}
      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Job"
        message={`Are you sure you want to delete "${deleteTarget?.name}"?`}
        onConfirm={handleDelete}
      />
    </>
  );
};

export default JobsPage;