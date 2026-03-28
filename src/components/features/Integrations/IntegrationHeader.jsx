// components/features/Integrations/IntegrationHeader.jsx
import SearchInput from "../../common/ui/SearchInput";

const IntegrationHeader = ({ search, setSearch }) => (
  <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
    <div>
      <h1 className="text-xl font-bold sm:text-2xl">Integrations</h1>
      <p className="text-sm text-gray-500">
        Connect external tools and services.
      </p>
    </div>

    <div className="w-full sm:w-64">
      <SearchInput value={search} onChange={setSearch} />
    </div>
  </div>
);

export default IntegrationHeader;