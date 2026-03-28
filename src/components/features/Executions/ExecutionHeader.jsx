// components/features/Executions/ExecutionHeader.jsx
import SearchInput from "../../common/ui/SearchInput";

const ExecutionHeader = ({ search, setSearch, setPage }) => (
  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
    <div>
      <h1 className="text-xl font-bold sm:text-2xl">Executions</h1>
      <p className="text-sm text-gray-500">
        View execution history, logs, and results.
      </p>
    </div>

    <div className="w-full sm:w-64">
      <SearchInput
        value={search}
        onChange={(v) => {
          setSearch(v);
          setPage(1);
        }}
        placeholder="Search executions..."
      />
    </div>
  </div>
);

export default ExecutionHeader;