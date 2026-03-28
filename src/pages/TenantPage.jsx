import { useState } from "react";
import { tenantData } from "../data/sidebarData";
import { Modal } from "../components/common/CardGridPage";
import FormField from "../components/common/FormField";
import TextInput from "../components/common/TextInput";
import SelectInput from "../components/common/SelectInput";
import Button from "../components/common/Button";
import Icons from "../components/common/Icons";


// ============================
// SECTION CARD
// ============================
const SectionCard = ({ title, icon, children }) => (
  <div className="overflow-hidden bg-white border rounded-xl">
    <div className="flex items-center gap-2 px-5 py-3 border-b bg-gray-50">
      <Icons name={icon} size={14} />
      <span className="text-sm font-semibold">{title}</span>
    </div>
    <div className="p-5">{children}</div>
  </div>
);


// ============================
// INFO ROW
// ============================
const InfoRow = ({ label, value, mono }) => (
  <div className="flex justify-between py-2 border-b last:border-none">
    <span className="text-sm text-gray-500">{label}</span>
    <span className={`text-sm font-medium ${mono ? "font-mono" : ""}`}>
      {value}
    </span>
  </div>
);


// ============================
// PLAN BADGE
// ============================
const planStyles = {
  Free: "bg-gray-100 text-gray-600",
  Pro: "bg-blue-100 text-blue-600",
  Enterprise: "bg-purple-100 text-purple-600",
};

const PlanBadge = ({ plan }) => (
  <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${planStyles[plan]}`}>
    {plan}
  </span>
);


// ============================
// MEMBER ROW
// ============================
const MemberRow = ({ name, role, email, onRemove }) => (
  <div className="flex items-center justify-between py-2 border-b last:border-none">
    <div className="flex items-center gap-3">
      <div className="flex items-center justify-center text-xs font-bold text-white bg-blue-600 rounded-md w-9 h-9">
        {name.charAt(0)}
      </div>
      <div>
        <p className="text-sm font-medium">{name}</p>
        <p className="text-xs text-gray-400">{email}</p>
      </div>
    </div>

    <div className="flex items-center gap-2">
      <span className={`px-2 py-0.5 text-xs rounded-full ${
        role === "Admin"
          ? "bg-blue-100 text-blue-600"
          : "bg-gray-100 text-gray-500"
      }`}>
        {role}
      </span>

      {onRemove && (
        <button onClick={onRemove} className="text-red-500">
          <Icons name="trash" size={14} />
        </button>
      )}
    </div>
  </div>
);


// ============================
// INVITE MODAL
// ============================
const InviteModal = ({ onClose, onInvite }) => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Member");

  const submit = () => {
    if (!email.trim()) return;
    onInvite({ email, role });
    onClose();
  };

  return (
    <Modal title="Invite Member" onClose={onClose}>
      <div className="flex flex-col gap-4">

        <FormField label="Email">
          <TextInput value={email} onChange={setEmail} />
        </FormField>

        <FormField label="Role">
          <SelectInput
            value={role}
            onChange={setRole}
            options={[
              { value: "Admin", label: "Admin" },
              { value: "Member", label: "Member" },
              { value: "Viewer", label: "Viewer" },
            ]}
          />
        </FormField>

        <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={submit}>Invite</Button>
        </div>
      </div>
    </Modal>
  );
};


// ============================
// MAIN PAGE
// ============================
const TenantPage = () => {
  const [tenant, setTenant] = useState(tenantData);
  const [members, setMembers] = useState([
    { id: 1, name: "Girish Kumar", role: "Admin", email: "girish@workspace.io" },
    { id: 2, name: "Arjun Patel", role: "Member", email: "arjun@workspace.io" },
  ]);

  const [showInvite, setShowInvite] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState(tenant.name);

  const seatPct = Math.round((tenant.usedSeats / tenant.seats) * 100);

  return (
    <div className="flex flex-col w-full gap-6">

      {/* HEADER */}
      <div>
        <h1 className="text-xl font-bold sm:text-2xl">Tenant</h1>
        <p className="text-sm text-gray-500">
          Manage workspace settings and members.
        </p>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">

        {/* Workspace Info */}
        <SectionCard title="Workspace Info" icon="tenant">
          <div className="flex items-center justify-between mb-3">
            {editing ? (
              <div className="flex w-full gap-2">
                <TextInput value={editName} onChange={setEditName} />
                <Button onClick={() => { setTenant({ ...tenant, name: editName }); setEditing(false); }}>Save</Button>
              </div>
            ) : (
              <>
                <h2 className="font-semibold">{tenant.name}</h2>
                <Button size="sm" variant="ghost" onClick={() => setEditing(true)}>
                  Edit
                </Button>
              </>
            )}
          </div>

          <InfoRow label="Plan" value={<PlanBadge plan={tenant.plan} />} />
          <InfoRow label="Region" value={tenant.region} mono />
          <InfoRow label="Created" value={tenant.createdOn} />
        </SectionCard>

        {/* Seat Usage */}
        <SectionCard title="Seat Usage" icon="users">
          <div className="flex justify-between mb-2 text-sm">
            <span>{tenant.usedSeats}/{tenant.seats}</span>
            <span className={seatPct > 80 ? "text-red-500" : "text-blue-600"}>
              {seatPct}%
            </span>
          </div>

          <div className="h-2 overflow-hidden bg-gray-100 rounded">
            <div
              className={`h-full transition-all ${
                seatPct > 80 ? "bg-red-500" : "bg-blue-500"
              }`}
              style={{ width: `${seatPct}%` }}
            />
          </div>
<br/>
          <Button className="w-full mt-4">Upgrade Plan</Button>
        </SectionCard>

        {/* Members */}
        <div className="lg:col-span-2">
          <SectionCard title="Team Members" icon="users">
            <div className="flex justify-between mb-3">
              <span className="text-sm text-gray-500">
                {members.length} members
              </span>
              <Button size="sm" onClick={() => setShowInvite(true)}>
                Invite
              </Button>
            </div>

            {members.map((m) => (
              <MemberRow
                key={m.id}
                {...m}
                onRemove={() =>
                  setMembers(prev => prev.filter(p => p.id !== m.id))
                }
              />
            ))}
          </SectionCard>
        </div>

        {/* Danger Zone */}
        <div className="lg:col-span-2">
          <div className="overflow-hidden border border-red-200 rounded-xl">
            <div className="px-5 py-3 font-semibold text-red-600 border-b">
              Danger Zone
            </div>
            <div className="flex items-center justify-between p-5">
              <div>
                <p className="font-medium">Delete Workspace</p>
                <p className="text-sm text-gray-400">
                  This action cannot be undone.
                </p>
              </div>
              <Button variant="danger">Delete</Button>
            </div>
          </div>
        </div>

      </div>

      {/* MODAL */}
      {showInvite && (
        <InviteModal
          onClose={() => setShowInvite(false)}
          onInvite={(data) =>
            setMembers(prev => [...prev, { id: Date.now(), ...data }])
          }
        />
      )}
    </div>
  );
};

export default TenantPage;