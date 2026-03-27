// src/pages/IntegrationsPage.jsx
import { useState, useMemo } from "react";
import { integrationsData } from "../data/sidebarData";
import { Modal, EmptyState } from "../components/common/CardGridPage";
import FormField from "../components/common/FormField";
import TextInput from "../components/common/TextInput";
import TextArea from "../components/common/TextArea";
import SelectInput from "../components/common/SelectInput";
import Button from "../components/common/Button";
import SearchInput from "../components/common/SearchInput";
import Icons from "../components/common/Icons";

const EXTRA_INTEGRATIONS = [
  { id: 7,  name: "Twilio",     category: "SMS",         status: "disconnected", icon: "📱", description: "Send SMS and voice notifications via Twilio.",        connectedOn: null },
  { id: 8,  name: "HubSpot",    category: "CRM",         status: "disconnected", icon: "🧡", description: "Sync contacts and manage CRM workflows.",             connectedOn: null },
  { id: 9,  name: "Notion",     category: "Productivity",status: "connected",    icon: "📝", description: "Read and write pages in your Notion workspace.",      connectedOn: "22/06/2025" },
  { id: 10, name: "PostgreSQL", category: "Database",    status: "connected",    icon: "🐘", description: "Query and update your PostgreSQL databases.",         connectedOn: "25/06/2025" },
  { id: 11, name: "Webhook",    category: "Custom",      status: "connected",    icon: "🔗", description: "Send HTTP webhooks to any external endpoint.",        connectedOn: "28/06/2025" },
  { id: 12, name: "Zapier",     category: "Automation",  status: "disconnected", icon: "⚡", description: "Connect to 5000+ apps via Zapier workflows.",         connectedOn: null },
];

const allIntegrations = [...integrationsData, ...EXTRA_INTEGRATIONS];

const ConfigModal = ({ integration, onClose, onSave }) => {
  const [apiKey, setApiKey] = useState("");
  const [webhook, setWebhook] = useState("");

  const save = () => {
    if (!apiKey.trim() && !webhook.trim()) return;
    onSave(integration.id);
    onClose();
  };

  return (
    <Modal title={`Configure ${integration.name}`} onClose={onClose} width={480}>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", background: "#f9fafb", borderRadius: 8 }}>
          <span style={{ fontSize: 28 }}>{integration.icon}</span>
          <div>
            <div style={{ fontWeight: 600, fontSize: 15, color: "#1a1d2e" }}>{integration.name}</div>
            <div style={{ fontSize: 12.5, color: "#9ca3af" }}>{integration.category}</div>
          </div>
        </div>
        <FormField label="API Key / Token" required>
          <TextInput value={apiKey} onChange={setApiKey} placeholder="Enter your API key..." type="password" />
        </FormField>
        {["Webhook", "Slack"].includes(integration.name) && (
          <FormField label="Webhook URL">
            <TextInput value={webhook} onChange={setWebhook} placeholder="https://..." />
          </FormField>
        )}
        <p style={{ fontSize: 12.5, color: "#9ca3af" }}>
          Your credentials are encrypted and stored securely in the Vault.
        </p>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={save} icon="link">Connect</Button>
        </div>
      </div>
    </Modal>
  );
};

const IntegrationCard = ({ item, onConnect, onDisconnect, onConfigure }) => {
  const connected = item.status === "connected";

  return (
    <div
      style={{
        background: "#fff", border: `1px solid ${connected ? "#d1fae5" : "#e8eaf2"}`,
        borderRadius: 10, padding: "18px 18px 16px", display: "flex", flexDirection: "column",
        gap: 10, transition: "box-shadow .2s",
      }}
      onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.08)")}
      onMouseLeave={e => (e.currentTarget.style.boxShadow = "none")}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 44, height: 44, borderRadius: 10, background: "#f9fafb", border: "1px solid #e5e7eb", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>
            {item.icon}
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: 14.5, color: "#1a1d2e" }}>{item.name}</div>
            <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 2 }}>{item.category}</div>
          </div>
        </div>
        <span style={{
          fontSize: 11.5, fontWeight: 600, padding: "2px 9px", borderRadius: 20,
          background: connected ? "#d1fae5" : "#f3f4f6",
          color: connected ? "#059669" : "#9ca3af",
        }}>
          {connected ? "● Connected" : "○ Not connected"}
        </span>
      </div>

      <p style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.55 }}>{item.description}</p>

      {connected && item.connectedOn && (
        <div style={{ fontSize: 12, color: "#9ca3af" }}>
          <span style={{ fontWeight: 500, color: "#d1d5db" }}>Connected On: </span>{item.connectedOn}
        </div>
      )}

      <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
        {connected ? (
          <>
            <Button variant="ghost" size="sm" icon="settings" onClick={() => onConfigure(item)}>Configure</Button>
            <Button variant="danger" size="sm" onClick={() => onDisconnect(item.id)}>Disconnect</Button>
          </>
        ) : (
          <Button variant="primary" size="sm" icon="link" onClick={() => onConfigure(item)} style={{ width: "100%", justifyContent: "center" }}>
            Connect
          </Button>
        )}
      </div>
    </div>
  );
};

const CATEGORIES = ["All", "Communication", "DevOps", "Payments", "Email", "Storage", "Database", "CRM", "Productivity", "SMS", "Automation", "Custom", "Project Mgmt"];

const IntegrationsPage = () => {
  const [data, setData]           = useState(allIntegrations);
  const [configTarget, setConfigTarget] = useState(null);
  const [search, setSearch]       = useState("");
  const [catFilter, setCatFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const handleConnect    = id => setData(prev => prev.map(d => d.id === id ? { ...d, status: "connected", connectedOn: new Date().toLocaleDateString("en-GB") } : d));
  const handleDisconnect = id => setData(prev => prev.map(d => d.id === id ? { ...d, status: "disconnected", connectedOn: null } : d));

  const filtered = useMemo(() => {
    let d = data;
    if (catFilter !== "All")    d = d.filter(i => i.category === catFilter);
    if (statusFilter === "Connected")    d = d.filter(i => i.status === "connected");
    if (statusFilter === "Not Connected") d = d.filter(i => i.status === "disconnected");
    if (search.trim()) { const q = search.toLowerCase(); d = d.filter(i => `${i.name} ${i.category} ${i.description}`.toLowerCase().includes(q)); }
    return d;
  }, [data, search, catFilter, statusFilter]);

  const connectedCount = data.filter(d => d.status === "connected").length;

  const usedCategories = ["All", ...Array.from(new Set(data.map(d => d.category)))];

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "28px 32px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#1a1d2e" }}>Integrations</h1>
          <p style={{ fontSize: 13.5, color: "#6b7280", marginTop: 4 }}>Connect your workspace to external tools and services.</p>
        </div>
        <SearchInput value={search} onChange={v => setSearch(v)} placeholder="Search integrations..." />
      </div>

      {/* Stats */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        {[
          { label: "Total Available", val: data.length,                color: "#4f6ef7", icon: "integrations" },
          { label: "Connected",       val: connectedCount,             color: "#10b981", icon: "check" },
          { label: "Not Connected",   val: data.length - connectedCount, color: "#9ca3af", icon: "x" },
        ].map(s => (
          <div key={s.label} style={{ flex: 1, background: "#fff", border: "1px solid #e8eaf2", borderRadius: 10, padding: "14px 16px", display: "flex", alignItems: "center", gap: 12 }}>
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

      {/* Filters */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ display: "flex", gap: 6 }}>
          {["All", "Connected", "Not Connected"].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)} style={{
              padding: "5px 14px", borderRadius: 20, fontSize: 13, fontWeight: 500, border: "1px solid", cursor: "pointer",
              background: statusFilter === s ? "#4f6ef7" : "#fff",
              color: statusFilter === s ? "#fff" : "#6b7280",
              borderColor: statusFilter === s ? "#4f6ef7" : "#e5e7eb",
            }}>{s}</button>
          ))}
        </div>
        <div style={{ height: 22, width: 1, background: "#e5e7eb" }} />
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {usedCategories.map(c => (
            <button key={c} onClick={() => setCatFilter(c)} style={{
              padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 500, border: "1px solid", cursor: "pointer",
              background: catFilter === c ? "#1b1f2e" : "#fff",
              color: catFilter === c ? "#fff" : "#9ca3af",
              borderColor: catFilter === c ? "#1b1f2e" : "#e5e7eb",
            }}>{c}</button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? <EmptyState title="No integrations found" subtitle="Try a different search or filter" /> : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
          {filtered.map(item => (
            <IntegrationCard
              key={item.id} item={item}
              onConnect={handleConnect}
              onDisconnect={handleDisconnect}
              onConfigure={setConfigTarget}
            />
          ))}
        </div>
      )}

      {configTarget && (
        <ConfigModal
          integration={configTarget}
          onClose={() => setConfigTarget(null)}
          onSave={handleConnect}
        />
      )}
    </div>
  );
};

export default IntegrationsPage;