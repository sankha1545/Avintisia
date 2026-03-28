// components/features/Tenant/WorkspaceSection.jsx

import { useState } from "react";
import SectionCard from "./SectionCard";
import InfoRow from "./InfoRow";
import PlanBadge from "./PlanBadge";
import TextInput from "../../common/ui/TextInput";
import Button from "../../common/ui/Button";

const WorkspaceSection = ({ tenant, setTenant }) => {
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState(tenant?.name || "");

  if (!tenant) return null;

  const handleSave = () => {
    if (!editName.trim()) return;

    setTenant({ ...tenant, name: editName.trim() });
    setEditing(false);
  };

  return (
    <SectionCard title="Workspace Info" icon="tenant">

      {/* HEADER / EDIT */}
      <div className="flex items-center justify-between mb-4">

        {editing ? (
          <div className="flex w-full gap-2">
            <TextInput
              value={editName}
              onChange={setEditName}
              placeholder="Workspace name"
            />
            <Button onClick={handleSave}>Save</Button>
          </div>
        ) : (
          <>
            <h2 className="text-sm font-semibold text-gray-900">
              {tenant.name || "—"}
            </h2>

            <Button
              size="sm"
              variant="ghost"
              onClick={() => setEditing(true)}
            >
              Edit
            </Button>
          </>
        )}

      </div>

      {/* INFO LIST */}
     <div className="flex flex-col divide-y divide-gray-100">

  <InfoRow
    label="Plan"
    value={
      tenant.plan ? (
        <PlanBadge plan={tenant.plan} />
      ) : "—"
    }
  />

  <InfoRow
    label="Region"
    value={tenant.region || "—"}
  />

  <InfoRow
    label="Created"
    value={tenant.createdOn || "—"}
  />

</div>
     

    </SectionCard>
  );
};

export default WorkspaceSection;