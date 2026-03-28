// components/features/Tenant/MembersSection.jsx

import SectionCard from "./SectionCard";
import MemberRow from "./MemberRow";
import Button from "../../common/ui/Button";

const MembersSection = ({
  members = [],
  onInviteClick,
  onRemove,
}) => {
  // 🔒 SAFETY: ensure always array
  const safeMembers = Array.isArray(members)
    ? members.filter((m) => m && (m.name || m.email))
    : [];

  return (
    <SectionCard title="Team Members" icon="users">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-gray-600">
          {safeMembers.length} member{safeMembers.length !== 1 && "s"}
        </span>

        <Button
          size="sm"
          onClick={onInviteClick}
        >
          Invite
        </Button>
      </div>

      {/* EMPTY STATE */}
      {safeMembers.length === 0 ? (
        <p className="text-sm text-gray-400">
          No members yet
        </p>
      ) : (
        <div className="flex flex-col divide-y divide-gray-100">
          {safeMembers.map((m) => {
            const displayName =
              m.name ||
              m.email?.split("@")[0] ||
              "Unknown";

            return (
              <MemberRow
                key={m.id || m.email} // 🔥 safer key
                name={displayName}
                email={m.email || "—"}
                role={m.role || "Member"}
                onRemove={() => onRemove?.(m)} // 🔒 safe call
              />
            );
          })}
        </div>
      )}

    </SectionCard>
  );
};

export default MembersSection;