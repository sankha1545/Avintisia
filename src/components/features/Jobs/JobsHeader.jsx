// components/features/Jobs/JobsHeader.jsx
import SearchInput from "../../common/ui/SearchInput";
import Button from "../../common/ui/Button";

const JobsHeader = ({ search, setSearch, setPage, onCreate }) => (
  <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
    <div>
      <h1 className="text-xl font-bold sm:text-2xl">Jobs</h1>
      <p className="text-sm text-gray-500">
        Monitor and manage jobs.
      </p>
    </div>

    <div className="flex flex-col gap-2 sm:flex-row">
      <div className="w-full sm:w-64">
        <SearchInput
          value={search}
          onChange={(v) => {
            setSearch(v);
            setPage(1);
          }}
          placeholder="Search jobs..."
        />
      </div>

      <Button onClick={onCreate}>Create Job</Button>
    </div>
  </div>
);

export default JobsHeader;