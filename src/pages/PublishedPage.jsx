"use client";

import { useState, useMemo, useEffect } from "react";
import { publishedData } from "../data/sidebarData";

import StatusBadge from "../components/common/ui/StatusBadge";

import PublishedHeader from "../components/features/Published/PublishedHeader";
import PublishedGrid from "../components/features/Published/PublishedGrid";

import CreateBaseModal from "../components/common/modal/CreateBaseModal";

import Pagination from "../components/common/ui/Pagination";
import ViewModal from "../components/common/modal/ViewModal";
import EditModal from "../components/common/modal/EditModal";
import DeleteConfirmModal from "../components/common/modal/DeleteConfirmModal";

const PublishedPage = () => {
  // DATA (safe initialization)
  const [data, setData] = useState(
    Array.isArray(publishedData) ? publishedData : []
  );

  // MODALS
  const [showCreate, setShowCreate] = useState(false);
  const [viewItem, setViewItem] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);

  // FILTERS
  const [search, setSearch] = useState("");

  // PAGINATION
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState(9);

  // FILTER
  const filtered = useMemo(() => {
    let d = data;

    if (search.trim()) {
      const q = search.toLowerCase();
      d = d.filter((i) =>
        `${i.name} ${i.description}`.toLowerCase().includes(q)
      );
    }

    return d;
  }, [data, search]);

  // TOTAL PAGES
  const totalPages = Math.max(1, Math.ceil(filtered.length / rows));

  // PAGINATION SAFETY (fixed dependency)
  useEffect(() => {
    setPage((prev) => Math.min(prev, totalPages));
  }, [filtered.length, rows]);

  // PAGINATED DATA
  const paginated = useMemo(() => {
    const start = (page - 1) * rows;
    return filtered.slice(start, start + rows);
  }, [filtered, page, rows]);

  // CREATE
  const handleCreate = (form) => {
    setData((prev) => [
      {
        id: Date.now(),
        name: form.name,
        description: form.description,
        version: form.version,
        env: form.env,
        status: "draft",
        createdOn: new Date().toLocaleDateString("en-GB"),
      },
      ...prev,
    ]);
  };

  // UPDATE
  const handleUpdate = (updated) => {
    setData((prev) =>
      prev.map((d) =>
        d.id === updated.id ? { ...d, ...updated } : d
      )
    );
    setEditItem(null);
  };

  // DELETE
  const handleDelete = () => {
    if (!deleteItem?.id) return;

    setData((prev) =>
      prev.filter((d) => d.id !== deleteItem.id)
    );
    setDeleteItem(null);
  };

  // CREATE FIELDS
  const pipelineFields = [
    {
      name: "name",
      label: "Pipeline Name",
      type: "text",
      required: true,
    },
    {
      name: "version",
      label: "Version",
      type: "text",
    },
    {
      name: "env",
      label: "Environment",
      type: "text",
    },
    {
      name: "description",
      label: "Description",
      type: "textarea",
    },
  ];

  return (
    <div className="flex flex-col w-full h-full gap-4">

      {/* HEADER */}
      <PublishedHeader
        search={search}
        setSearch={(v) => {
          setSearch(v);
          setPage(1);
        }}
        onCreate={() => setShowCreate(true)}
      />

      {/* GRID */}
      <PublishedGrid
        data={paginated}
        onView={setViewItem}
        onEdit={setEditItem}
        onDelete={setDeleteItem}
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

      {/* CREATE MODAL */}
      <CreateBaseModal
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
        title="Create Pipeline"
        subtitle="Define and publish pipeline workflows."
        fields={pipelineFields}
        submitLabel="Create Pipeline"
        initialState={{
          name: "",
          version: "",
          env: "",
          description: "",
        }}
        onSubmit={handleCreate}
      />

      {/* VIEW MODAL */}
      <ViewModal
        isOpen={!!viewItem}
        onClose={() => setViewItem(null)}
        title="Pipeline Details"
        data={viewItem}
        fields={[
          { key: "name", label: "Name" },
          { key: "description", label: "Description" },
          {
            key: "status",
            label: "Status",
            render: (v) => <StatusBadge status={v} />,
          },
          { key: "version", label: "Version" },
          { key: "env", label: "Environment" },
          { key: "createdOn", label: "Created On" },
        ]}
      />

      {/* EDIT MODAL */}
      <EditModal
        isOpen={!!editItem}
        onClose={() => setEditItem(null)}
        initialData={editItem}
        title="Edit Pipeline"
        fields={[
          { key: "name", label: "Name" },
          { key: "version", label: "Version" },
          { key: "env", label: "Environment" },
          { key: "description", label: "Description" },
        ]}
        onSubmit={(updated) =>
          handleUpdate({ ...editItem, ...updated })
        }
      />

      {/* DELETE MODAL */}
      <DeleteConfirmModal
        isOpen={!!deleteItem}
        onClose={() => setDeleteItem(null)}
        title="Delete Pipeline"
        message={`Delete "${deleteItem?.name}"?`}
        onConfirm={handleDelete}
      />

    </div>
  );
};

export default PublishedPage;