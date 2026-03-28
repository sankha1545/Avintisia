import { useState, useMemo } from "react";
import { triggersData } from "../data/sidebarData";
import {
  Modal,
  DotMenu,
  EmptyState,
} from "../components/common/CardGridPage";
import FormField from "../components/common/FormField";
import TextInput from "../components/common/TextInput";
import TextArea from "../components/common/TextArea";
import SelectInput from "../components/common/SelectInput";
import Button from "../components/common/Button";
import Pagination from "../components/common/Pagination";
import SearchInput from "../components/common/SearchInput";
import Icons from "../components/common/Icons";


// ============================
// TYPE BADGE
// ============================
const typeStyles = {
  Schedule: "bg-blue-100 text-blue-600",
  Webhook: "bg-purple-100 text-purple-600",
  Event: "bg-orange-100 text-orange-600",
};

const TypeBadge = ({ type }) => (
  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${typeStyles[type] || "bg-gray-100 text-gray-500"}`}>
    <Icons name="activity" size={10} />
    {type}
  </span>
);


// ============================
// TOGGLE
// ============================
const Toggle = ({ enabled, onToggle }) => (
  <div
    onClick={onToggle}
    className={`w-10 h-5 flex items-center rounded-full cursor-pointer transition ${
      enabled ? "bg-blue-600" : "bg-gray-300"
    }`}
  >
    <div
      className={`w-4 h-4 bg-white rounded-full shadow transform transition ${
        enabled ? "translate-x-5" : "translate-x-1"
      }`}
    />
  </div>
);


// ============================
// CREATE MODAL
// ============================
const CreateTriggerModal = ({ onClose, onCreate }) => {
  const [name, setName] = useState("");
  const [type, setType] = useState("Schedule");
  const [description, setDesc] = useState("");
  const [cron, setCron] = useState("0 * * * *");
  const [url, setUrl] = useState("");
  const [event, setEvent] = useState("agent.completed");
  const [errors, setErrors] = useState({});

  const submit = () => {
    const e = {};
    if (!name.trim()) e.name = "Required";

    setErrors(e);
    if (Object.keys(e).length) return;

    onCreate({ name, type, description, cron, url, event });
    onClose();
  };

  return (
    <Modal title="Create Trigger" onClose={onClose}>
      <div className="flex flex-col gap-4">

        <FormField label="Trigger Name" error={errors.name}>
          <TextInput value={name} onChange={setName} />
        </FormField>

        <FormField label="Trigger Type">
          <SelectInput
            value={type}
            onChange={setType}
            options={[
              { value: "Schedule", label: "Schedule" },
              { value: "Webhook", label: "Webhook" },
              { value: "Event", label: "Event" },
            ]}
          />
        </FormField>

        {type === "Schedule" && (
          <FormField label="Cron Expression">
            <TextInput value={cron} onChange={setCron} />
            <p className="mt-1 text-xs text-gray-400">
              {cron === "0 * * * *"
                ? "Every hour"
                : cron === "0 9 * * 1-5"
                ? "Weekdays at 9am"
                : "Custom schedule"}
            </p>
          </FormField>
        )}

        {type === "Webhook" && (
          <FormField label="Endpoint URL">
            <TextInput value={url} onChange={setUrl} />
          </FormField>
        )}

        {type === "Event" && (
          <FormField label="Event Type">
            <SelectInput
              value={event}
              onChange={setEvent}
              options={[
                { value: "agent.completed", label: "agent.completed" },
                { value: "agent.failed", label: "agent.failed" },
              ]}
            />
          </FormField>
        )}

        <FormField label="Description">
          <TextArea value={description} onChange={setDesc} />
        </FormField>

        <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
          <Button variant="ghost" onClick={onClose} className="w-full sm:w-auto">
            Cancel
          </Button>
          <Button onClick={submit} className="w-full sm:w-auto">
            Create Trigger
          </Button>
        </div>
      </div>
    </Modal>
  );
};


// ============================
// CARD
// ============================
const TriggerCard = ({ item, onDelete, onEdit, onToggle, onFire }) => (
  <div className="flex flex-col gap-3 p-4 transition bg-white border rounded-xl hover:shadow-md">

    <div className="flex items-start justify-between">
      <div className="flex flex-col gap-1">
        <h3 className="text-sm font-semibold">{item.name}</h3>
        <TypeBadge type={item.type} />
      </div>

      <div className="flex items-center gap-2">
        <Toggle enabled={item.status === "enabled"} onToggle={onToggle} />
        <DotMenu
          onEdit={onEdit}
          onDelete={onDelete}
          extra={[{ label: "Fire Now", action: onFire }]}
        />
      </div>
    </div>

    <p className="text-xs text-gray-500">{item.description}</p>

    {item.cron && (
      <div className="px-2 py-1 font-mono text-xs text-gray-600 bg-gray-100 rounded">
        {item.cron}
      </div>
    )}

    <div className="flex justify-between text-xs text-gray-400">
      <span>Last Run: {item.lastRun}</span>
      <span className={item.status === "enabled" ? "text-green-600" : ""}>
        {item.status === "enabled" ? "● Active" : "○ Disabled"}
      </span>
    </div>

    <p className="text-xs text-gray-400">
      Created On: {item.createdOn}
    </p>
  </div>
);


// ============================
// MAIN PAGE
// ============================
const TriggersPage = () => {
  const [data, setData] = useState(triggersData);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState(9);

  const filtered = useMemo(() => {
    let d = data;

    if (typeFilter !== "All") {
      d = d.filter((i) => i.type === typeFilter);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      d = d.filter((i) =>
        `${i.name} ${i.description}`.toLowerCase().includes(q)
      );
    }

    return d;
  }, [data, search, typeFilter]);

  const paginated = filtered.slice((page - 1) * rows, page * rows);

  return (
    <div className="flex flex-col w-full h-full gap-4">

      {/* HEADER */}
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
              onChange={(v) => {
                setSearch(v);
                setPage(1);
              }}
              placeholder="Search triggers..."
            />
          </div>

          <Button onClick={() => setShowModal(true)} className="w-full sm:w-auto">
            Create Trigger
          </Button>
        </div>
      </div>

      {/* FILTER */}
      <div className="flex flex-wrap gap-2">
        {["All", "Schedule", "Webhook", "Event"].map((t) => (
          <button
            key={t}
            onClick={() => {
              setTypeFilter(t);
              setPage(1);
            }}
            className={`px-3 py-1 rounded-full text-sm border ${
              typeFilter === t
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-500 border-gray-200"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* GRID */}
      {paginated.length === 0 ? (
        <EmptyState title="No triggers found" />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {paginated.map((item) => (
            <TriggerCard
              key={item.id}
              item={item}
              onEdit={() => alert(item.name)}
              onDelete={() => setData((prev) => prev.filter((d) => d.id !== item.id))}
              onToggle={() =>
                setData((prev) =>
                  prev.map((d) =>
                    d.id === item.id
                      ? {
                          ...d,
                          status:
                            d.status === "enabled" ? "disabled" : "enabled",
                        }
                      : d
                  )
                )
              }
              onFire={() => alert(`🔥 Fired: ${item.name}`)}
            />
          ))}
        </div>
      )}

      {/* PAGINATION */}
      <Pagination
        totalRows={filtered.length}
        currentPage={page}
        totalPages={Math.ceil(filtered.length / rows)}
        rowsPerPage={rows}
        onPageChange={setPage}
        onRowsPerPageChange={(n) => {
          setRows(n);
          setPage(1);
        }}
      />

      {/* MODAL */}
      {showModal && (
        <CreateTriggerModal
          onClose={() => setShowModal(false)}
          onCreate={(item) =>
            setData((prev) => [
              {
                ...item,
                id: Date.now(),
                status: "enabled",
                lastRun: "Never",
                createdOn: new Date().toLocaleDateString("en-GB"),
              },
              ...prev,
            ])
          }
        />
      )}
    </div>
  );
};

export default TriggersPage;