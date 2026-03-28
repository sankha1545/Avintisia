import { useState, useMemo } from "react";
import { keyStoreData } from "../data/sidebarData";
import {
  Modal,
  DotMenu,
  EmptyState,
  StatusBadge,
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
// PROVIDER BADGE
// ============================
const providerStyles = {
  OpenAI: "bg-green-100 text-green-600",
  Anthropic: "bg-orange-100 text-orange-600",
  Stripe: "bg-indigo-100 text-indigo-600",
  AWS: "bg-yellow-100 text-yellow-600",
  GitHub: "bg-gray-200 text-gray-700",
  SendGrid: "bg-blue-100 text-blue-600",
  Custom: "bg-gray-100 text-gray-500",
};

const ProviderBadge = ({ provider }) => (
  <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded-full ${providerStyles[provider] || "bg-gray-100 text-gray-500"}`}>
    <span className="w-2 h-2 bg-current rounded-full" />
    {provider}
  </span>
);


// ============================
// CREATE MODAL
// ============================
const CreateKeyModal = ({ onClose, onCreate }) => {
  const [name, setName] = useState("");
  const [provider, setProvider] = useState("OpenAI");
  const [apiKey, setApiKey] = useState("");
  const [desc, setDesc] = useState("");
  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState({});

  const submit = () => {
    const e = {};
    if (!name.trim()) e.name = "Required";
    if (!apiKey.trim()) e.apiKey = "Required";

    setErrors(e);
    if (Object.keys(e).length) return;

    onCreate({ name, provider, apiKey, description: desc });
    onClose();
  };

  return (
    <Modal title="Add API Key" onClose={onClose}>
      <div className="flex flex-col gap-4">

        <FormField label="Key Name" error={errors.name}>
          <TextInput value={name} onChange={setName} />
        </FormField>

        <FormField label="Provider">
          <SelectInput
            value={provider}
            onChange={setProvider}
            options={[
              "OpenAI","Anthropic","Stripe","AWS","GitHub","SendGrid","Custom"
            ].map(p => ({ value: p, label: p }))}
          />
        </FormField>

        <FormField label="API Key" error={errors.apiKey}>
          <div className="relative">
            <TextInput
              type={show ? "text" : "password"}
              value={apiKey}
              onChange={setApiKey}
            />
            <button
              onClick={() => setShow(!show)}
              className="absolute text-gray-400 -translate-y-1/2 right-2 top-1/2"
            >
              <Icons name={show ? "eyeOff" : "eye"} size={14} />
            </button>
          </div>
        </FormField>

        <FormField label="Description">
          <TextArea value={desc} onChange={setDesc} />
        </FormField>

        <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
          <Button variant="ghost" onClick={onClose} className="w-full sm:w-auto">
            Cancel
          </Button>
          <Button onClick={submit} className="w-full sm:w-auto">
            Save Key
          </Button>
        </div>
      </div>
    </Modal>
  );
};


// ============================
// CARD
// ============================
const KeyCard = ({ item, onDelete, onRotate }) => {
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="flex flex-col gap-3 p-4 transition bg-white border rounded-xl hover:shadow-md">

      {/* Header */}
      <div className="flex justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Icons name="key" size={14} />
            <h3 className="text-sm font-semibold">{item.name}</h3>
          </div>
          <ProviderBadge provider={item.provider} />
        </div>

        <DotMenu
          onDelete={onDelete}
          extra={[
            { label: "Rotate", action: onRotate },
          ]}
        />
      </div>

      <p className="text-xs text-gray-500">{item.description}</p>

      {/* Key preview */}
      <div className="flex items-center justify-between px-3 py-2 bg-gray-100 rounded">
        <span className="font-mono text-xs text-gray-600 truncate">
          {revealed ? item.apiKey || "sk-xxxx" : "••••••••••••••••••"}
        </span>

        <button onClick={() => setRevealed(!revealed)}>
          <Icons name={revealed ? "eyeOff" : "eye"} size={14} />
        </button>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-gray-400">
        <StatusBadge status={item.status} />
        <span>Created: {item.createdOn}</span>
      </div>
    </div>
  );
};


// ============================
// MAIN PAGE
// ============================
const KeyStorePage = () => {
  const [data, setData] = useState(keyStoreData);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [providerFilter, setProviderFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState(9);

  const providers = ["All", ...new Set(data.map(d => d.provider))];

  const filtered = useMemo(() => {
    let d = data;

    if (providerFilter !== "All") {
      d = d.filter(i => i.provider === providerFilter);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      d = d.filter(i =>
        `${i.name} ${i.provider}`.toLowerCase().includes(q)
      );
    }

    return d;
  }, [data, search, providerFilter]);

  const paginated = filtered.slice((page - 1) * rows, page * rows);

  return (
    <div className="flex flex-col w-full h-full gap-4">

      {/* HEADER */}
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

          <Button onClick={() => setShowModal(true)} className="w-full sm:w-auto">
            Add Key
          </Button>
        </div>
      </div>

      {/* FILTER + STATS */}
      <div className="flex flex-wrap items-center justify-between gap-2">

        <div className="flex flex-wrap gap-2">
          {providers.map((p) => (
            <button
              key={p}
              onClick={() => {
                setProviderFilter(p);
                setPage(1);
              }}
              className={`px-3 py-1 rounded-full text-sm border ${
                providerFilter === p
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-500 border-gray-200"
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        <div className="flex gap-4 text-sm text-gray-500">
          <span><strong>{data.filter(d => d.status === "active").length}</strong> Active</span>
          <span><strong>{data.filter(d => d.status === "expired").length}</strong> Expired</span>
        </div>
      </div>

      {/* GRID */}
      {paginated.length === 0 ? (
        <EmptyState title="No keys found" />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {paginated.map((item) => (
            <KeyCard
              key={item.id}
              item={item}
              onDelete={() =>
                setData(prev => prev.filter(d => d.id !== item.id))
              }
              onRotate={() => alert("Key rotation initiated")}
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
        <CreateKeyModal
          onClose={() => setShowModal(false)}
          onCreate={(item) =>
            setData(prev => [
              {
                ...item,
                id: Date.now(),
                status: "active",
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

export default KeyStorePage;