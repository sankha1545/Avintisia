// components/features/Executions/ExecutionGrid.jsx

import ExecutionCard from "./ExecutionCard";
import EmptyState from "../../common/layout/EmptyState";

const ExecutionGrid = ({ data, onView }) => {
  if (!data || data.length === 0) {
    return <EmptyState title="No executions found" />;
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {data.map((item) => (
        <ExecutionCard
          key={item.id}
          item={item}
          onView={() => onView(item)}
        />
      ))}
    </div>
  );
};

export default ExecutionGrid;