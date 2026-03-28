import SearchInput from "../../common/ui/SearchInput";
import Button from "../../common/ui/Button";

const TriggersHeader = ({ search, setSearch, onCreate }) => {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
      <div>
        <h1 className="text-xl font-bold sm:text-2xl">Triggers</h1>
        <p className="text-sm text-gray-500">
          Configure schedules, webhooks, and event triggers.
        </p>
      </div>

      <div className="flex flex-col w-full gap-2 sm:flex-row sm:w-auto">
        <div className="w-full sm:w-64">
          <SearchInput
            value={search}
            onChange={(v) => setSearch(v)}
            placeholder="Search triggers..."
          />
        </div>

        <Button onClick={onCreate}>Create Trigger</Button>
      </div>
    </div>
  );
};

export default TriggersHeader;