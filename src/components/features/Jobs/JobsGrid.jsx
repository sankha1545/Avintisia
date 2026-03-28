// components/features/Jobs/JobsGrid.jsx

import JobCard from "./JobCard";
import EmptyState from "../../common/layout/EmptyState";

const JobsGrid = ({ data, onView, onDelete, onRetry }) => {
  if (!data || data.length === 0) {
    return <EmptyState title="No jobs found" />;
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {data.map((item) => (
        <JobCard
          key={item.id}
          item={item}
          onView={() => onView(item)}
          onDelete={() => onDelete(item)}
          onRetry={() => onRetry(item)}
        />
      ))}
    </div>
  );
};

export default JobsGrid;