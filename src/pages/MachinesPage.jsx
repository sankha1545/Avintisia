"use client";

import { useState, useMemo, useEffect } from "react";
import { machinesData } from "../data/sidebarData";

import MachinesHeader from "../components/features/Machines/MachinesHeader";
import MachinesGrid from "../components/features/Machines/MachinesGrid";

import CreateBaseModal from "../components/common/modal/CreateBaseModal";

import Pagination from "../components/common/ui/Pagination";
import EditModal from "../components/common/modal/EditModal";
import DeleteConfirmModal from "../components/common/modal/DeleteConfirmModal";

const MachinesPage = () => {
  // DATA
  const [data, setData] = useState(machinesData);

  // MODALS
  const [showCreate, setShowCreate] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);

  // FILTERS
  const [search, setSearch] = useState("");

  // PAGINATION
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState(9);

  // CREATE
  const handleCreate = (form) => {
    setData((prev) => [
      {
        id: Date.now(),
        name: form.name,
        region: form.region,
        os: form.os,
        description: form.description,
        status: "pending",
        cpu: "0%",
        memory: "0 GB",
        createdOn: new Date().toLocaleDateString("en-GB"),
      },
      ...prev,
    ]);
  };

  // UPDATE
  const handleUpdate = (updated) => {
    setData((prev) =>
      prev.map((d) => (d.id === updated.id ? { ...d, ...updated } : d))
    );
    setEditItem(null);
  };

  // DELETE (SAFE)
  const handleDelete = () => {
    if (!deleteItem?.id) return;

    setData((prev) => prev.filter((d) => d.id !== deleteItem.id));
    setDeleteItem(null);
  };

  // START
  const handleStart = (id) => {
    if (!id) return;

    setData((prev) =>
      prev.map((d) =>
        d.id === id ? { ...d, status: "running" } : d
      )
    );
  };

  // STOP
  const handleStop = (id) => {
    if (!id) return;

    setData((prev) =>
      prev.map((d) =>
        d.id === id ? { ...d, status: "stopped" } : d
      )
    );
  };

  // FILTER
  const filtered = useMemo(() => {
    let d = data;

    if (search.trim()) {
      const q = search.toLowerCase();
      d = d.filter((i) =>
        `${i.name} ${i.region} ${i.os}`.toLowerCase().includes(q)
      );
    }

    return d;
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

  // CREATE FIELDS CONFIG
  const machineFields = [
    {
      name: "name",
      label: "Machine Name",
      type: "text",
      required: true,
    },
    {
      name: "region",
      label: "Region",
      type: "text",
      required: true,
    },
    {
      name: "os",
      label: "Operating System",
      type: "text",
      required: true,
    },
    {
      name: "description",
      label: "Description",
      type: "textarea",
    },
  ];

  return (
    <div className="flex flex-col w-full h-full gap-4">

      <MachinesHeader
        search={search}
        setSearch={(v) => {
          setSearch(v);
          setPage(1);
        }}
        setPage={setPage}
        onCreate={() => setShowCreate(true)}
      />

      <MachinesGrid
        data={paginated}
        onEdit={setEditItem}
        onDelete={setDeleteItem}
        onStart={handleStart}
        onStop={handleStop}
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
        title="Create Machine"
        subtitle="Provision and manage compute machines."
        fields={machineFields}
        submitLabel="Create Machine"
        initialState={{
          name: "",
          region: "",
          os: "",
          description: "",
        }}
        onSubmit={handleCreate}
      />

      <EditModal
        isOpen={!!editItem}
        onClose={() => setEditItem(null)}
        initialData={editItem}
        title="Edit Machine"
        fields={[
          { key: "name", label: "Name" },
          { key: "region", label: "Region" },
          { key: "os", label: "OS" },
          { key: "description", label: "Description" },
        ]}
        onSubmit={(updated) =>
          handleUpdate({ ...editItem, ...updated })
        }
      />

      <DeleteConfirmModal
        isOpen={!!deleteItem}
        onClose={() => setDeleteItem(null)}
        title="Delete Machine"
        message={`Are you sure you want to delete "${deleteItem?.name}"?`}
        onConfirm={handleDelete}
      />

    </div>
  );
};

export default MachinesPage;