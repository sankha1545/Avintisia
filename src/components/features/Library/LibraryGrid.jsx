// components/features/Library/LibraryGrid.jsx

import LibraryCard from "./LibraryCard";
import EmptyState from "../../common/layout/EmptyState";

const LibraryGrid = ({ data, onView, onDelete }) => {
  if (!data || data.length === 0) {
    return <EmptyState title="No templates found" />;
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {data.map((item) => (
        <LibraryCard
          key={item.id}
          item={item}
          onView={() => onView(item)}
          onDelete={() => onDelete(item)}
        />
      ))}
    </div>
  );
};

export default LibraryGrid;