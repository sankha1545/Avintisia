// components/features/Machines/MachinesHeader.jsx
import SearchInput from "../../common/ui/SearchInput";
import Button from "../../common/ui/Button";

const MachinesHeader = ({ search, setSearch, setPage, onCreate }) => (
  <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">

    <div>
      <h1 className="text-xl font-bold sm:text-2xl">Machines</h1>
      <p className="text-sm text-gray-500">
        Monitor and manage your compute machines.
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
      <Button onClick={onCreate}>Add Machine</Button>
    </div>

  </div>
);

export default MachinesHeader;