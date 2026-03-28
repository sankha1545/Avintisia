import { useState, useMemo } from "react";
import { queuesData } from "../data/sidebarData";
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
// STAT CHIP
// ============================
const StatChip = ({ label, value, color }) => (
  <div className="flex flex-col items-center flex-1 p-2 rounded-lg bg-gray-50">
    <span className={`text-lg font-bold`} style={{ color }}>
      {value}
    </span>
    <span className="text-[11px] text-gray-400">{label}</span>
  </div>
);


// ============================
// CREATE MODAL
// ============================
const CreateQueueModal = ({ onClose, onCreate }) => {
  const [name, setName] = useState("");
  const [description, setDesc] = useState("");
  const [type, setType] = useState("FIFO");
  const [concurrency, setConcurrency] = useState("4");
  const [errors, setErrors] = useState({});

  const submit = () => {
    const e = {};
    if (!name.trim()) e.name = "Required";

    setErrors(e);
    if (Object.keys(e).length) return;

    onCreate({
      name,
      description,
      type,
      concurrency: Number(concurrency),
    });

    onClose();
  };

  return (
    <Modal title="Create Queue" onClose={onClose}>
      <div className="flex flex-col gap-4">

        <FormField label="Queue Name" error={errors.name}>
          <TextInput value={name} onChange={setName} />
        </FormField>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <FormField label="Queue Type">
            <SelectInput
              value={type}
              onChange={setType}
              options={[
                { value: "FIFO", label: "FIFO" },
                { value: "LIFO", label: "LIFO" },
                { value: "Priority", label: "Priority" },
              ]}
            />
          </FormField>

          <FormField label="Concurrency">
            <SelectInput
              value={concurrency}
              onChange={setConcurrency}
              options={[
                { value: "1", label: "1 worker" },
                { value: "2", label: "2 workers" },
                { value: "4", label: "4 workers" },
                { value: "8", label: "8 workers" },
              ]}
            />
          </FormField>
        </div>

        <FormField label="Description">
          <TextArea value={description} onChange={setDesc} />
        </FormField>

        <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
          <Button variant="ghost" onClick={onClose} className="w-full sm:w-auto">
            Cancel
          </Button>
          <Button onClick={submit} className="w-full sm:w-auto">
            Create Queue
          </Button>
        </div>
      </div>
    </Modal>
  );
};


// ============================
// CARD
// ============================
const QueueCard = ({ item, onDelete, onEdit, onPurge }) => {
  const total = item.pending + item.processed + item.failed;
  const pct = total ? Math.round((item.processed / total) * 100) : 0;

  return (
    <div className="flex flex-col gap-3 p-4 transition bg-white border rounded-xl hover:shadow-md">

      {/* Header */}
      <div className="flex justify-between">
        <div>
          <h3 className="text-sm font-semibold">{item.name}</h3>
          <p className="text-xs text-gray-400">
            {item.type} · {item.concurrency} worker{item.concurrency > 1 && "s"}
          </p>
        </div>

        <DotMenu
          onEdit={onEdit}
          onDelete={onDelete}
          extra={[{ label: "Purge Queue", action: onPurge }]}
        />
      </div>

      <p className="text-xs text-gray-500">{item.description}</p>

      {/* Stats */}
      <div className="flex gap-2">
        <StatChip label="Pending" value={item.pending} color="#f59e0b" />
        <StatChip label="Processed" value={item.processed} color="#10b981" />
        <StatChip label="Failed" value={item.failed} color="#ef4444" />
      </div>

      {/* Progress */}
      <div>
        <div className="flex justify-between mb-1 text-xs text-gray-400">
          <span>Success rate</span>
          <span className="font-semibold text-green-600">{pct}%</span>
        </div>
        <div className="h-1.5 bg-gray-100 rounded overflow-hidden">
          <div
            className="h-full bg-green-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <p className="text-xs text-gray-400">
        Created On: {item.createdOn}
      </p>
    </div>
  );
};


// ============================
// MAIN PAGE
// ============================
const QueuesPage = () => {
  const [data, setData] = useState(queuesData);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState(9);

  const handleCreate = (item) => {
    setData((prev) => [
      {
        ...item,
        id: Date.now(),
        pending: 0,
        processed: 0,
        failed: 0,
        createdOn: new Date().toLocaleDateString("en-GB"),
      },
      ...prev,
    ]);
  };

  const handleDelete = (id) =>
    setData((prev) => prev.filter((d) => d.id !== id));

  const handlePurge = (id) =>
    setData((prev) =>
      prev.map((d) => (d.id === id ? { ...d, pending: 0 } : d))
    );

  const filtered = useMemo(() => {
    if (!search.trim()) return data;
    const q = search.toLowerCase();
    return data.filter((i) =>
      `${i.name} ${i.type}`.toLowerCase().includes(q)
    );
  }, [data, search]);

  const paginated = filtered.slice((page - 1) * rows, page * rows);

  const totalPending = data.reduce((s, d) => s + d.pending, 0);
  const totalProcessed = data.reduce((s, d) => s + d.processed, 0);
  const totalFailed = data.reduce((s, d) => s + d.failed, 0);

  return (
    <div className="flex flex-col w-full h-full gap-4">

      {/* HEADER */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold sm:text-2xl">Queues</h1>
          <p className="text-sm text-gray-500">
            Manage job queues and monitor throughput.
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
              placeholder="Search queues..."
            />
          </div>

          <Button onClick={() => setShowModal(true)} className="w-full sm:w-auto">
            Create Queue
          </Button>
        </div>
      </div>

      {/* SUMMARY */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Queues", val: data.length, color: "text-blue-600", icon: "queues" },
          { label: "Pending", val: totalPending, color: "text-yellow-500", icon: "activity" },
          { label: "Processed", val: totalProcessed, color: "text-green-500", icon: "check" },
          { label: "Failed", val: totalFailed, color: "text-red-500", icon: "x" },
        ].map((s) => (
          <div key={s.label} className="flex items-center gap-3 p-4 bg-white border rounded-xl">
            <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-lg">
              <Icons name={s.icon} size={16} />
            </div>
            <div>
              <p className={`text-lg font-bold ${s.color}`}>{s.val}</p>
              <p className="text-xs text-gray-400">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* GRID */}
      {paginated.length === 0 ? (
        <EmptyState title="No queues found" />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {paginated.map((item) => (
            <QueueCard
              key={item.id}
              item={item}
              onEdit={() => alert(item.name)}
              onDelete={() => handleDelete(item.id)}
              onPurge={() => handlePurge(item.id)}
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
        <CreateQueueModal
          onClose={() => setShowModal(false)}
          onCreate={handleCreate}
        />
      )}
    </div>
  );
};

export default QueuesPage;