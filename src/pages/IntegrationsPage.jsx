import { useState, useMemo } from "react";
import { integrationsData } from "../data/sidebarData";
import { Modal, EmptyState } from "../components/common/CardGridPage";
import FormField from "../components/common/FormField";
import TextInput from "../components/common/TextInput";
import Button from "../components/common/Button";
import SearchInput from "../components/common/SearchInput";
import Icons from "../components/common/Icons";

const allIntegrations = [...integrationsData];

// ============================
// CONFIG MODAL
// ============================
const ConfigModal = ({ integration, onClose, onSave }) => {
  const [apiKey, setApiKey] = useState("");

  return (
    <Modal title={`Configure ${integration.name}`} onClose={onClose}>
      <div className="flex flex-col gap-4">

        <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
          <span className="text-2xl">{integration.icon}</span>
          <div>
            <p className="font-semibold">{integration.name}</p>
            <p className="text-xs text-gray-400">{integration.category}</p>
          </div>
        </div>

        <FormField label="API Key">
          <TextInput value={apiKey} onChange={setApiKey} />
        </FormField>

        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={() => { onSave(integration.id); onClose(); }}>
            Connect
          </Button>
        </div>
      </div>
    </Modal>
  );
};

// ============================
// FILTER (🔥 FIXED)
// ============================
const FilterTabs = ({ value, onChange }) => {
  const tabs = ["All", "Connected", "Not Connected"];

  return (
    <div className="flex items-center gap-6 overflow-x-auto border-b border-gray-200">

      {tabs.map((tab) => {
        const active = value === tab;

        return (
          <button
            key={tab}
            onClick={() => onChange(tab)}
            className={`
              relative pb-2 text-sm font-medium whitespace-nowrap transition
              ${active ? "text-gray-900" : "text-gray-400 hover:text-gray-600"}
            `}
          >
            {tab}

            {/* 🔥 Active underline */}
            {active && (
              <span className="absolute left-0 bottom-0 h-[2px] w-full bg-blue-600 rounded-full" />
            )}
          </button>
        );
      })}
    </div>
  );
};


// ============================
// CARD
// ============================
const IntegrationCard = ({ item, onConfigure, onDisconnect }) => {
  const connected = item.status === "connected";

  return (
    <div className={`p-4 rounded-xl border transition hover:shadow-md ${
      connected ? "border-green-200" : "border-gray-200"
    }`}>

      <div className="flex justify-between">
        <div className="flex gap-3">
          <div className="flex items-center justify-center text-xl bg-gray-100 rounded-lg w-11 h-11">
            {item.icon}
          </div>
          <div>
            <p className="text-sm font-semibold">{item.name}</p>
            <p className="text-xs text-gray-400">{item.category}</p>
          </div>
        </div>

        <span className={`text-xs px-2 py-0.5 rounded-full ${
          connected ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"
        }`}>
          {connected ? "Connected" : "Not Connected"}
        </span>
      </div>

      <p className="mt-2 text-xs text-gray-500">{item.description}</p>

      <div className="mt-3">
        {connected ? (
          <div className="flex gap-2">
            <Button size="sm" variant="ghost" onClick={() => onConfigure(item)}>
              Configure
            </Button>
            <Button size="sm" variant="danger" onClick={() => onDisconnect(item.id)}>
              Disconnect
            </Button>
          </div>
        ) : (
          <Button size="sm" className="w-full" onClick={() => onConfigure(item)}>
            Connect
          </Button>
        )}
      </div>
    </div>
  );
};


// ============================
// MAIN PAGE
// ============================
const IntegrationsPage = () => {
  const [data, setData] = useState(allIntegrations);
  const [configTarget, setConfigTarget] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filtered = useMemo(() => {
    let d = data;

    if (statusFilter === "Connected") {
      d = d.filter(i => i.status === "connected");
    }

    if (statusFilter === "Not Connected") {
      d = d.filter(i => i.status === "disconnected");
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      d = d.filter(i =>
        `${i.name} ${i.category}`.toLowerCase().includes(q)
      );
    }

    return d;
  }, [data, search, statusFilter]);

  const handleConnect = (id) =>
    setData(prev => prev.map(d =>
      d.id === id ? { ...d, status: "connected" } : d
    ));

  const handleDisconnect = (id) =>
    setData(prev => prev.map(d =>
      d.id === id ? { ...d, status: "disconnected" } : d
    ));

  return (
    <div className="flex flex-col w-full gap-4">

      {/* HEADER */}
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

      {/* 🔥 NEW FILTER */}
      <FilterTabs value={statusFilter} onChange={setStatusFilter} />

      {/* GRID */}
      {filtered.length === 0 ? (
        <EmptyState title="No integrations found" />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map(item => (
            <IntegrationCard
              key={item.id}
              item={item}
              onConfigure={setConfigTarget}
              onDisconnect={handleDisconnect}
            />
          ))}
        </div>
      )}

      {/* MODAL */}
      {configTarget && (
        <ConfigModal
          integration={configTarget}
          onClose={() => setConfigTarget(null)}
          onSave={handleConnect}
        />
      )}
    </div>
  );
};

export default IntegrationsPage;