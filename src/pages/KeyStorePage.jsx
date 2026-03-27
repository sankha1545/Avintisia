// src/pages/KeyStorePage.jsx
import { useState, useMemo } from "react";
import { keyStoreData } from "../data/sidebarData";
import { Modal, DotMenu, EmptyState, StatusBadge } from "../components/common/CardGridPage";
import FormField from "../components/common/FormField";
import TextInput from "../components/common/TextInput";
import TextArea from "../components/common/TextArea";
import SelectInput from "../components/common/SelectInput";
import Button from "../components/common/Button";
import Pagination from "../components/common/Pagination";
import SearchInput from "../components/common/SearchInput";
import Icons from "../components/common/Icons";

const providerColors = {
  OpenAI:    "#10a37f", Anthropic: "#c96442", Stripe: "#635bff",
  AWS:       "#f59e0b", GitHub:    "#1a1d2e", SendGrid: "#1A82E2",
  Custom:    "#6b7280",
};

const ProviderDot = ({ provider }) => (
  <span style={{
    display: "inline-flex", alignItems: "center", gap: 5,
    fontSize: 12, fontWeight: 600, color: providerColors[provider] || "#6b7280",
  }}>
    <span style={{ width: 8, height: 8, borderRadius: "50%", background: providerColors[provider] || "#9ca3af", display: "inline-block" }} />
    {provider}
  </span>
);

const CreateKeyModal = ({ onClose, onCreate }) => {
  const [name, setName]       = useState("");
  const [provider, setProvider] = useState("OpenAI");
  const [apiKey, setApiKey]   = useState("");
  const [desc, setDesc]       = useState("");
  const [show, setShow]       = useState(false);
  const [errors, setErrors]   = useState({});

  const submit = () => {
    const e = {};
    if (!name.trim())   e.name   = "Name is required";
    if (!apiKey.trim()) e.apiKey = "API Key is required";
    setErrors(e);
    if (Object.keys(e).length) return;
    onCreate({ name: name.trim(), provider, apiKey: apiKey.trim(), description: desc.trim() });
    onClose();
  };

  return (
    <Modal title="Add API Key" onClose={onClose} width={500}>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <FormField label="Key Name" required error={errors.name}>
          <TextInput value={name} onChange={setName} placeholder="e.g. key_openai_production" />
        </FormField>
        <FormField label="Provider">
          <SelectInput value={provider} onChange={setProvider} options={[
            { value: "OpenAI",    label: "OpenAI" },
            { value: "Anthropic", label: "Anthropic" },
            { value: "Stripe",    label: "Stripe" },
            { value: "AWS",       label: "AWS" },
            { value: "GitHub",    label: "GitHub" },
            { value: "SendGrid",  label: "SendGrid" },
            { value: "Custom",    label: "Custom" },
          ]} />
        </FormField>
        <FormField label="API Key" required error={errors.apiKey}>
          <div style={{ position: "relative" }}>
            <TextInput value={apiKey} onChange={setApiKey} placeholder="sk-..." type={show ? "text" : "password"} />
            <button onClick={() => setShow(s => !s)} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer" }}>
              <Icons name={show ? "eyeOff" : "eye"} size={15} color="#9ca3af" />
            </button>
          </div>
        </FormField>
        <FormField label="Description">
          <TextArea value={desc} onChange={setDesc} placeholder="What is this key used for?" rows={2} />
        </FormField>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 8 }}>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={submit}>Save Key</Button>
        </div>
      </div>
    </Modal>
  );
};

const KeyCard = ({ item, onDelete, onRotate }) => {
  const [revealed, setRevealed] = useState(false);
  const maskedKey = `${item.provider.toLowerCase().substring(0, 2)}-••••••••••••••••••••••••••`;

  return (
    <div
      style={{ background: "#fff", border: "1px solid #e8eaf2", borderRadius: 10, padding: "18px 18px 16px", display: "flex", flexDirection: "column", gap: 10, transition: "box-shadow .2s" }}
      onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.08)")}
      onMouseLeave={e => (e.currentTarget.style.boxShadow = "none")}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <Icons name="key" size={14} color="#4f6ef7" />
            <span style={{ fontWeight: 600, fontSize: 14.5, color: "#1a1d2e" }}>{item.name}</span>
          </div>
          <ProviderDot provider={item.provider} />
        </div>
        <DotMenu onDelete={onDelete}
          extra={[
            { label: "Copy Key", icon: "copy",    action: () => alert(`Copied key reference`) },
            { label: "Rotate",   icon: "refresh", action: onRotate },
          ]}
        />
      </div>

      <p style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.5 }}>{item.description}</p>

      {/* Key preview */}
      <div style={{ background: "#f3f4f6", borderRadius: 8, padding: "8px 12px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
        <span style={{ fontFamily: "monospace", fontSize: 12, color: "#6b7280", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>
          {revealed ? (item.apiKey || "sk-placeholder-example-key-123456789") : maskedKey}
        </span>
        <button onClick={() => setRevealed(r => !r)} style={{ background: "none", border: "none", cursor: "pointer", flexShrink: 0 }}>
          <Icons name={revealed ? "eyeOff" : "eye"} size={14} color="#6b7280" />
        </button>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <StatusBadge status={item.status} />
        <span style={{ fontSize: 12, color: "#9ca3af" }}>
          <span style={{ fontWeight: 500, color: "#d1d5db" }}>Created: </span>{item.createdOn}
        </span>
      </div>
    </div>
  );
};

const KeyStorePage = () => {
  const [data, setData]           = useState(keyStoreData.map(k => ({ ...k, apiKey: null })));
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch]       = useState("");
  const [providerFilter, setProviderFilter] = useState("All");
  const [page, setPage]           = useState(1);
  const [rows, setRows]           = useState(9);

  const handleCreate = item => setData(prev => [{ ...item, id: Date.now(), status: "active", createdOn: new Date().toLocaleDateString("en-GB") }, ...prev]);
  const handleDelete = id   => setData(prev => prev.filter(d => d.id !== id));
  const handleRotate = id   => { alert("Key rotation initiated. The old key will expire in 24h."); };

  const providers = ["All", ...Array.from(new Set(data.map(d => d.provider)))];

  const filtered = useMemo(() => {
    let d = data;
    if (providerFilter !== "All") d = d.filter(i => i.provider === providerFilter);
    if (search.trim()) { const q = search.toLowerCase(); d = d.filter(i => `${i.name} ${i.provider}`.toLowerCase().includes(q)); }
    return d;
  }, [data, search, providerFilter]);

  const paginated = filtered.slice((page - 1) * rows, page * rows);

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "28px 32px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#1a1d2e" }}>Key Store</h1>
          <p style={{ fontSize: 13.5, color: "#6b7280", marginTop: 4 }}>Manage third-party API keys and provider credentials.</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <SearchInput value={search} onChange={v => { setSearch(v); setPage(1); }} placeholder="Search keys..." />
          <Button variant="primary" icon="plus" onClick={() => setShowModal(true)}>Add Key</Button>
        </div>
      </div>

      {/* Provider filter */}
      <div style={{ display: "flex", gap: 6, marginBottom: 20, flexWrap: "wrap" }}>
        {providers.map(p => (
          <button key={p} onClick={() => { setProviderFilter(p); setPage(1); }} style={{
            padding: "5px 14px", borderRadius: 20, fontSize: 13, fontWeight: 500, border: "1px solid", cursor: "pointer",
            background: providerFilter === p ? "#4f6ef7" : "#fff",
            color: providerFilter === p ? "#fff" : "#6b7280",
            borderColor: providerFilter === p ? "#4f6ef7" : "#e5e7eb",
          }}>{p}</button>
        ))}
        <div style={{ marginLeft: "auto", display: "flex", gap: 16 }}>
          {[
            { label: "Active",  color: "#10b981", status: "active"  },
            { label: "Expired", color: "#ef4444", status: "expired" },
          ].map(s => (
            <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "#6b7280" }}>
              <span style={{ fontWeight: 700, color: s.color, fontSize: 15 }}>{data.filter(d => d.status === s.status).length}</span> {s.label}
            </div>
          ))}
        </div>
      </div>

      {paginated.length === 0 ? <EmptyState title="No keys found" subtitle="Add your first API key" /> : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
          {paginated.map(item => (
            <KeyCard key={item.id} item={item}
              onDelete={() => handleDelete(item.id)}
              onRotate={() => handleRotate(item.id)}
            />
          ))}
        </div>
      )}

      <Pagination total={filtered.length} page={page} rowsPerPage={rows} onPage={setPage} onRowsChange={n => { setRows(n); setPage(1); }} />
      {showModal && <CreateKeyModal onClose={() => setShowModal(false)} onCreate={handleCreate} />}
    </div>
  );
};

export default KeyStorePage;