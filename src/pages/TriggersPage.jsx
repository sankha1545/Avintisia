// src/pages/TriggersPage.jsx
import { useState, useMemo } from "react";
import { triggersData } from "../data/sidebarData";
import { Modal, DotMenu, EmptyState, StatusBadge } from "../components/common/CardGridPage";
import FormField from "../components/common/FormField";
import TextInput from "../components/common/TextInput";
import TextArea from "../components/common/TextArea";
import SelectInput from "../components/common/SelectInput";
import Button from "../components/common/Button";
import Pagination from "../components/common/Pagination";
import SearchInput from "../components/common/SearchInput";
import Icons from "../components/common/Icons";

const typeIcons = { Schedule: "calendar", Webhook: "link", Event: "activity" };
const typeColors = { Schedule: "#4f6ef7", Webhook: "#8b5cf6", Event: "#f97316" };

const TypeBadge = ({ type }) => (
  <span style={{
    display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11.5, fontWeight: 600,
    padding: "2px 9px", borderRadius: 20,
    background: (typeColors[type] || "#9ca3af") + "18",
    color: typeColors[type] || "#9ca3af",
  }}>
    <Icons name={typeIcons[type] || "activity"} size={11} color={typeColors[type] || "#9ca3af"} />
    {type}
  </span>
);

const Toggle = ({ enabled, onToggle }) => (
  <div
    onClick={onToggle}
    style={{
      width: 40, height: 22, borderRadius: 11, cursor: "pointer", transition: "background .2s",
      background: enabled ? "#4f6ef7" : "#d1d5db", position: "relative", flexShrink: 0,
    }}
  >
    <div style={{
      position: "absolute", top: 3, left: enabled ? 21 : 3, width: 16, height: 16,
      borderRadius: "50%", background: "#fff", transition: "left .2s",
      boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
    }} />
  </div>
);

const CreateTriggerModal = ({ onClose, onCreate }) => {
  const [name, setName]         = useState("");
  const [type, setType]         = useState("Schedule");
  const [description, setDesc]  = useState("");
  const [cron, setCron]         = useState("0 * * * *");
  const [url, setUrl]           = useState("");
  const [event, setEvent]       = useState("agent.completed");
  const [errors, setErrors]     = useState({});

  const submit = () => {
    const e = {};
    if (!name.trim()) e.name = "Name is required";
    setErrors(e);
    if (Object.keys(e).length) return;
    onCreate({ name: name.trim(), type, description: description.trim(), cron, url, event });
    onClose();
  };

  return (
    <Modal title="Create Trigger" onClose={onClose} width={540}>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <FormField label="Trigger Name" required error={errors.name}>
          <TextInput value={name} onChange={setName} placeholder="e.g. Daily Report Trigger" />
        </FormField>
        <FormField label="Trigger Type">
          <SelectInput value={type} onChange={setType} options={[
            { value: "Schedule", label: "⏰ Schedule (Cron)" },
            { value: "Webhook",  label: "🔗 Webhook (HTTP)" },
            { value: "Event",    label: "⚡ Event (System)" },
          ]} />
        </FormField>
        {type === "Schedule" && (
          <FormField label="Cron Expression">
            <TextInput value={cron} onChange={setCron} placeholder="e.g. 0 9 * * 1-5" />
            <div style={{ fontSize: 11.5, color: "#9ca3af", marginTop: 4 }}>
              {cron === "0 * * * *" ? "Every hour" : cron === "0 9 * * 1-5" ? "Weekdays at 9am" : "Custom schedule"}
            </div>
          </FormField>
        )}
        {type === "Webhook" && (
          <FormField label="Endpoint URL">
            <TextInput value={url} onChange={setUrl} placeholder="https://your-domain.com/webhook" />
          </FormField>
        )}
        {type === "Event" && (
          <FormField label="Event Type">
            <SelectInput value={event} onChange={setEvent} options={[
              { value: "agent.completed",  label: "agent.completed" },
              { value: "agent.failed",     label: "agent.failed" },
              { value: "job.queued",       label: "job.queued" },
              { value: "execution.started",label: "execution.started" },
            ]} />
          </FormField>
        )}
        <FormField label="Description">
          <TextArea value={description} onChange={setDesc} placeholder="What does this trigger do?" rows={2} />
        </FormField>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 8 }}>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={submit}>Create Trigger</Button>
        </div>
      </div>
    </Modal>
  );
};

const TriggerCard = ({ item, onDelete, onEdit, onToggle, onFire }) => (
  <div
    style={{ background: "#fff", border: "1px solid #e8eaf2", borderRadius: 10, padding: "18px 18px 16px", display: "flex", flexDirection: "column", gap: 8, transition: "box-shadow .2s" }}
    onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.08)")}
    onMouseLeave={e => (e.currentTarget.style.boxShadow = "none")}
  >
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
        <span style={{ fontWeight: 600, fontSize: 14.5, color: "#1a1d2e" }}>{item.name}</span>
        <TypeBadge type={item.type} />
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <Toggle enabled={item.status === "enabled"} onToggle={onToggle} />
        <DotMenu onEdit={onEdit} onDelete={onDelete}
          extra={[{ label: "Fire Now", icon: "triggers", action: onFire }]}
        />
      </div>
    </div>

    <p style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.5 }}>{item.description}</p>

    {/* Cron/URL display */}
    {item.cron && (
      <div style={{ fontSize: 12, background: "#f3f4f6", borderRadius: 6, padding: "5px 9px", color: "#6b7280", fontFamily: "monospace" }}>
        {item.cron}
      </div>
    )}

    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div style={{ fontSize: 12, color: "#9ca3af" }}>
        <span style={{ fontWeight: 500, color: "#d1d5db" }}>Last Run: </span>{item.lastRun}
      </div>
      <span style={{ fontSize: 11.5, color: item.status === "enabled" ? "#10b981" : "#9ca3af", fontWeight: 500 }}>
        {item.status === "enabled" ? "● Active" : "○ Disabled"}
      </span>
    </div>
    <div style={{ fontSize: 12, color: "#9ca3af" }}>
      <span style={{ fontWeight: 500, color: "#d1d5db" }}>Created On: </span>{item.createdOn}
    </div>
  </div>
);

const TriggersPage = () => {
  const [data, setData]           = useState(triggersData.map((t, i) => ({ ...t, cron: i % 3 === 0 ? "0 9 * * 1-5" : null })));
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch]       = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [page, setPage]           = useState(1);
  const [rows, setRows]           = useState(9);

  const handleCreate = item  => setData(prev => [{ ...item, id: Date.now(), status: "enabled", lastRun: "Never", createdOn: new Date().toLocaleDateString("en-GB") }, ...prev]);
  const handleDelete = id    => setData(prev => prev.filter(d => d.id !== id));
  const handleToggle = id    => setData(prev => prev.map(d => d.id === id ? { ...d, status: d.status === "enabled" ? "disabled" : "enabled" } : d));
  const handleFire   = (id, name) => { alert(`🔥 Trigger "${name}" fired manually!`); };

  const filtered = useMemo(() => {
    let d = data;
    if (typeFilter !== "All") d = d.filter(i => i.type === typeFilter);
    if (search.trim()) { const q = search.toLowerCase(); d = d.filter(i => `${i.name} ${i.type} ${i.description}`.toLowerCase().includes(q)); }
    return d;
  }, [data, search, typeFilter]);

  const paginated = filtered.slice((page - 1) * rows, page * rows);

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "28px 32px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#1a1d2e" }}>Triggers</h1>
          <p style={{ fontSize: 13.5, color: "#6b7280", marginTop: 4 }}>Configure schedules, webhooks, and event-based triggers.</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <SearchInput value={search} onChange={v => { setSearch(v); setPage(1); }} placeholder="Search triggers..." />
          <Button variant="primary" icon="plus" onClick={() => setShowModal(true)}>Create Trigger</Button>
        </div>
      </div>

      <div style={{ display: "flex", gap: 6, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
        {["All", "Schedule", "Webhook", "Event"].map(t => (
          <button key={t} onClick={() => { setTypeFilter(t); setPage(1); }} style={{
            padding: "5px 14px", borderRadius: 20, fontSize: 13, fontWeight: 500, border: "1px solid", cursor: "pointer",
            background: typeFilter === t ? "#4f6ef7" : "#fff",
            color: typeFilter === t ? "#fff" : "#6b7280",
            borderColor: typeFilter === t ? "#4f6ef7" : "#e5e7eb",
          }}>{t}</button>
        ))}
        <div style={{ marginLeft: "auto", display: "flex", gap: 16 }}>
          {[
            { label: "Enabled",  val: data.filter(d => d.status === "enabled").length,  color: "#10b981" },
            { label: "Disabled", val: data.filter(d => d.status === "disabled").length, color: "#9ca3af" },
          ].map(s => (
            <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#6b7280" }}>
              <span style={{ fontWeight: 700, color: s.color, fontSize: 16 }}>{s.val}</span> {s.label}
            </div>
          ))}
        </div>
      </div>

      {paginated.length === 0 ? <EmptyState title="No triggers found" /> : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
          {paginated.map(item => (
            <TriggerCard key={item.id} item={item}
              onEdit={() => alert(`Edit: ${item.name}`)}
              onDelete={() => handleDelete(item.id)}
              onToggle={() => handleToggle(item.id)}
              onFire={() => handleFire(item.id, item.name)}
            />
          ))}
        </div>
      )}

      <Pagination total={filtered.length} page={page} rowsPerPage={rows} onPage={setPage} onRowsChange={n => { setRows(n); setPage(1); }} />
      {showModal && <CreateTriggerModal onClose={() => setShowModal(false)} onCreate={handleCreate} />}
    </div>
  );
};

export default TriggersPage;