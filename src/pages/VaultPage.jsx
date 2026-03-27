// src/pages/VaultPage.jsx
import { useState, useMemo } from "react";
import { vaultData } from "../data/sidebarData";
import { Modal, DotMenu, EmptyState } from "../components/common/CardGridPage";
import FormField from "../components/common/FormField";
import TextInput from "../components/common/TextInput";
import TextArea from "../components/common/TextArea";
import SelectInput from "../components/common/SelectInput";
import Button from "../components/common/Button";
import Pagination from "../components/common/Pagination";
import SearchInput from "../components/common/SearchInput";
import Icons from "../components/common/Icons";

const typeColors = { "API Key": { bg: "#eff6ff", color: "#3b82f6" }, Password: { bg: "#fdf4ff", color: "#a855f7" }, Token: { bg: "#f0fdf4", color: "#10b981" }, Certificate: { bg: "#fff7ed", color: "#f97316" } };

const TypeBadge = ({ type }) => {
  const c = typeColors[type] || { bg: "#f3f4f6", color: "#6b7280" };
  return <span style={{ fontSize: 11.5, fontWeight: 600, padding: "2px 9px", borderRadius: 20, background: c.bg, color: c.color }}>{type}</span>;
};

const MASKED = "••••••••••••••••";

const CreateSecretModal = ({ onClose, onCreate }) => {
  const [name, setName]       = useState("");
  const [type, setType]       = useState("API Key");
  const [value, setValue]     = useState("");
  const [description, setDesc] = useState("");
  const [show, setShow]       = useState(false);
  const [errors, setErrors]   = useState({});

  const submit = () => {
    const e = {};
    if (!name.trim())  e.name  = "Name is required";
    if (!value.trim()) e.value = "Secret value is required";
    setErrors(e);
    if (Object.keys(e).length) return;
    onCreate({ name: name.trim(), type, secretValue: value.trim(), description: description.trim() });
    onClose();
  };

  return (
    <Modal title="Add Secret" onClose={onClose} width={500}>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <FormField label="Secret Name" required error={errors.name}>
          <TextInput value={name} onChange={setName} placeholder="e.g. OPENAI_API_KEY" />
        </FormField>
        <FormField label="Type">
          <SelectInput value={type} onChange={setType} options={[
            { value: "API Key",      label: "API Key" },
            { value: "Password",     label: "Password" },
            { value: "Token",        label: "Token" },
            { value: "Certificate",  label: "Certificate" },
          ]} />
        </FormField>
        <FormField label="Secret Value" required error={errors.value}>
          <div style={{ position: "relative" }}>
            <TextInput value={value} onChange={setValue} placeholder="Enter secret value..." type={show ? "text" : "password"} />
            <button
              onClick={() => setShow(s => !s)}
              style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#9ca3af" }}
            >
              <Icons name={show ? "eyeOff" : "eye"} size={15} color="#9ca3af" />
            </button>
          </div>
        </FormField>
        <FormField label="Description">
          <TextArea value={description} onChange={setDesc} placeholder="What is this secret used for?" rows={2} />
        </FormField>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 8 }}>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={submit}>Save Secret</Button>
        </div>
      </div>
    </Modal>
  );
};

const VaultCard = ({ item, onDelete, onCopy }) => {
  const [revealed, setRevealed] = useState(false);

  return (
    <div
      style={{ background: "#fff", border: "1px solid #e8eaf2", borderRadius: 10, padding: "18px 18px 16px", display: "flex", flexDirection: "column", gap: 10, transition: "box-shadow .2s" }}
      onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.08)")}
      onMouseLeave={e => (e.currentTarget.style.boxShadow = "none")}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          <div style={{ fontWeight: 600, fontSize: 14.5, color: "#1a1d2e", display: "flex", alignItems: "center", gap: 7 }}>
            <Icons name="shield" size={15} color="#4f6ef7" />
            {item.name}
          </div>
          <TypeBadge type={item.type} />
        </div>
        <DotMenu onDelete={onDelete}
          extra={[{ label: "Copy", icon: "copy", action: onCopy }]}
        />
      </div>

      <p style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.5 }}>{item.description}</p>

      {/* Masked secret */}
      <div style={{ background: "#f3f4f6", borderRadius: 8, padding: "8px 12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontFamily: "monospace", fontSize: 13, color: revealed ? "#1a1d2e" : "#9ca3af", letterSpacing: revealed ? 0 : 2 }}>
          {revealed ? (item.secretValue || "sk-••••••••-example-key") : MASKED}
        </span>
        <button
          onClick={() => setRevealed(r => !r)}
          style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: "#6b7280" }}
        >
          <Icons name={revealed ? "eyeOff" : "eye"} size={14} color="#6b7280" />
        </button>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#9ca3af" }}>
        <span><span style={{ fontWeight: 500, color: "#d1d5db" }}>Last Accessed: </span>{item.lastAccessed}</span>
        <span><span style={{ fontWeight: 500, color: "#d1d5db" }}>Created: </span>{item.createdOn}</span>
      </div>
    </div>
  );
};

const VaultPage = () => {
  const [data, setData]           = useState(vaultData.map(v => ({ ...v, secretValue: null })));
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch]       = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [page, setPage]           = useState(1);
  const [rows, setRows]           = useState(9);

  const handleCreate = item => setData(prev => [{ ...item, id: Date.now(), lastAccessed: new Date().toLocaleDateString("en-GB"), createdOn: new Date().toLocaleDateString("en-GB") }, ...prev]);
  const handleDelete = id   => setData(prev => prev.filter(d => d.id !== id));
  const handleCopy   = (id, name) => { navigator.clipboard?.writeText(name).catch(() => {}); alert(`Copied "${name}" reference to clipboard`); };

  const filtered = useMemo(() => {
    let d = data;
    if (typeFilter !== "All") d = d.filter(i => i.type === typeFilter);
    if (search.trim()) { const q = search.toLowerCase(); d = d.filter(i => `${i.name} ${i.type}`.toLowerCase().includes(q)); }
    return d;
  }, [data, search, typeFilter]);

  const paginated = filtered.slice((page - 1) * rows, page * rows);

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "28px 32px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#1a1d2e" }}>Vault</h1>
          <p style={{ fontSize: 13.5, color: "#6b7280", marginTop: 4 }}>Securely store and manage secrets, API keys, and credentials.</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <SearchInput value={search} onChange={v => { setSearch(v); setPage(1); }} placeholder="Search secrets..." />
          <Button variant="primary" icon="plus" onClick={() => setShowModal(true)}>Add Secret</Button>
        </div>
      </div>

      {/* Type filter */}
      <div style={{ display: "flex", gap: 6, marginBottom: 20 }}>
        {["All", "API Key", "Password", "Token", "Certificate"].map(t => (
          <button key={t} onClick={() => { setTypeFilter(t); setPage(1); }} style={{
            padding: "5px 14px", borderRadius: 20, fontSize: 13, fontWeight: 500, border: "1px solid", cursor: "pointer",
            background: typeFilter === t ? "#4f6ef7" : "#fff",
            color: typeFilter === t ? "#fff" : "#6b7280",
            borderColor: typeFilter === t ? "#4f6ef7" : "#e5e7eb",
          }}>{t}</button>
        ))}
      </div>

      {paginated.length === 0 ? <EmptyState title="No secrets found" subtitle="Add your first secret to the vault" /> : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
          {paginated.map(item => (
            <VaultCard key={item.id} item={item}
              onDelete={() => handleDelete(item.id)}
              onCopy={() => handleCopy(item.id, item.name)}
            />
          ))}
        </div>
      )}

      <Pagination total={filtered.length} page={page} rowsPerPage={rows} onPage={setPage} onRowsChange={n => { setRows(n); setPage(1); }} />
      {showModal && <CreateSecretModal onClose={() => setShowModal(false)} onCreate={handleCreate} />}
    </div>
  );
};

export default VaultPage;