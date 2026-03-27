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

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInput.trim());
      setCurrentPage(1);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const filteredCards = useMemo(() => {
    const query = searchQuery.toLowerCase();

    if (!query) return knowledgeBaseCards;

    return knowledgeBaseCards.filter((card) =>
      `${card.title} ${card.description}`.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredCards.length / rowsPerPage));

  useEffect(() => {
    setCurrentPage((prev) => Math.min(prev, totalPages));
  }, [totalPages]);

  const paginatedCards = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredCards.slice(start, start + rowsPerPage);
  }, [filteredCards, currentPage, rowsPerPage]);

  const goToFirst = () => setCurrentPage(1);
  const goToLast = () => setCurrentPage(totalPages);
  const goPrev = () => setCurrentPage((p) => Math.max(1, p - 1));
  const goNext = () => setCurrentPage((p) => Math.min(totalPages, p + 1));

  return (
    <>
      <div className="flex h-full min-h-0 flex-col overflow-hidden bg-gray-50">
        {/* TOP HEADER: fixed in layout */}
        <div className="flex-shrink-0 border-b bg-white px-4 py-3 sm:px-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-lg font-semibold text-gray-900">
              Knowledge Base
            </h1>

            <div className="flex w-full items-center gap-2 sm:w-auto sm:gap-3">
              <div className="relative flex-1 sm:w-[260px]">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search knowledge..."
                  className="h-9 w-full rounded-md border border-gray-200 pl-9 pr-3 text-sm outline-none transition focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex h-9 items-center justify-center gap-2 whitespace-nowrap rounded-md bg-indigo-600 px-4 text-sm text-white transition hover:bg-indigo-700"
              >
                <Plus size={16} />
                Create New
              </button>
            </div>
          </div>
        </div>

        {/* MIDDLE: only this section scrolls */}
        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3 sm:px-6">
          {paginatedCards.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
              {paginatedCards.map((card) => (
                <KnowledgeBaseCard key={card.id} {...card} />
              ))}
            </div>
          ) : (
            <EmptyState />
          )}
        </div>

        {/* BOTTOM PAGINATION: fixed in layout */}
        <div className="flex-shrink-0 border-t bg-white px-4 py-3 text-sm sm:px-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-gray-600">{filteredCards.length} results</div>

            <div className="flex flex-wrap items-center gap-4 sm:gap-6">
              <div className="flex items-center gap-2">
                <span className="whitespace-nowrap text-gray-500">Rows</span>
                <select
                  value={rowsPerPage}
                  onChange={(e) => {
                    setRowsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="rounded-md border px-2 py-1 text-sm outline-none"
                >
                  <option value={6}>6</option>
                  <option value={9}>9</option>
                  <option value={12}>12</option>
                </select>
              </div>

              <div className="whitespace-nowrap text-gray-500">
                page {currentPage} of {totalPages}
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={goToFirst}
                  disabled={currentPage === 1}
                  className="rounded-md border px-2 py-1 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-80"
                  aria-label="Go to first page"
                >
                  {"<<"}
                </button>

                <button
                  onClick={goPrev}
                  disabled={currentPage === 1}
                  className="rounded-md border px-2 py-1 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-80"
                  aria-label="Go to previous page"
                >
                  <ChevronLeft size={14} />
                </button>

                <button
                  onClick={goNext}
                  disabled={currentPage === totalPages}
                  className="rounded-md border px-2 py-1 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-80"
                  aria-label="Go to next page"
                >
                  <ChevronRight size={14} />
                </button>

                <button
                  onClick={goToLast}
                  disabled={currentPage === totalPages}
                  className="rounded-md border px-2 py-1 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-80"
                  aria-label="Go to last page"
                >
                  {">>"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <CreateKnowledgeBaseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default KnowledgeBasePage;