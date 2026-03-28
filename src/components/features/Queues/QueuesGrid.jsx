// components/features/Queues/QueuesGrid.jsx

import QueueCard from "./QueueCard";
import EmptyState from "../../common/layout/EmptyState";

const QueuesGrid = ({ data, onEdit, onDelete, onPurge }) => {
  if (!data || data.length === 0) {
    return <EmptyState title="No queues found" />;
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {data.map((item) => (
        <QueueCard
          key={item.id}
          item={item}
          onEdit={() => onEdit(item)}
          onDelete={() => onDelete(item)}
          onPurge={() => onPurge(item)}
        />
      ))}
    </div>
  );
};

export default QueuesGrid;