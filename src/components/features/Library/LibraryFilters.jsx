// components/features/Library/LibraryFilters.jsx
const CATEGORIES = ["All", "NLP", "Vision", "Automation", "Audio", "Data"];

const LibraryFilters = ({ filter, setFilter, setPage }) => (
  <div className="flex flex-wrap gap-2">
    {CATEGORIES.map((c) => (
      <button
        key={c}
        onClick={() => {
          setFilter(c);
          setPage(1);
        }}
        className={`px-3 py-1 rounded-full text-sm border ${
          filter === c
            ? "bg-blue-600 text-white border-blue-600"
            : "bg-white text-gray-500 border-gray-200"
        }`}
      >
        {c}
      </button>
    ))}
  </div>
);

export default LibraryFilters;