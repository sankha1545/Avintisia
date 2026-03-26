import { useState, useMemo } from 'react';
import { Plus } from 'lucide-react';
import KnowledgeBaseCard from '../components/KnowledgeBaseCard';
import EmptyState from '../components/EmptyState';
import Pagination from '../components/Pagination';
import SearchInput from '../components/SearchInput';
import Button from '../components/Button';
import CreateKnowledgeBaseModal from '../components/CreateKnowledgeBaseModal';
import { knowledgeBaseCards } from '../data/sidebarData';

const KnowledgeBasePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Filter cards based on search
  const filteredCards = useMemo(() => {
    if (!searchQuery.trim()) return knowledgeBaseCards;
    return knowledgeBaseCards.filter(
      (card) =>
        card.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        card.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  // Pagination calculations
  const totalPages = Math.max(1, Math.ceil(filteredCards.length / rowsPerPage));
  const paginatedCards = filteredCards.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleRowsPerPageChange = (value) => {
    setRowsPerPage(value);
    setCurrentPage(1);
  };

  return (
    <>
      <div className="flex flex-col h-full">
        {/* Page Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-5">
          <h1 className="text-[22px] font-semibold text-text-primary">
            Knowledge Base
          </h1>
          <div className="flex items-center gap-3">
            <SearchInput value={searchQuery} onChange={setSearchQuery} />
            <Button
              variant="primary"
              size="md"
              onClick={() => setIsModalOpen(true)}
            >
              <Plus size={16} className="mr-1.5" />
              Create New
            </Button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 px-6 pb-4 overflow-y-auto">
          {paginatedCards.length > 0 ? (
            <div className="grid grid-cols-3 gap-5">
              {paginatedCards.map((card) => (
                <KnowledgeBaseCard
                  key={card.id}
                  title={card.title}
                  description={card.description}
                  createdOn={card.createdOn}
                />
              ))}
            </div>
          ) : (
            <EmptyState />
          )}
        </div>

        {/* Pagination Footer */}
        <Pagination
          totalRows={filteredCards.length}
          rowsPerPage={rowsPerPage}
          currentPage={currentPage}
          totalPages={totalPages}
          onRowsPerPageChange={handleRowsPerPageChange}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Create New Modal */}
      <CreateKnowledgeBaseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default KnowledgeBasePage;
