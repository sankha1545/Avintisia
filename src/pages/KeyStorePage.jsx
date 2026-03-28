"use client";

import { useState, useMemo, useEffect } from "react";
import { keyStoreData } from "../data/sidebarData";

import KeyStoreHeader from "../components/features/KeyStore/KeyStoreHeader";
import KeyStoreFilters from "../components/features/KeyStore/KeyStoreFilters";
import KeyStoreGrid from "../components/features/KeyStore/KeyStoreGrid";

import Pagination from "../components/common/ui/Pagination";
import DeleteConfirmModal from "../components/common/modal/DeleteConfirmModal";
import CreateBaseModal from "../components/common/modal/CreateBaseModal";

const KeyStorePage = () => {
  // DATA (safe initialization)
  const [data, setData] = useState(
    Array.isArray(keyStoreData) ? keyStoreData : []
  );

  // MODALS
  const [showModal, setShowModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [rotateTarget, setRotateTarget] = useState(null);

  // FILTERS
  const [search, setSearch] = useState("");
  const [providerFilter, setProviderFilter] = useState("All");

  // PAGINATION
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState(9);

  // PROVIDERS LIST (memoized)
  const providers = useMemo(() => {
    return ["All", ...new Set(data.map((d) => d.provider))];
  }, [data]);

  // FILTER LOGIC
  const filtered = useMemo(() => {
    let d = data;

    if (providerFilter !== "All") {
      d = d.filter((i) => i.provider === providerFilter);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      d = d.filter((i) =>
        `${i.name} ${i.provider}`.toLowerCase().includes(q)
      );
    }

    return d;
  }, [data, search, providerFilter]);

  // TOTAL PAGES
  const totalPages = Math.max(1, Math.ceil(filtered.length / rows));

  // PAGE SAFETY
  useEffect(() => {
    setPage((prev) => Math.min(prev, totalPages));
  }, [filtered.length, rows]);

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

  // ROTATE HANDLER
  const handleRotate = () => {
    if (!rotateTarget) return;

    console.log("Rotate key:", rotateTarget);
    setRotateTarget(null);
  };

  // CREATE FIELDS CONFIG
  const keyFields = [
    {
      name: "name",
      label: "Key Name",
      type: "text",
      required: true,
    },
    {
      name: "provider",
      label: "Provider",
      type: "select",
      options: [
        "OpenAI",
        "Anthropic",
        "Stripe",
        "AWS",
        "GitHub",
        "SendGrid",
        "Custom",
      ].map((p) => ({ value: p, label: p })),
    },
    {
      name: "apiKey",
      label: "API Key",
      type: "password",
      required: true,
    },
    {
      name: "desc",
      label: "Description",
      type: "textarea",
    },
  ];

  return (
    <div className="flex flex-col w-full h-full gap-4">

      {/* HEADER */}
      <KeyStoreHeader
        search={search}
        setSearch={(v) => {
          setSearch(v);
          setPage(1);
        }}
        onCreate={() => setShowModal(true)}
      />

      {/* FILTERS */}
      <KeyStoreFilters
        providers={providers}
        providerFilter={providerFilter}
        setProviderFilter={(v) => {
          setProviderFilter(v);
          setPage(1);
        }}
        data={data}
      />

      {/* GRID */}
      <KeyStoreGrid
        data={paginated}
        onDelete={setDeleteTarget}
        onRotate={setRotateTarget}
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
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Add API Key"
        subtitle="Store and manage API credentials securely."
        fields={keyFields}
        submitLabel="Save Key"
        initialState={{
          name: "",
          provider: "OpenAI",
          apiKey: "",
          desc: "",
        }}
        onSubmit={(form) => {
          setData((prev) => [
            {
              id: Date.now(),
              name: form.name,
              provider: form.provider,
              apiKey: form.apiKey,
              description: form.desc,
              status: "active",
              createdOn: new Date().toLocaleDateString("en-GB"),
            },
            ...prev,
          ]);
        }}
      />

      {/* DELETE MODAL */}
      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete API Key"
        message={`Are you sure you want to delete "${deleteTarget?.name}"?`}
        onConfirm={handleDelete}
      />

      {/* ROTATE MODAL */}
      <DeleteConfirmModal
        isOpen={!!rotateTarget}
        onClose={() => setRotateTarget(null)}
        title="Rotate API Key"
        message={`Rotate key "${rotateTarget?.name}"?`}
        onConfirm={handleRotate}
      />

    </div>
  );
};

export default KeyStorePage;