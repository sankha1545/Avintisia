import { useState, useMemo } from "react";
import { machinesData } from "../data/sidebarData";
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
// METRIC BAR
// ============================
const MetricBar = ({ value }) => {
  const pct = parseInt(value) || 0;

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-gray-100 rounded overflow-hidden">
        <div
          className={`h-full transition-all ${
            pct > 80
              ? "bg-red-500"
              : pct > 60
              ? "bg-yellow-500"
              : "bg-blue-500"
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="w-8 text-xs text-right text-gray-500">
        {value}
      </span>
    </div>
  );
};


// ============================
// CREATE MODAL
// ============================
const CreateMachineModal = ({ onClose, onCreate }) => {
  const [name, setName] = useState("");
  const [os, setOs] = useState("Ubuntu 22.04");
  const [region, setRegion] = useState("us-east-1");
  const [desc, setDesc] = useState("");
  const [errors, setErrors] = useState({});

  const submit = () => {
    const e = {};
    if (!name.trim()) e.name = "Required";

    setErrors(e);
    if (Object.keys(e).length) return;

    onCreate({ name, os, region, description: desc });
    onClose();
  };

  return (
    <Modal title="Add Machine" onClose={onClose}>
      <div className="flex flex-col gap-4">

        <FormField label="Machine Name" error={errors.name}>
          <TextInput value={name} onChange={setName} />
        </FormField>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <FormField label="Operating System">
            <SelectInput
              value={os}
              onChange={setOs}
              options={[
                { value: "Ubuntu 22.04", label: "Ubuntu 22.04" },
                { value: "CentOS 8", label: "CentOS 8" },
              ]}
            />
          </FormField>

          <FormField label="Region">
            <SelectInput
              value={region}
              onChange={setRegion}
              options={[
                { value: "us-east-1", label: "us-east-1" },
                { value: "eu-west-1", label: "eu-west-1" },
              ]}
            />
          </FormField>
        </div>

        <FormField label="Description">
          <TextArea value={desc} onChange={setDesc} />
        </FormField>

        <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
          <Button variant="ghost" onClick={onClose} className="w-full sm:w-auto">
            Cancel
          </Button>
          <Button onClick={submit} className="w-full sm:w-auto">
            Add Machine
          </Button>
        </div>
      </div>
    </Modal>
  );
};


// ============================
// CARD
// ============================
const MachineCard = ({ item, onDelete, onEdit, onStart, onStop }) => (
  <div className="flex flex-col gap-3 p-4 transition bg-white border rounded-xl hover:shadow-md">

    {/* Header */}
    <div className="flex justify-between">
      <div>
        <h3 className="text-sm font-semibold">{item.name}</h3>
        <p className="text-xs text-gray-400">
          {item.region} · {item.os}
        </p>
      </div>

      <DotMenu
        onEdit={onEdit}
        onDelete={onDelete}
        extra={[
          item.status !== "running" && { label: "Start", action: onStart },
          item.status === "running" && { label: "Stop", action: onStop },
        ].filter(Boolean)}
      />
    </div>

    <p className="text-xs text-gray-500">{item.description}</p>

    {/* Metrics */}
    <div className="p-3 space-y-2 rounded-lg bg-gray-50">
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <Icons name="cpu" size={12} />
        CPU Usage
      </div>
      <MetricBar value={item.cpu} />

      <div className="flex items-center gap-2 text-xs text-gray-500">
        <Icons name="activity" size={12} />
        Memory
      </div>
      <p className="text-xs font-medium text-gray-700">{item.memory}</p>
    </div>

    {/* Footer */}
    <div className="flex items-center justify-between text-xs text-gray-400">
      <StatusBadge status={item.status} />
      <span>{item.createdOn}</span>
    </div>
  </div>
);


// ============================
// MAIN PAGE
// ============================
const MachinesPage = () => {
  const [data, setData] = useState(machinesData);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState(9);

  const handleCreate = (item) => {
    setData((prev) => [
      {
        ...item,
        id: Date.now(),
        status: "pending",
        cpu: "0%",
        memory: "0 GB",
        createdOn: new Date().toLocaleDateString("en-GB"),
      },
      ...prev,
    ]);
  };

  const handleDelete = (id) =>
    setData((prev) => prev.filter((d) => d.id !== id));

  const filtered = useMemo(() => {
    let d = data;

    if (statusFilter !== "All") {
      d = d.filter((i) => i.status === statusFilter.toLowerCase());
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      d = d.filter((i) =>
        `${i.name} ${i.region} ${i.os}`.toLowerCase().includes(q)
      );
    }

    return d;
  }, [data, search, statusFilter]);

  const paginated = filtered.slice((page - 1) * rows, page * rows);

  return (
    <div className="flex flex-col w-full h-full gap-4">

      {/* HEADER */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold sm:text-2xl">Machines</h1>
          <p className="text-sm text-gray-500">
            Monitor and manage your compute machines.
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
              placeholder="Search machines..."
            />
          </div>

          <Button onClick={() => setShowModal(true)} className="w-full sm:w-auto">
            Add Machine
          </Button>
        </div>
      </div>

      {/* FILTER */}
      <div className="flex flex-wrap gap-2">
        {["All", "Running", "Stopped", "Pending"].map((s) => (
          <button
            key={s}
            onClick={() => {
              setStatusFilter(s);
              setPage(1);
            }}
            className={`px-3 py-1 rounded-full text-sm border ${
              statusFilter === s
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-500 border-gray-200"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* GRID */}
      {paginated.length === 0 ? (
        <EmptyState title="No machines found" />
      ) : (
        <div className="grid grid-cols-1 gap-4  sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {paginated.map((item) => (
            <MachineCard
              key={item.id}
              item={item}
              onEdit={() => alert(item.name)}
              onDelete={() => handleDelete(item.id)}
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
        <CreateMachineModal
          onClose={() => setShowModal(false)}
          onCreate={handleCreate}
        />
      )}
    </div>
  );
};

export default MachinesPage;