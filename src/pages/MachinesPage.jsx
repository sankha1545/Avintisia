// src/pages/MachinesPage.jsx
import { useState, useMemo, useEffect } from "react";
import { machinesData } from "../data/sidebarData";
import { Modal, DotMenu, EmptyState, StatusBadge } from "../components/common/CardGridPage";
import FormField from "../components/common/FormField";
import TextInput from "../components/common/TextInput";
import TextArea from "../components/common/TextArea";
import SelectInput from "../components/common/SelectInput";
import Button from "../components/common/Button";
import Pagination from "../components/common/Pagination";
import SearchInput from "../components/common/SearchInput";
import Icons from "../components/common/Icons";

// Seeded static values to avoid hydration mismatch
const SEED_CPU    = [42, 68, 25, 55, 71, 38];
const SEED_MEM    = ["3 GB", "5 GB", "2 GB", "4 GB", "6 GB", "3 GB"];

const staticMachines = machinesData.map((m, i) => ({
  ...m,
  cpu:    SEED_CPU[i] + "%",
  memory: SEED_MEM[i],
  os:     i % 2 === 0 ? "Ubuntu 22.04" : "CentOS 8",
  region: ["us-east-1", "eu-west-1", "ap-south-1", "us-west-2", "eu-central-1", "ap-southeast-1"][i],
}));

const MetricBar = ({ value, color }) => {
  const pct = parseInt(value) || 0;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ flex: 1, background: "#f3f4f6", borderRadius: 4, height: 5, overflow: "hidden" }}>
        <div style={{
          height: "100%", width: `${pct}%`,
          background: pct > 80 ? "#ef4444" : pct > 60 ? "#f59e0b" : color,
          borderRadius: 4, transition: "width .5s ease",
        }} />
      </div>
      <span style={{ fontSize: 11.5, color: "#6b7280", minWidth: 32, textAlign: "right" }}>{value}</span>
    </div>
  );
};

const CreateMachineModal = ({ onClose, onCreate }) => {
  const [name, setName]       = useState("");
  const [os, setOs]           = useState("Ubuntu 22.04");
  const [region, setRegion]   = useState("us-east-1");
  const [desc, setDesc]       = useState("");
  const [errors, setErrors]   = useState({});

  const submit = () => {
    const e = {};
    if (!name.trim()) e.name = "Name is required";
    setErrors(e);
    if (Object.keys(e).length) return;
    onCreate({ name: name.trim(), os, region, description: desc.trim() });
    onClose();
  };

  return (
    <Modal title="Add Machine" onClose={onClose} width={520}>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <FormField label="Machine Name" required error={errors.name}>
          <TextInput value={name} onChange={setName} placeholder="e.g. Machine-007" />
        </FormField>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <FormField label="Operating System">
            <SelectInput value={os} onChange={setOs} options={[
              { value: "Ubuntu 22.04", label: "Ubuntu 22.04" },
              { value: "Ubuntu 20.04", label: "Ubuntu 20.04" },
              { value: "CentOS 8",     label: "CentOS 8" },
              { value: "Debian 11",    label: "Debian 11" },
              { value: "Windows Server 2022", label: "Windows Server 2022" },
            ]} />
          </FormField>
          <FormField label="Region">
            <SelectInput value={region} onChange={setRegion} options={[
              { value: "us-east-1",      label: "us-east-1" },
              { value: "us-west-2",      label: "us-west-2" },
              { value: "eu-west-1",      label: "eu-west-1" },
              { value: "eu-central-1",   label: "eu-central-1" },
              { value: "ap-south-1",     label: "ap-south-1" },
              { value: "ap-southeast-1", label: "ap-southeast-1" },
            ]} />
          </FormField>
        </div>
        <FormField label="Description">
          <TextArea value={desc} onChange={setDesc} placeholder="Optional description..." rows={2} />
        </FormField>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 8 }}>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={submit}>Add Machine</Button>
        </div>
      </div>
    </Modal>
  );
};

const MachineCard = ({ item, onDelete, onEdit, onStart, onStop }) => (
  <div
    style={{
      background: "#fff", border: "1px solid #e8eaf2", borderRadius: 10,
      padding: "18px 18px 16px", display: "flex", flexDirection: "column",
      gap: 10, transition: "box-shadow .2s",
    }}
    onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.08)")}
    onMouseLeave={e => (e.currentTarget.style.boxShadow = "none")}
  >
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
      <div>
        <div style={{ fontWeight: 600, fontSize: 14.5, color: "#1a1d2e" }}>{item.name}</div>
        <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 2 }}>{item.region} · {item.os}</div>
      </div>
      <DotMenu
        onEdit={onEdit} onDelete={onDelete}
        extra={[
          item.status !== "running" && { label: "Start",   icon: "check",   action: onStart },
          item.status === "running" && { label: "Stop",    icon: "x",       action: onStop  },
          { label: "Restart", icon: "refresh", action: () => alert(`Restart: ${item.name}`) },
        ].filter(Boolean)}
      />
    </div>

    <p style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.5 }}>{item.description}</p>

    {/* Metrics */}
    <div style={{ display: "flex", flexDirection: "column", gap: 6, background: "#f9fafb", borderRadius: 8, padding: "10px 12px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
        <Icons name="cpu" size={13} color="#6b7280" />
        <span style={{ fontSize: 12, fontWeight: 500, color: "#6b7280" }}>CPU Usage</span>
      </div>
      <MetricBar value={item.cpu} color="#4f6ef7" />
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
        <Icons name="activity" size={13} color="#6b7280" />
        <span style={{ fontSize: 12, fontWeight: 500, color: "#6b7280" }}>Memory</span>
      </div>
      <div style={{ fontSize: 12, color: "#374151", fontWeight: 500 }}>{item.memory}</div>
    </div>

    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <StatusBadge status={item.status} />
      <span style={{ fontSize: 12, color: "#9ca3af" }}>
        <span style={{ fontWeight: 500, color: "#d1d5db" }}>Created On: </span>{item.createdOn}
      </span>
    </div>
  </div>
);

const MachinesPage = () => {
  const [data, setData]           = useState(staticMachines);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch]       = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage]           = useState(1);
  const [rows, setRows]           = useState(9);

  const handleCreate  = item => setData(prev => [{ ...item, id: Date.now(), status: "pending", cpu: "0%", memory: "0 GB", createdOn: new Date().toLocaleDateString("en-GB") }, ...prev]);
  const handleDelete  = id   => setData(prev => prev.filter(d => d.id !== id));
  const handleStart   = id   => setData(prev => prev.map(d => d.id === id ? { ...d, status: "running" } : d));
  const handleStop    = id   => setData(prev => prev.map(d => d.id === id ? { ...d, status: "stopped" } : d));

  const filtered = useMemo(() => {
    let d = data;
    if (statusFilter !== "All") d = d.filter(i => i.status === statusFilter.toLowerCase());
    if (search.trim()) { const q = search.toLowerCase(); d = d.filter(i => `${i.name} ${i.region} ${i.os}`.toLowerCase().includes(q)); }
    return d;
  }, [data, search, statusFilter]);

  const paginated = filtered.slice((page - 1) * rows, page * rows);

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "28px 32px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#1a1d2e" }}>Machines</h1>
          <p style={{ fontSize: 13.5, color: "#6b7280", marginTop: 4 }}>Monitor and manage your compute machines.</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <SearchInput value={search} onChange={v => { setSearch(v); setPage(1); }} placeholder="Search machines..." />
          <Button variant="primary" icon="plus" onClick={() => setShowModal(true)}>Add Machine</Button>
        </div>
      </div>

      {/* Filters + Stats */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 20, flexWrap: "wrap" }}>
        {["All", "Running", "Stopped", "Pending"].map(s => (
          <button key={s} onClick={() => { setStatusFilter(s); setPage(1); }} style={{
            padding: "5px 14px", borderRadius: 20, fontSize: 13, fontWeight: 500, border: "1px solid",
            cursor: "pointer", transition: "all .15s",
            background: statusFilter === s ? "#4f6ef7" : "#fff",
            color: statusFilter === s ? "#fff" : "#6b7280",
            borderColor: statusFilter === s ? "#4f6ef7" : "#e5e7eb",
          }}>{s}</button>
        ))}
        <div style={{ marginLeft: "auto", display: "flex", gap: 16 }}>
          {[
            { label: "Running", val: data.filter(d => d.status === "running").length,  color: "#10b981" },
            { label: "Stopped", val: data.filter(d => d.status === "stopped").length,  color: "#6b7280" },
            { label: "Pending", val: data.filter(d => d.status === "pending").length,  color: "#f59e0b" },
          ].map(s => (
            <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#6b7280" }}>
              <span style={{ fontWeight: 700, color: s.color, fontSize: 16 }}>{s.val}</span> {s.label}
            </div>
          ))}
        </div>
      </div>

      {paginated.length === 0 ? <EmptyState title="No machines found" /> : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
          {paginated.map(item => (
            <MachineCard key={item.id} item={item}
              onEdit={() => alert(`Edit: ${item.name}`)}
              onDelete={() => handleDelete(item.id)}
              onStart={() => handleStart(item.id)}
              onStop={() => handleStop(item.id)}
            />
          ))}
        </div>
      )}

      <Pagination total={filtered.length} page={page} rowsPerPage={rows} onPage={setPage} onRowsChange={n => { setRows(n); setPage(1); }} />
      {showModal && <CreateMachineModal onClose={() => setShowModal(false)} onCreate={handleCreate} />}
    </div>
  );
};

export default MachinesPage;