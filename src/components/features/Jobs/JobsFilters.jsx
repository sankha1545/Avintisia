// components/features/Jobs/JobsFilters.jsx
const JobsFilters = ({ statusFilter, setStatusFilter, setPage }) => {
  const filters = ["All", "Completed", "Running", "Failed", "Queued"];

  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((s) => (
        <button
          key={s}
          onClick={() => {
            setStatusFilter(s);
            setPage(1);
          }}
          className={`px-3 py-1 rounded-full text-sm border ${
            statusFilter === s
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-white text-gray-500 border-gray-200"
          }`}
        >
          {s}
        </button>
      ))}
    </div>
  );
};

export default JobsFilters;