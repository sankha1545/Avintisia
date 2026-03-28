"use client";

import { useState } from "react";
import { vaultData } from "../data/sidebarData";

import CardGridPage from "../components/common/layout/CardGridPage";
import VaultCard from "../components/features/Vault/VaultCard";

import CreateBaseModal from "../components/common/modal/CreateBaseModal";
import DeleteConfirmModal from "../components/common/modal/DeleteConfirmModal";

const VaultPage = () => {
  // DATA (safe initialization)
  const [data, setData] = useState(
    Array.isArray(vaultData) ? vaultData : []
  );

  // MODALS
  const [showCreate, setShowCreate] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);

  // CREATE
  const handleCreate = (form) => {
    setData((prev) => [
      {
        id: Date.now(),
        name: form.name,
        secretValue: form.secretValue,
        description: form.description,
        lastAccessed: "Never",
        createdOn: new Date().toLocaleDateString("en-GB"),
      },
      ...prev,
    ]);
  };

  // DELETE
  const handleDelete = () => {
    if (!deleteItem?.id) return;

    setData((prev) =>
      prev.filter((d) => d.id !== deleteItem.id)
    );

    setDeleteItem(null);
  };

  // CREATE FIELDS
  const vaultFields = [
    {
      name: "name",
      label: "Secret Name",
      type: "text",
      required: true,
    },
    {
      name: "secretValue",
      label: "Secret Value",
      type: "password",
      required: true,
    },
    {
      name: "description",
      label: "Description",
      type: "textarea",
    },
  ];

  return (
    <div className="flex flex-col w-full h-full">

      <CardGridPage
        title="Vault"
        subtitle="Manage your secrets securely."
        data={data}
        searchPlaceholder="Search secrets..."
        createLabel="Add Secret"
        onCreate={() => setShowCreate(true)}
        renderCard={(item) => (
          <VaultCard
            key={item.id}
            item={item}
            onDelete={() => setDeleteItem(item)}
            onCopy={() => {
              navigator.clipboard.writeText(item.secretValue || "");
              console.log("Copied!");
            }}
          />
        )}
      />

      {/* CREATE MODAL */}
      <CreateBaseModal
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
        title="Add Secret"
        subtitle="Store sensitive data securely."
        fields={vaultFields}
        submitLabel="Save Secret"
        initialState={{
          name: "",
          secretValue: "",
          description: "",
        }}
        onSubmit={handleCreate}
      />

      {/* DELETE MODAL */}
      <DeleteConfirmModal
        isOpen={!!deleteItem}
        onClose={() => setDeleteItem(null)}
        title="Delete Secret"
        message={`Delete "${deleteItem?.name}"?`}
        onConfirm={handleDelete}
      />

    </div>
  );
};

export default VaultPage;