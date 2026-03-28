"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, ChevronLeft, ChevronRight, Search } from "lucide-react";

import KnowledgeBaseCard from "../components/features/KnowledgeBase/KnowledgeBaseCard";
import EmptyState from "../components/features/KnowledgeBase/EmptyState";
import { knowledgeBaseCards } from "../data/sidebarData";

import CreateBaseModal from "../components/common/modal/CreateBaseModal";

const KnowledgeBasePage = () => {
  // MODAL
  const [isModalOpen, setIsModalOpen] = useState(false);

  // SEARCH
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // PAGINATION
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(9);

  // DATA
  const [data, setData] = useState(
    Array.isArray(knowledgeBaseCards) ? knowledgeBaseCards : []
  );

  /* ================= SEARCH ================= */
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInput.trim());
      setCurrentPage(1);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const filteredCards = useMemo(() => {
    const query = searchQuery.toLowerCase();

    if (!query) return data;

    return data.filter((card) =>
      `${card.title} ${card.description}`.toLowerCase().includes(query)
    );
  }, [data, searchQuery]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredCards.length / rowsPerPage)
  );

  useEffect(() => {
    setCurrentPage((prev) => Math.min(prev, totalPages));
  }, [filteredCards.length, rowsPerPage]);

  const paginatedCards = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredCards.slice(start, start + rowsPerPage);
  }, [filteredCards, currentPage, rowsPerPage]);

  // NAVIGATION
  const goToFirst = () => setCurrentPage(1);
  const goToLast = () => setCurrentPage(totalPages);
  const goPrev = () => setCurrentPage((p) => Math.max(1, p - 1));
  const goNext = () => setCurrentPage((p) => Math.min(totalPages, p + 1));

  /* ================= ✅ FIXED FIELDS ================= */

  const kbFields = [
    {
      name: "name",
      label: "Name (Cannot be edited later)",
      type: "text",
      required: true,
      placeholder: "Name",
    },
    {
      name: "description",
      label: "Description",
      type: "textarea",
      placeholder: "Description",
    },
    {
      name: "vectorStore",
      label: "Vector Store",
      type: "select",
      required: true,
      options: [
        { value: "qdrant", label: "Qdrant" },
        { value: "faiss", label: "FAISS" },
        { value: "chroma", label: "Chroma" },
      ],
    },
    {
      name: "embeddingModel",
      label: "LLM Embedding Model",
      type: "select",
      required: true,
      options: [
        { value: "text-embedding-ada-002", label: "text-embedding-ada-002" },
        { value: "text-embedding-3-small", label: "text-embedding-3-small" },
      ],
    },
  ];

  return (
    <>
      <div className="flex flex-col h-full min-h-0 bg-white">

        {/* HEADER */}
        <div className="flex-shrink-0 px-6 py-4 bg-white">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <h1 className="text-xl font-semibold text-gray-900">
              Knowledge Base
            </h1>

            <div className="flex items-center w-full gap-3 sm:w-auto">

              {/* SEARCH */}
              <div className="relative w-full sm:w-[280px]">
                <Search className="absolute w-4 h-4 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
                <input
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search knowledge..."
                  className="w-full h-10 pr-3 text-sm border border-gray-200 rounded-md outline-none pl-9 focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              {/* CREATE BUTTON */}
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center h-10 gap-2 px-4 text-sm text-white transition bg-indigo-600 rounded-md hover:bg-indigo-700"
              >
                <Plus size={16} />
                Create New
              </button>

            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div className="flex-1 min-h-0 px-6 py-5 overflow-y-auto bg-white">

          {paginatedCards.length > 0 ? (
            <div className="p-5 bg-white border shadow-sm rounded-xl">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {paginatedCards.map((card) => (
                  <KnowledgeBaseCard key={card.id} {...card} />
                ))}
              </div>
            </div>
          ) : (
            <EmptyState />
          )}

        </div>

        {/* PAGINATION */}
        <div className="flex-shrink-0 px-6 py-4 text-sm bg-white">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

            <div className="text-gray-600">
              {filteredCards.length} results
            </div>

            <div className="flex flex-wrap items-center gap-6">

              <div className="flex items-center gap-2">
                <span className="text-gray-500">Rows</span>
                <select
                  value={rowsPerPage}
                  onChange={(e) => {
                    setRowsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="px-2 py-1 border rounded-md"
                >
                  <option value={6}>6</option>
                  <option value={9}>9</option>
                  <option value={12}>12</option>
                </select>
              </div>

              <div className="text-gray-500">
                page {currentPage} of {totalPages}
              </div>

              <div className="flex items-center gap-1">
                <button onClick={goToFirst} className="px-2 py-1 border rounded-md">{"<<"}</button>
                <button onClick={goPrev} className="px-2 py-1 border rounded-md"><ChevronLeft size={14} /></button>
                <button onClick={goNext} className="px-2 py-1 border rounded-md"><ChevronRight size={14} /></button>
                <button onClick={goToLast} className="px-2 py-1 border rounded-md">{">>"}</button>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* MODAL */}
      <CreateBaseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Knowledge Base"
        subtitle="Best for quick answers from documents, websites and text files."
        fields={kbFields}
        submitLabel="Create"
        initialState={{
          name: "",
          description: "",
          vectorStore: "qdrant",
          embeddingModel: "text-embedding-ada-002",
        }}
        onSubmit={(form) =>
          setData((prev) => [
            {
              id: Date.now(),
              title: form.name,
              description: form.description,
              vectorStore: form.vectorStore,
              embeddingModel: form.embeddingModel,
            },
            ...prev,
          ])
        }
      />
    </>
  );
};

export default KnowledgeBasePage;

//  