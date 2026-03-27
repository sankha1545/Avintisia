// src/pages/TenantPage.jsx
import { useState } from "react";
import { tenantData } from "../data/sidebarData";
import { Modal } from "../components/common/CardGridPage";
import FormField from "../components/common/FormField";
import TextInput from "../components/common/TextInput";
import SelectInput from "../components/common/SelectInput";
import Button from "../components/common/Button";
import Icons from "../components/common/Icons";

const SectionCard = ({ title, icon, children }) => (
  <div style={{ background: "#fff", border: "1px solid #e8eaf2", borderRadius: 10, overflow: "hidden" }}>
    <div style={{ padding: "14px 20px", borderBottom: "1px solid #f3f4f6", display: "flex", alignItems: "center", gap: 8 }}>
      <Icons name={icon} size={15} color="#4f6ef7" />
      <span style={{ fontWeight: 600, fontSize: 14, color: "#1a1d2e" }}>{title}</span>
    </div>
    <div style={{ padding: "18px 20px" }}>{children}</div>
  </div>
);

const InfoRow = ({ label, value, mono = false }) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #f9fafb" }}>
    <span style={{ fontSize: 13.5, color: "#6b7280" }}>{label}</span>
    <span style={{ fontSize: 13.5, fontWeight: 500, color: "#1a1d2e", fontFamily: mono ? "monospace" : "inherit" }}>{value}</span>
  </div>
);

const PlanBadge = ({ plan }) => {
  const colors = { Free: "#6b7280", Pro: "#4f6ef7", Enterprise: "#8b5cf6" };
  return (
    <span style={{
      background: (colors[plan] || "#6b7280") + "18", color: colors[plan] || "#6b7280",
      fontSize: 12, fontWeight: 700, padding: "3px 10px", borderRadius: 20,
    }}>{plan}</span>
  );
};

const MemberRow = ({ name, role, email, onRemove }) => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #f9fafb" }}>
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{ width: 34, height: 34, borderRadius: 8, background: "#4f6ef7", color: "#fff", fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {name.charAt(0)}
      </div>
      <div>
        <div style={{ fontSize: 13.5, fontWeight: 500, color: "#1a1d2e" }}>{name}</div>
        <div style={{ fontSize: 12, color: "#9ca3af" }}>{email}</div>
      </div>
    </div>
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <span style={{ fontSize: 12, background: role === "Admin" ? "#eff6ff" : "#f3f4f6", color: role === "Admin" ? "#3b82f6" : "#6b7280", padding: "2px 8px", borderRadius: 20, fontWeight: 500 }}>{role}</span>
      {onRemove && <button onClick={onRemove} style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444" }}><Icons name="trash" size={13} color="#ef4444" /></button>}
    </div>
  </div>
);

const InviteModal = ({ onClose, onInvite }) => {
  const [email, setEmail] = useState("");
  const [role, setRole]   = useState("Member");
  const submit = () => {
    if (!email.trim()) return;
    onInvite({ email: email.trim(), role });
    onClose();
  };
  return (
    <Modal title="Invite Member" onClose={onClose} width={440}>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <FormField label="Email Address" required>
          <TextInput value={email} onChange={setEmail} placeholder="user@example.com" type="email" />
        </FormField>
        <FormField label="Role">
          <SelectInput value={role} onChange={setRole} options={[
            { value: "Admin",  label: "Admin" },
            { value: "Member", label: "Member" },
            { value: "Viewer", label: "Viewer" },
          ]} />
        </FormField>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 8 }}>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={submit}>Send Invite</Button>
        </div>
      </div>
    </Modal>
  );
};

const TenantPage = () => {
  const [tenant, setTenant] = useState(tenantData);
  const [members, setMembers] = useState([
    { id: 1, name: "Girish Kumar", role: "Admin",  email: "girish@workspace.io" },
    { id: 2, name: "Arjun Patel",  role: "Member", email: "arjun@workspace.io" },
    { id: 3, name: "Neha Sharma",  role: "Member", email: "neha@workspace.io" },
    { id: 4, name: "Dev Roy",      role: "Viewer", email: "dev@workspace.io" },
  ]);
  const [showInvite, setShowInvite] = useState(false);
  const [editing, setEditing]       = useState(false);
  const [editName, setEditName]     = useState(tenant.name);

  const handleInvite = ({ email, role }) => {
    const name = email.split("@")[0].replace(/\./g, " ").replace(/\b\w/g, c => c.toUpperCase());
    setMembers(prev => [...prev, { id: Date.now(), name, role, email }]);
  };

  const seatPct = Math.round((tenant.usedSeats / tenant.seats) * 100);

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "28px 32px" }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#1a1d2e" }}>Tenant</h1>
        <p style={{ fontSize: 13.5, color: "#6b7280", marginTop: 4 }}>Manage your workspace settings, billing, and team members.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>

        {/* Workspace Info */}
        <SectionCard title="Workspace Info" icon="tenant">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            {editing ? (
              <div style={{ display: "flex", gap: 8, flex: 1 }}>
                <TextInput value={editName} onChange={setEditName} placeholder="Workspace name" />
                <Button variant="primary" size="sm" onClick={() => { setTenant(t => ({ ...t, name: editName })); setEditing(false); }}>Save</Button>
                <Button variant="ghost" size="sm" onClick={() => setEditing(false)}>Cancel</Button>
              </div>
            ) : (
              <>
                <span style={{ fontSize: 16, fontWeight: 700, color: "#1a1d2e" }}>{tenant.name}</span>
                <Button variant="ghost" size="sm" icon="edit" onClick={() => setEditing(true)}>Edit</Button>
              </>
            )}
          </div>
          <InfoRow label="Plan"       value={<PlanBadge plan={tenant.plan} />} />
          <InfoRow label="Region"     value={tenant.region} mono />
          <InfoRow label="Created On" value={tenant.createdOn} />
          <InfoRow label="Billing"    value={tenant.billing} />
          <InfoRow label="Next Bill"  value={tenant.nextBilling} />
        </SectionCard>

        {/* Seat usage */}
        <SectionCard title="Seat Usage" icon="users">
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
            <span style={{ fontSize: 13, color: "#6b7280" }}>{tenant.usedSeats} of {tenant.seats} seats used</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: seatPct > 80 ? "#ef4444" : "#4f6ef7" }}>{seatPct}%</span>
          </div>
          <div style={{ background: "#f3f4f6", borderRadius: 8, height: 8, overflow: "hidden", marginBottom: 20 }}>
            <div style={{ height: "100%", width: `${seatPct}%`, background: seatPct > 80 ? "#ef4444" : "#4f6ef7", borderRadius: 8, transition: "width .6s ease" }} />
          </div>

          {/* Plan perks */}
          {[
            { label: "Agents",     limit: "Unlimited" },
            { label: "Executions", limit: "50,000 / mo" },
            { label: "Storage",    limit: "100 GB" },
            { label: "API calls",  limit: "1M / mo" },
          ].map(p => (
            <div key={p.label} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #f9fafb", fontSize: 13 }}>
              <span style={{ color: "#6b7280" }}>{p.label}</span>
              <span style={{ fontWeight: 600, color: "#10b981" }}>{p.limit}</span>
            </div>
          ))}

          <Button variant="primary" style={{ width: "100%", marginTop: 16, justifyContent: "center" }}>Upgrade Plan</Button>
        </SectionCard>

        {/* Team Members */}
        <div style={{ gridColumn: "1 / -1" }}>
          <SectionCard title="Team Members" icon="users">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <span style={{ fontSize: 13, color: "#6b7280" }}>{members.length} member{members.length !== 1 ? "s" : ""}</span>
              <Button variant="primary" size="sm" icon="plus" onClick={() => setShowInvite(true)}>Invite Member</Button>
            </div>
            {members.map(m => (
              <MemberRow
                key={m.id} {...m}
                onRemove={m.role !== "Admin" ? () => setMembers(prev => prev.filter(p => p.id !== m.id)) : null}
              />
            ))}
          </SectionCard>
        </div>

        {/* Danger Zone */}
        <div style={{ gridColumn: "1 / -1" }}>
          <div style={{ background: "#fff", border: "1px solid #fecaca", borderRadius: 10, overflow: "hidden" }}>
            <div style={{ padding: "14px 20px", borderBottom: "1px solid #fecaca", display: "flex", alignItems: "center", gap: 8 }}>
              <Icons name="shield" size={15} color="#ef4444" />
              <span style={{ fontWeight: 600, fontSize: 14, color: "#ef4444" }}>Danger Zone</span>
            </div>
            <div style={{ padding: "18px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontWeight: 500, fontSize: 14, color: "#1a1d2e" }}>Delete Workspace</div>
                <div style={{ fontSize: 13, color: "#9ca3af", marginTop: 2 }}>Permanently delete this workspace and all of its data.</div>
              </div>
              <Button variant="danger" onClick={() => { if (window.confirm("Are you sure? This cannot be undone.")) alert("Workspace deletion requested."); }}>
                Delete Workspace
              </Button>
            </div>
          </div>
        </div>
      </div>

      {showInvite && <InviteModal onClose={() => setShowInvite(false)} onInvite={handleInvite} />}
    </div>
  );
};

export default TenantPage;