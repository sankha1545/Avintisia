// components/features/Library/LibraryHeader.jsx
import SearchInput from "../../common/ui/SearchInput";
import Button from "../../common/ui/Button";

const LibraryHeader = ({ search, setSearch, setPage, onCreate }) => (
  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

    <div>
      <h1 className="text-xl font-bold sm:text-2xl">Library</h1>
      <p className="text-sm text-gray-500">
        Browse and manage reusable agent templates.
      </p>
    </div>

    <div className="flex flex-col w-full gap-2 sm:flex-row sm:w-auto">
      <div className="w-full sm:w-64">
        <SearchInput
          value={search}
          onChange={(v) => {
            setSearch(v);
            setPage(1);
          }}
        />
      </div>

      <Button onClick={onCreate}>Add Template</Button>
    </div>

  </div>
);

export default LibraryHeader;