// components/features/Published/PublishedHeader.jsx

import SearchInput from "../../common/ui/SearchInput";
import Button from "../../common/ui/Button";

const PublishedHeader = ({ search, setSearch, setPage, onCreate }) => (
  <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">

    <div>
      <h1 className="text-xl font-bold sm:text-2xl">Published</h1>
      <p className="text-sm text-gray-500">
        Manage your published pipelines and workflows.
      </p>
    </div>

    <div className="flex gap-2">
      <SearchInput
        value={search}
        onChange={(v) => {
          setSearch(v);
          setPage(1);
        }}
      />
      <Button onClick={onCreate}>Publish New</Button>
    </div>

  </div>
);

export default PublishedHeader;