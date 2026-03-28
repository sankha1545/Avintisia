"use client";

import { useState, useMemo, useEffect } from "react";
import { queuesData } from "../data/sidebarData";

import QueuesHeader from "../components/features/Queues/QueuesHeader";
import QueuesGrid from "../components/features/Queues/QueuesGrid";

import CreateBaseModal from "../components/common/modal/CreateBaseModal";

import Pagination from "../components/common/ui/Pagination";
import EditModal from "../components/common/modal/EditModal";
import DeleteConfirmModal from "../components/common/modal/DeleteConfirmModal";

const QueuesPage = () => {
  // DATA
  const [data, setData] = useState(queuesData);

  // MODALS
  const [showCreate, setShowCreate] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);
  const [purgeItem, setPurgeItem] = useState(null);

  // FILTERS
  const [search, setSearch] = useState("");

  // PAGINATION
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState(9);

  // FILTER
  const filtered = useMemo(() => {
    if (!search.trim()) return data;

    const q = search.toLowerCase();
    return data.filter((i) =>
      `${i.name} ${i.type}`.toLowerCase().includes(q)
    );
  }, [data, search]);

  // PAGINATION SAFETY
  const totalPages = Math.max(1, Math.ceil(filtered.length / rows));

  useEffect(() => {
    setPage((prev) => Math.min(prev, totalPages));
  }, [totalPages]);

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
        type: form.type,
        concurrency: form.concurrency,
        description: form.description,
        pending: 0,
        processed: 0,
        failed: 0,
        createdOn: new Date().toLocaleDateString("en-GB"),
      },
      ...prev,
    ]);
  };

  // UPDATE (FIXED)
  const handleUpdate = (updated) => {
    setData((prev) =>
      prev.map((d) => (d.id === updated.id ? { ...d, ...updated } : d))
    );
    setEditItem(null);
  };

  // DELETE (FIXED)
  const handleDelete = () => {
    if (!deleteItem?.id) return;

    setData((prev) => prev.filter((d) => d.id !== deleteItem.id));
    setDeleteItem(null);
  };

  // PURGE (FIXED)
  const handlePurge = () => {
    if (!purgeItem?.id) return;

    setData((prev) =>
      prev.map((d) =>
        d.id === purgeItem.id
          ? { ...d, pending: 0 }
          : d
      )
    );

    setPurgeItem(null);
  };

  // CREATE FIELDS
  const queueFields = [
    {
      name: "name",
      label: "Queue Name",
      type: "text",
      required: true,
    },
    {
      name: "type",
      label: "Type",
      type: "text",
      required: true,
    },
    {
      name: "concurrency",
      label: "Concurrency",
      type: "text",
    },
    {
      name: "description",
      label: "Description",
      type: "textarea",
    },
  ];

  return (
    <div className="flex flex-col gap-4">

      <QueuesHeader
        onCreate={() => setShowCreate(true)}
      />

      <QueuesGrid
        data={paginated}
        onEdit={setEditItem}
        onDelete={setDeleteItem}
        onPurge={setPurgeItem}
      />

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

      <CreateBaseModal
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
        title="Create Queue"
        subtitle="Manage background processing queues."
        fields={queueFields}
        submitLabel="Create Queue"
        initialState={{
          name: "",
          type: "",
          concurrency: "",
          description: "",
        }}
        onSubmit={handleCreate}
      />

      <EditModal
        isOpen={!!editItem}
        onClose={() => setEditItem(null)}
        initialData={editItem}
        title="Edit Queue"
        fields={[
          { key: "name", label: "Name" },
          { key: "type", label: "Type" },
          { key: "concurrency", label: "Concurrency" },
          { key: "description", label: "Description" },
        ]}
        onSubmit={(updated) =>
          handleUpdate({ ...editItem, ...updated })
        }
      />

      <DeleteConfirmModal
        isOpen={!!deleteItem}
        onClose={() => setDeleteItem(null)}
        title="Delete Queue"
        message={`Delete "${deleteItem?.name}"?`}
        onConfirm={handleDelete}
      />

      <DeleteConfirmModal
        isOpen={!!purgeItem}
        onClose={() => setPurgeItem(null)}
        title="Purge Queue"
        message={`Clear all pending jobs in "${purgeItem?.name}"?`}
        onConfirm={handlePurge}
      />
    </div>
  );
};

export default QueuesPage;