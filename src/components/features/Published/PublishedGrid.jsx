// components/features/Published/PublishedGrid.jsx

import PipelineCard from "./PipelineCard";
import EmptyState from "../../common/layout/EmptyState";

const PublishedGrid = ({
  data,
  onView,
  onEdit,
  onDelete,
  onToggle,
}) => {
  if (!data || data.length === 0) {
    return <EmptyState title="No pipelines found" />;
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {data.map((item) => (
        <PipelineCard
          key={item.id}
          item={item}
          onView={() => onView(item)}
          onEdit={() => onEdit(item)}
          onDelete={() => onDelete(item)}
          onToggle={() => onToggle(item.id)}
        />
      ))}
    </div>
  );
};

export default PublishedGrid;