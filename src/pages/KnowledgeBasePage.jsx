"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, ChevronLeft, ChevronRight, Search } from "lucide-react";

import KnowledgeBaseCard from "../components/KnowledgeBase/KnowledgeBaseCard";
import EmptyState from "../components/KnowledgeBase/EmptyState";
import CreateKnowledgeBaseModal from "../components/KnowledgeBase/CreateKnowledgeBaseModal";
import { knowledgeBaseCards } from "../data/sidebarData";

const KnowledgeBasePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(9);

  // 🔍 Debounced Search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInput.trim());
      setCurrentPage(1);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchInput]);

  // 🔍 Filter Logic
  const filteredCards = useMemo(() => {
    const query = searchQuery.toLowerCase();

    if (!query) return knowledgeBaseCards;

    return knowledgeBaseCards.filter((card) =>
      `${card.title} ${card.description}`.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  // 📄 Pagination
  const totalPages = Math.max(1, Math.ceil(filteredCards.length / rowsPerPage));

  useEffect(() => {
    setCurrentPage((prev) => Math.min(prev, totalPages));
  }, [totalPages]);

  const paginatedCards = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredCards.slice(start, start + rowsPerPage);
  }, [filteredCards, currentPage, rowsPerPage]);

  // 📄 Navigation
  const goToFirst = () => setCurrentPage(1);
  const goToLast = () => setCurrentPage(totalPages);
  const goPrev = () => setCurrentPage((p) => Math.max(1, p - 1));
  const goNext = () => setCurrentPage((p) => Math.min(totalPages, p + 1));

  return (
    <>
      <div className="flex flex-col h-full min-h-0 bg-white">

        {/* 🔷 HEADER */}
        <div className="flex-shrink-0 px-6 py-4 bg-white ">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <h1 className="text-xl font-semibold text-gray-900">
              Knowledge Base
            </h1>

            <div className="flex items-center w-full gap-3 sm:w-auto">

              {/* Search */}
              <div className="relative w-full sm:w-[280px]">
                <Search className="absolute w-4 h-4 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
                <input
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search knowledge..."
                  className="w-full h-10 pr-3 text-sm border border-gray-200 rounded-md outline-none pl-9 focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              {/* Button */}
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

        {/* 🔷 GRID SECTION */}
        <div className="flex-1 min-h-0 px-6 py-5 overflow-y-auto bg-white">

          {paginatedCards.length > 0 ? (

            <div className="p-5 bg-white border shadow-sm rounded-xl">

              {/* ✅ FIXED GRID (ALWAYS MAX 3 PER ROW) */}
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

        {/* 🔷 PAGINATION */}
        <div className="flex-shrink-0 px-6 py-4 text-sm bg-white ">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

            <div className="text-gray-600">
              {filteredCards.length} results
            </div>

            <div className="flex flex-wrap items-center gap-6">

              {/* Rows */}
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

              {/* Page Info */}
              <div className="text-gray-500">
                page {currentPage} of {totalPages}
              </div>

              {/* Controls */}
              <div className="flex items-center gap-1">

                <button
                  onClick={goToFirst}
                  disabled={currentPage === 1}
                  className="px-2 py-1 border rounded-md hover:bg-gray-100 disabled:opacity-50"
                >
                  {"<<"}
                </button>

                <button
                  onClick={goPrev}
                  disabled={currentPage === 1}
                  className="px-2 py-1 border rounded-md hover:bg-gray-100 disabled:opacity-50"
                >
                  <ChevronLeft size={14} />
                </button>

                <button
                  onClick={goNext}
                  disabled={currentPage === totalPages}
                  className="px-2 py-1 border rounded-md hover:bg-gray-100 disabled:opacity-50"
                >
                  <ChevronRight size={14} />
                </button>

                <button
                  onClick={goToLast}
                  disabled={currentPage === totalPages}
                  className="px-2 py-1 border rounded-md hover:bg-gray-100 disabled:opacity-50"
                >
                  {">>"}
                </button>

              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 🔷 MODAL */}
      <CreateKnowledgeBaseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default KnowledgeBasePage;