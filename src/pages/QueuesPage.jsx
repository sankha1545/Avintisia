// src/pages/QueuesPage.jsx
import { useState, useMemo } from "react";
import { queuesData } from "../data/sidebarData";
import { Modal, DotMenu, EmptyState } from "../components/common/CardGridPage";
import FormField from "../components/common/FormField";
import TextInput from "../components/common/TextInput";
import TextArea from "../components/common/TextArea";
import SelectInput from "../components/common/SelectInput";
import Button from "../components/common/Button";
import Pagination from "../components/common/Pagination";
import SearchInput from "../components/common/SearchInput";
import Icons from "../components/common/Icons";

const SEED = [
  { pending: 12, processed: 348, failed: 3 },
  { pending: 5,  processed: 210, failed: 1 },
  { pending: 27, processed: 89,  failed: 7 },
  { pending: 0,  processed: 500, failed: 0 },
  { pending: 41, processed: 67,  failed: 12 },
  { pending: 8,  processed: 430, failed: 2 },
];

const staticQueues = queuesData.map((q, i) => ({ ...q, ...SEED[i], concurrency: [1, 2, 4, 8][i % 4], type: ["FIFO", "LIFO", "Priority"][i % 3] }));

const StatChip = ({ label, value, color }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1, padding: "8px 4px", background: "#f9fafb", borderRadius: 8 }}>
    <span style={{ fontSize: 18, fontWeight: 700, color }}>{value}</span>
    <span style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>{label}</span>
  </div>
);

const CreateQueueModal = ({ onClose, onCreate }) => {
  const [name, setName]         = useState("");
  const [description, setDesc]  = useState("");
  const [type, setType]         = useState("FIFO");
  const [concurrency, setConcurrency] = useState("4");
  const [errors, setErrors]     = useState({});

  const submit = () => {
    const e = {};
    if (!name.trim()) e.name = "Name is required";
    setErrors(e);
    if (Object.keys(e).length) return;
    onCreate({ name: name.trim(), description: description.trim(), type, concurrency: Number(concurrency) });
    onClose();
  };

  return (
    <Modal title="Create Queue" onClose={onClose} width={500}>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <FormField label="Queue Name" required error={errors.name}>
          <TextInput value={name} onChange={setName} placeholder="e.g. email-processing-queue" />
        </FormField>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <FormField label="Queue Type">
            <SelectInput value={type} onChange={setType} options={[
              { value: "FIFO",     label: "FIFO (First In)" },
              { value: "LIFO",     label: "LIFO (Last In)" },
              { value: "Priority", label: "Priority" },
            ]} />
          </FormField>
          <FormField label="Concurrency">
            <SelectInput value={concurrency} onChange={setConcurrency} options={[
              { value: "1", label: "1 worker" },
              { value: "2", label: "2 workers" },
              { value: "4", label: "4 workers" },
              { value: "8", label: "8 workers" },
            ]} />
          </FormField>
        </div>
        <FormField label="Description">
          <TextArea value={description} onChange={setDesc} placeholder="What does this queue process?" rows={2} />
        </FormField>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 8 }}>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={submit}>Create Queue</Button>
        </div>
      </div>
    </Modal>
  );
};

const QueueCard = ({ item, onDelete, onEdit, onPurge }) => (
  <div
    style={{ background: "#fff", border: "1px solid #e8eaf2", borderRadius: 10, padding: "18px 18px 16px", display: "flex", flexDirection: "column", gap: 10, transition: "box-shadow .2s" }}
    onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.08)")}
    onMouseLeave={e => (e.currentTarget.style.boxShadow = "none")}
  >
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
      <div>
        <div style={{ fontWeight: 600, fontSize: 14.5, color: "#1a1d2e" }}>{item.name}</div>
        <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 2 }}>{item.type} · {item.concurrency} worker{item.concurrency > 1 ? "s" : ""}</div>
      </div>
      <DotMenu onEdit={onEdit} onDelete={onDelete}
        extra={[{ label: "Purge Queue", icon: "trash", action: onPurge }]}
      />
    </div>

    <p style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.5 }}>{item.description}</p>

    {/* Stats row */}
    <div style={{ display: "flex", gap: 6 }}>
      <StatChip label="Pending"   value={item.pending}   color="#f59e0b" />
      <StatChip label="Processed" value={item.processed} color="#10b981" />
      <StatChip label="Failed"    value={item.failed}    color="#ef4444" />
    </div>

    {/* Progress bar: processed / (processed + pending + failed) */}
    {(() => {
      const total = item.pending + item.processed + item.failed;
      const pct   = total ? Math.round((item.processed / total) * 100) : 0;
      return (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11.5, color: "#9ca3af", marginBottom: 4 }}>
            <span>Success rate</span><span style={{ fontWeight: 600, color: "#10b981" }}>{pct}%</span>
          </div>
          <div style={{ background: "#f3f4f6", borderRadius: 4, height: 5, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${pct}%`, background: "#10b981", borderRadius: 4 }} />
          </div>
        </div>
      );
    })()}

    <div style={{ fontSize: 12, color: "#9ca3af" }}>
      <span style={{ fontWeight: 500, color: "#d1d5db" }}>Created On: </span>{item.createdOn}
    </div>
  </div>
);

const QueuesPage = () => {
  const [data, setData]           = useState(staticQueues);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch]       = useState("");
  const [page, setPage]           = useState(1);
  const [rows, setRows]           = useState(9);

  const handleCreate = item => setData(prev => [{ ...item, id: Date.now(), pending: 0, processed: 0, failed: 0, createdOn: new Date().toLocaleDateString("en-GB") }, ...prev]);
  const handleDelete = id   => setData(prev => prev.filter(d => d.id !== id));
  const handlePurge  = id   => setData(prev => prev.map(d => d.id === id ? { ...d, pending: 0 } : d));

  const filtered = useMemo(() => {
    if (!search.trim()) return data;
    const q = search.toLowerCase();
    return data.filter(i => `${i.name} ${i.type}`.toLowerCase().includes(q));
  }, [data, search]);

  const paginated = filtered.slice((page - 1) * rows, page * rows);

  const totalPending   = data.reduce((s, d) => s + d.pending, 0);
  const totalProcessed = data.reduce((s, d) => s + d.processed, 0);
  const totalFailed    = data.reduce((s, d) => s + d.failed, 0);

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "28px 32px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#1a1d2e" }}>Queues</h1>
          <p style={{ fontSize: 13.5, color: "#6b7280", marginTop: 4 }}>Manage job queues and monitor message throughput.</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <SearchInput value={search} onChange={v => { setSearch(v); setPage(1); }} placeholder="Search queues..." />
          <Button variant="primary" icon="plus" onClick={() => setShowModal(true)}>Create Queue</Button>
        </div>
      </div>

      {/* Summary bar */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        {[
          { label: "Total Queues",    val: data.length,      color: "#4f6ef7", icon: "queues" },
          { label: "Total Pending",   val: totalPending,     color: "#f59e0b", icon: "activity" },
          { label: "Total Processed", val: totalProcessed,   color: "#10b981", icon: "check" },
          { label: "Total Failed",    val: totalFailed,      color: "#ef4444", icon: "x" },
        ].map(s => (
          <div key={s.label} style={{
            flex: 1, background: "#fff", border: "1px solid #e8eaf2", borderRadius: 10,
            padding: "14px 16px", display: "flex", alignItems: "center", gap: 12,
          }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: s.color + "18", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icons name={s.icon} size={18} color={s.color} />
            </div>
            <div>
              <div style={{ fontSize: 20, fontWeight: 700, color: s.color }}>{s.val}</div>
              <div style={{ fontSize: 12, color: "#9ca3af" }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {paginated.length === 0 ? <EmptyState title="No queues found" /> : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
          {paginated.map(item => (
            <QueueCard key={item.id} item={item}
              onEdit={() => alert(`Edit: ${item.name}`)}
              onDelete={() => handleDelete(item.id)}
              onPurge={() => handlePurge(item.id)}
            />
          ))}
        </div>
      )}

      <Pagination total={filtered.length} page={page} rowsPerPage={rows} onPage={setPage} onRowsChange={n => { setRows(n); setPage(1); }} />
      {showModal && <CreateQueueModal onClose={() => setShowModal(false)} onCreate={handleCreate} />}
    </div>
  );
};

export default QueuesPage;