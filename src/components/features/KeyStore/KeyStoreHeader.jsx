// components/features/KeyStore/KeyStoreHeader.jsx
import SearchInput from "../../common/ui/SearchInput";
import Button from "../../common/ui/Button";

const KeyStoreHeader = ({ search, setSearch, setPage, onCreate }) => (
  <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
    <div>
      <h1 className="text-xl font-bold sm:text-2xl">Key Store</h1>
      <p className="text-sm text-gray-500">
        Manage API keys and provider credentials.
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
        />
      </div>

      <Button onClick={onCreate}>Add Key</Button>
    </div>
  </div>
);

export default KeyStoreHeader;