// src/pages/PublishedPage.jsx
import { useState, useMemo } from "react";
import { publishedData } from "../data/sidebarData";
import { Modal, DotMenu, EmptyState, StatusBadge } from "../components/common/CardGridPage";
import FormField from "../components/common/FormField";
import TextInput from "../components/common/TextInput";
import TextArea from "../components/common/TextArea";
import SelectInput from "../components/common/SelectInput";
import Button from "../components/common/Button";
import Pagination from "../components/common/Pagination";
import SearchInput from "../components/common/SearchInput";
import Icons from "../components/common/Icons";

const CreatePipelineModal = ({ onClose, onCreate }) => {
  const [name, setName]               = useState("");
  const [description, setDescription] = useState("");
  const [version, setVersion]         = useState("v1.0");
  const [env, setEnv]                 = useState("Production");
  const [errors, setErrors]           = useState({});

  const submit = () => {
    const e = {};
    if (!name.trim())        e.name        = "Name is required";
    if (!description.trim()) e.description = "Description is required";
    setErrors(e);
    if (Object.keys(e).length) return;
    onCreate({ name: name.trim(), description: description.trim(), version, env });
    onClose();
  };

  return (
    <Modal title="Publish Pipeline" onClose={onClose} width={520}>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <FormField label="Pipeline Name" required error={errors.name}>
          <TextInput value={name} onChange={setName} placeholder="e.g. Customer Onboarding Pipeline" />
        </FormField>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <FormField label="Version">
            <TextInput value={version} onChange={setVersion} placeholder="v1.0" />
          </FormField>
          <FormField label="Environment">
            <SelectInput value={env} onChange={setEnv} options={[
              { value: "Production", label: "Production" },
              { value: "Staging",    label: "Staging" },
              { value: "Dev",        label: "Dev" },
            ]} />
          </FormField>
        </div>
        <FormField label="Description" required error={errors.description}>
          <TextArea value={description} onChange={setDescription} placeholder="Describe this pipeline..." rows={3} />
        </FormField>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 8 }}>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={submit}>Publish</Button>
        </div>
      </div>
    </Modal>
  );
};

const PipelineCard = ({ item, onDelete, onEdit, onView, onToggle }) => (
  <div
    style={{
      background: "#fff", border: "1px solid #e8eaf2", borderRadius: 10,
      padding: "18px 18px 16px", display: "flex", flexDirection: "column",
      gap: 8, transition: "box-shadow .2s",
    }}
    onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.08)")}
    onMouseLeave={e => (e.currentTarget.style.boxShadow = "none")}
  >
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
      <span style={{ fontWeight: 600, fontSize: 14.5, color: "#1a1d2e" }}>{item.name}</span>
      <DotMenu
        onView={onView} onEdit={onEdit} onDelete={onDelete}
        extra={[{ label: item.status === "live" ? "Unpublish" : "Go Live", icon: item.status === "live" ? "eyeOff" : "check", action: onToggle }]}
      />
    </div>
    <p style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.55, flex: 1 }}>{item.description}</p>

    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
      <StatusBadge status={item.status} />
      <span style={{ fontSize: 11.5, background: "#f3f4f6", color: "#6b7280", padding: "2px 8px", borderRadius: 20, fontWeight: 500 }}>
        {item.version}
      </span>
      {item.env && (
        <span style={{ fontSize: 11.5, background: item.env === "Production" ? "#fff7ed" : "#f0fdf4", color: item.env === "Production" ? "#f97316" : "#10b981", padding: "2px 8px", borderRadius: 20, fontWeight: 500 }}>
          {item.env}
        </span>
      )}
    </div>

    <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 4 }}>
      <span style={{ fontWeight: 500, color: "#d1d5db" }}>Created On: </span>{item.createdOn}
    </div>
  </div>
);

const PublishedPage = () => {
  const [data, setData]           = useState(publishedData.map((d, i) => ({ ...d, env: i % 2 === 0 ? "Production" : "Staging" })));
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch]       = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage]           = useState(1);
  const [rows, setRows]           = useState(9);

  const handleCreate  = item => setData(prev => [{ ...item, id: Date.now(), status: "draft", createdOn: new Date().toLocaleDateString("en-GB") }, ...prev]);
  const handleDelete  = id   => setData(prev => prev.filter(d => d.id !== id));
  const handleToggle  = id   => setData(prev => prev.map(d => d.id === id ? { ...d, status: d.status === "live" ? "draft" : "live" } : d));

  const filtered = useMemo(() => {
    let d = data;
    if (statusFilter !== "All") d = d.filter(i => i.status === statusFilter.toLowerCase());
    if (search.trim()) { const q = search.toLowerCase(); d = d.filter(i => `${i.name} ${i.description} ${i.version}`.toLowerCase().includes(q)); }
    return d;
  }, [data, search, statusFilter]);

  const paginated = filtered.slice((page - 1) * rows, page * rows);

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "28px 32px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#1a1d2e" }}>Published</h1>
          <p style={{ fontSize: 13.5, color: "#6b7280", marginTop: 4 }}>Manage your published pipelines and workflows.</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <SearchInput value={search} onChange={v => { setSearch(v); setPage(1); }} placeholder="Search pipelines..." />
          <Button variant="primary" icon="plus" onClick={() => setShowModal(true)}>Publish New</Button>
        </div>
      </div>

      {/* Status filter */}
      <div style={{ display: "flex", gap: 6, marginBottom: 20 }}>
        {["All", "Live", "Draft"].map(s => (
          <button key={s} onClick={() => { setStatusFilter(s); setPage(1); }} style={{
            padding: "5px 14px", borderRadius: 20, fontSize: 13, fontWeight: 500,
            border: "1px solid", cursor: "pointer", transition: "all .15s",
            background: statusFilter === s ? "#4f6ef7" : "#fff",
            color: statusFilter === s ? "#fff" : "#6b7280",
            borderColor: statusFilter === s ? "#4f6ef7" : "#e5e7eb",
          }}>{s}</button>
        ))}

        {/* Stats */}
        <div style={{ marginLeft: "auto", display: "flex", gap: 16 }}>
          {[
            { label: "Total", val: data.length, color: "#4f6ef7" },
            { label: "Live",  val: data.filter(d => d.status === "live").length,  color: "#10b981" },
            { label: "Draft", val: data.filter(d => d.status === "draft").length, color: "#9ca3af" },
          ].map(s => (
            <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#6b7280" }}>
              <span style={{ fontWeight: 700, color: s.color, fontSize: 16 }}>{s.val}</span> {s.label}
            </div>
          ))}
        </div>
      </div>

      {paginated.length === 0 ? <EmptyState title="No pipelines found" /> : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
          {paginated.map(item => (
            <PipelineCard
              key={item.id} item={item}
              onView={() => alert(`View: ${item.name}`)}
              onEdit={() => alert(`Edit: ${item.name}`)}
              onDelete={() => handleDelete(item.id)}
              onToggle={() => handleToggle(item.id)}
            />
          ))}
        </div>
      )}

      <Pagination total={filtered.length} page={page} rowsPerPage={rows} onPage={setPage} onRowsChange={n => { setRows(n); setPage(1); }} />

      {showModal && <CreatePipelineModal onClose={() => setShowModal(false)} onCreate={handleCreate} />}
    </div>
  );
};

export default PublishedPage;