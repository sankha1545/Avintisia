"use client";

import { useState, useMemo, useEffect } from "react";
import { libraryData } from "../data/sidebarData";

import LibraryHeader from "../components/features/Library/LibraryHeader";
import LibraryFilters from "../components/features/Library/LibraryFilters";
import LibraryGrid from "../components/features/Library/LibraryGrid";

import CreateBaseModal from "../components/common/modal/CreateBaseModal";

import Pagination from "../components/common/ui/Pagination";
import ViewModal from "../components/common/modal/ViewModal";
import DeleteConfirmModal from "../components/common/modal/DeleteConfirmModal";

const LibraryPage = () => {
  // DATA (safe initialization)
  const [data, setData] = useState(
    Array.isArray(libraryData) ? libraryData : []
  );

  // MODALS
  const [showModal, setShowModal] = useState(false);
  const [viewItem, setViewItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);

  // FILTERS
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  // PAGINATION
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState(9);

  // CREATE HANDLER
  const handleCreate = (form) => {
    setData((prev) => [
      {
        id: Date.now(),
        name: form.name,
        description: form.description,
        category: form.category,
        tags: form.tags,
        downloads: 0,
        createdOn: new Date().toLocaleDateString("en-GB"),
      },
      ...prev,
    ]);
  };

  // DELETE HANDLER
  const handleDelete = () => {
    if (!deleteItem?.id) return;

    setData((prev) => prev.filter((d) => d.id !== deleteItem.id));
    setDeleteItem(null);
  };

  // FILTER LOGIC
  const filtered = useMemo(() => {
    let d = data;

    if (filter !== "All") {
      d = d.filter((i) => i.category === filter);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      d = d.filter((i) =>
        `${i.name} ${i.description} ${i.category}`
          .toLowerCase()
          .includes(q)
      );
    }

    return d;
  }, [data, search, filter]);

  // TOTAL PAGES
  const totalPages = Math.max(1, Math.ceil(filtered.length / rows));

  // PAGE SAFETY (fixed dependency)
  useEffect(() => {
    setPage((prev) => Math.min(prev, totalPages));
  }, [filtered.length, rows]);

  // PAGINATED DATA
  const paginated = useMemo(() => {
    const start = (page - 1) * rows;
    return filtered.slice(start, start + rows);
  }, [filtered, page, rows]);

  // CREATE FIELDS CONFIG
  const libraryFields = [
    {
      name: "name",
      label: "Template Name",
      type: "text",
      required: true,
    },
    {
      name: "description",
      label: "Description",
      type: "textarea",
    },
    {
      name: "category",
      label: "Category",
      type: "text",
      required: true,
    },
    {
      name: "tags",
      label: "Tags",
      type: "text",
    },
  ];

  return (
    <div className="flex flex-col w-full h-full gap-4">

      {/* HEADER */}
      <LibraryHeader
        search={search}
        setSearch={(v) => {
          setSearch(v);
          setPage(1);
        }}
        onCreate={() => setShowModal(true)}
      />

      {/* FILTERS */}
      <LibraryFilters
        filter={filter}
        setFilter={(v) => {
          setFilter(v);
          setPage(1);
        }}
      />

      {/* GRID */}
      <LibraryGrid
        data={paginated}
        onView={setViewItem}
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
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Create Template"
        subtitle="Add reusable templates to your library."
        fields={libraryFields}
        submitLabel="Create Template"
        initialState={{
          name: "",
          description: "",
          category: "",
          tags: "",
        }}
        onSubmit={handleCreate}
      />

      {/* VIEW MODAL */}
      <ViewModal
        isOpen={!!viewItem}
        onClose={() => setViewItem(null)}
        title="Template Details"
        data={viewItem}
        fields={[
          { key: "name", label: "Name" },
          { key: "description", label: "Description" },
          { key: "category", label: "Category" },
          { key: "tags", label: "Tags" },
          { key: "downloads", label: "Downloads" },
          { key: "createdOn", label: "Created On" },
        ]}
      />

      {/* DELETE MODAL */}
      <DeleteConfirmModal
        isOpen={!!deleteItem}
        onClose={() => setDeleteItem(null)}
        title="Delete Template"
        message={`Are you sure you want to delete "${deleteItem?.name}"?`}
        onConfirm={handleDelete}
      />

    </div>
  );
};

export default LibraryPage;