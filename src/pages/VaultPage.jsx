import { useState, useMemo } from "react";
import { vaultData } from "../data/sidebarData";
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
  "API Key": "bg-blue-100 text-blue-600",
  Password: "bg-purple-100 text-purple-600",
  Token: "bg-green-100 text-green-600",
  Certificate: "bg-orange-100 text-orange-600",
};

const TypeBadge = ({ type }) => (
  <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${typeStyles[type] || "bg-gray-100 text-gray-500"}`}>
    {type}
  </span>
);


// ============================
// CREATE MODAL
// ============================
const CreateSecretModal = ({ onClose, onCreate }) => {
  const [name, setName] = useState("");
  const [type, setType] = useState("API Key");
  const [value, setValue] = useState("");
  const [description, setDesc] = useState("");
  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState({});

  const submit = () => {
    const e = {};
    if (!name.trim()) e.name = "Required";
    if (!value.trim()) e.value = "Required";

    setErrors(e);
    if (Object.keys(e).length) return;

    onCreate({ name, type, secretValue: value, description });
    onClose();
  };

  return (
    <Modal title="Add Secret" onClose={onClose}>
      <div className="flex flex-col gap-4">

        <FormField label="Secret Name" error={errors.name}>
          <TextInput value={name} onChange={setName} />
        </FormField>

        <FormField label="Type">
          <SelectInput
            value={type}
            onChange={setType}
            options={[
              { value: "API Key", label: "API Key" },
              { value: "Password", label: "Password" },
              { value: "Token", label: "Token" },
              { value: "Certificate", label: "Certificate" },
            ]}
          />
        </FormField>

        <FormField label="Secret Value" error={errors.value}>
          <div className="relative">
            <TextInput
              type={show ? "text" : "password"}
              value={value}
              onChange={setValue}
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
          <TextArea value={description} onChange={setDesc} />
        </FormField>

        <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
          <Button variant="ghost" onClick={onClose} className="w-full sm:w-auto">
            Cancel
          </Button>
          <Button onClick={submit} className="w-full sm:w-auto">
            Save Secret
          </Button>
        </div>
      </div>
    </Modal>
  );
};


// ============================
// CARD
// ============================
const VaultCard = ({ item, onDelete, onCopy }) => {
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="flex flex-col gap-3 p-4 transition bg-white border rounded-xl hover:shadow-md">

      {/* Header */}
      <div className="flex justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Icons name="shield" size={14} />
            <h3 className="text-sm font-semibold">{item.name}</h3>
          </div>
          <TypeBadge type={item.type} />
        </div>

        <DotMenu
          onDelete={onDelete}
          extra={[{ label: "Copy", action: onCopy }]}
        />
      </div>

      <p className="text-xs text-gray-500">{item.description}</p>

      {/* Secret */}
      <div className="flex items-center justify-between px-3 py-2 bg-gray-100 rounded">
        <span className={`font-mono text-xs ${revealed ? "text-gray-800" : "text-gray-400 tracking-widest"}`}>
          {revealed ? item.secretValue || "sk-****" : "••••••••••"}
        </span>

        <button onClick={() => setRevealed(!revealed)}>
          <Icons name={revealed ? "eyeOff" : "eye"} size={14} />
        </button>
      </div>

      {/* Footer */}
      <div className="flex justify-between text-xs text-gray-400">
        <span>Last: {item.lastAccessed}</span>
        <span>Created: {item.createdOn}</span>
      </div>
    </div>
  );
};


// ============================
// MAIN PAGE
// ============================
const VaultPage = () => {
  const [data, setData] = useState(vaultData);
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
        `${i.name} ${i.type}`.toLowerCase().includes(q)
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
          <h1 className="text-xl font-bold sm:text-2xl">Vault</h1>
          <p className="text-sm text-gray-500">
            Manage secrets and credentials securely.
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
              placeholder="Search secrets..."
            />
          </div>

          <Button onClick={() => setShowModal(true)} className="w-full sm:w-auto">
            Add Secret
          </Button>
        </div>
      </div>

      {/* FILTER */}
      <div className="flex flex-wrap gap-2">
        {["All", "API Key", "Password", "Token", "Certificate"].map((t) => (
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
        <EmptyState title="No secrets found" />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {paginated.map((item) => (
            <VaultCard
              key={item.id}
              item={item}
              onDelete={() =>
                setData((prev) => prev.filter((d) => d.id !== item.id))
              }
              onCopy={() => navigator.clipboard.writeText(item.name)}
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
        <CreateSecretModal
          onClose={() => setShowModal(false)}
          onCreate={(item) =>
            setData((prev) => [
              {
                ...item,
                id: Date.now(),
                lastAccessed: new Date().toLocaleDateString("en-GB"),
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

export default VaultPage;