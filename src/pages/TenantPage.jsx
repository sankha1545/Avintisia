"use client";

import { useState } from "react";
import { tenantData } from "../data/sidebarData";

import TenantHeader from "../components/features/Tenant/TenantHeader";
import WorkspaceSection from "../components/features/Tenant/WorkspaceSection";
import MembersSection from "../components/features/Tenant/MembersSection";
import DangerSection from "../components/features/Tenant/DangerSection";
import InviteModal from "../components/features/Tenant/InviteModal";

import DeleteConfirmModal from "../components/common/modal/DeleteConfirmModal";

const TenantPage = () => {
  // STATE
  const [tenant, setTenant] = useState(tenantData);

  const [members, setMembers] = useState([
    {
      id: 1,
      name: "Girish Kumar",
      role: "Admin",
      email: "girish@workspace.io",
    },
    {
      id: 2,
      name: "Arjun Patel",
      role: "Member",
      email: "arjun@workspace.io",
    },
  ]);

  const [showInvite, setShowInvite] = useState(false);
  const [removeTarget, setRemoveTarget] = useState(null);
  const [deleteWorkspace, setDeleteWorkspace] = useState(false);

  // INVITE MEMBER (IMPROVED)
  const handleInvite = (data) => {
    const email = data?.email?.trim().toLowerCase();
    if (!email) return;

    // prevent duplicate (case-insensitive)
    if (members.some((m) => m.email.toLowerCase() === email)) {
      alert("Member already exists");
      return;
    }

    const newMember = {
      id: Date.now(),
      email,
      role: data.role || "Member",
      name: email.split("@")[0],
    };

    setMembers((prev) => [...prev, newMember]);
  };

  // REMOVE MEMBER (SAFE)
  const handleRemoveMember = () => {
    if (!removeTarget?.id) return;

    const isLastAdmin =
      removeTarget.role === "Admin" &&
      members.filter((m) => m.role === "Admin").length === 1;

    if (isLastAdmin) {
      alert("At least one Admin is required");
      return;
    }

    setMembers((prev) =>
      prev.filter((p) => p.id !== removeTarget.id)
    );

    setRemoveTarget(null);
  };

  // DELETE WORKSPACE
  const handleDeleteWorkspace = () => {
    console.log("Workspace deleted");
    setDeleteWorkspace(false);
  };

  return (
    <div className="flex flex-col gap-6 pb-6">

      <TenantHeader subtitle="Manage your workspace and team members" />

      <WorkspaceSection tenant={tenant} setTenant={setTenant} />

      <MembersSection
        members={members}
        onInviteClick={() => setShowInvite(true)}
        onRemove={setRemoveTarget}
      />

      <DangerSection onDelete={() => setDeleteWorkspace(true)} />

      <InviteModal
        isOpen={showInvite}
        onClose={() => setShowInvite(false)}
        onInvite={handleInvite}
      />

      <DeleteConfirmModal
        isOpen={!!removeTarget}
        onClose={() => setRemoveTarget(null)}
        title="Remove Member"
        message={`Remove ${removeTarget?.name || ""}?`}
        onConfirm={handleRemoveMember}
      />

      <DeleteConfirmModal
        isOpen={deleteWorkspace}
        onClose={() => setDeleteWorkspace(false)}
        title="Delete Workspace"
        message="This action cannot be undone."
        onConfirm={handleDeleteWorkspace}
      />

    </div>
  );
};

export default TenantPage;