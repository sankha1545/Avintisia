// components/features/Tenant/InviteModal.jsx

import { useState } from "react";
import Button from "../../common/ui/Button";
import TextInput from "../../common/ui/TextInput";
import SelectInput from "../../common/ui/SelectInput";

const InviteModal = ({ isOpen, onClose, onInvite }) => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Member");
  const [error, setError] = useState("");

  // 🔒 DO NOT RENDER IF CLOSED
  if (!isOpen) return null;

  const submit = () => {
    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    onInvite({ email, role });

    // reset
    setEmail("");
    setRole("Member");
    setError("");

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <div className="w-full max-w-md bg-white shadow-xl rounded-xl">

        {/* HEADER */}
        <div className="flex items-center justify-between px-5 pt-5">
          <h3 className="text-base font-semibold">Invite Member</h3>
          <button onClick={onClose}>✕</button>
        </div>

        {/* BODY */}
        <div className="px-5 pt-4 pb-5 space-y-4">

          <TextInput
            value={email}
            onChange={setEmail}
            placeholder="Enter email"
          />

          <SelectInput
            value={role}
            onChange={setRole}
            options={[
              { value: "Admin", label: "Admin" },
              { value: "Member", label: "Member" },
            ]}
          />

          {error && (
            <p className="text-xs text-red-500">{error}</p>
          )}

          {/* ACTIONS */}
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={submit}>
              Invite
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default InviteModal;