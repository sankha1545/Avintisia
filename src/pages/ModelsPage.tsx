"use client";

import { useState } from "react";
import CardGridPage from "../components/common/layout/CardGridPage";

import StatusBadge from "../components/common/ui/StatusBadge";

import ViewModal from "../components/common/modal/ViewModal";
import EditModal from "../components/common/modal/EditModal";
import DeleteConfirmModal from "../components/common/modal/DeleteConfirmModal";
import CreateBaseModal from "../components/common/modal/CreateBaseModal";

import ModelsCardRenderer from "../components/features/Models/ModelsCardRenderer";

import { modelsData } from "../data/sidebarData";

const ModelsPage = () => {
  // DATA (safe initialization)
  const [data, setData] = useState(
    Array.isArray(modelsData) ? modelsData : []
  );

  // MODALS
  const [showCreate, setShowCreate] = useState(false);
  const [viewItem, setViewItem] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);

  // CREATE
  const handleCreate = (form) => {
    setData((prev) => [
      {
        id: Date.now(),
        name: form.name,
        provider: form.provider,
        type: form.type,
        tokens: form.tokens,
        description: form.description,
        status: "active",
        createdOn: new Date().toLocaleDateString("en-GB"),
      },
      ...prev,
    ]);
  };

  // UPDATE
  const handleUpdate = (updated) => {
    setData((prev) =>
      prev.map((d) =>
        d.id === updated.id ? { ...d, ...updated } : d
      )
    );
    setEditItem(null);
  };

  // DELETE
  const handleDelete = () => {
    if (!deleteItem?.id) return;

    setData((prev) =>
      prev.filter((d) => d.id !== deleteItem.id)
    );
    setDeleteItem(null);
  };

  // CREATE FIELDS CONFIG
  const modelFields = [
    {
      name: "name",
      label: "Model Name",
      type: "text",
      required: true,
    },
    {
      name: "provider",
      label: "Provider",
      type: "text",
      required: true,
    },
    {
      name: "type",
      label: "Type",
      type: "text",
      required: true,
    },
    {
      name: "tokens",
      label: "Context Window",
      type: "text",
    },
    {
      name: "description",
      label: "Description",
      type: "textarea",
    },
  ];

  return (
    <>
      <CardGridPage
        title="AI Models"
        subtitle="View and configure AI models."
        data={data}
        searchPlaceholder="Search models..."
        searchKeys={["name", "provider", "type", "status"]}
        createLabel="+ Add Model"
        onCreate={() => setShowCreate(true)}
        renderCard={(item) => (
          <ModelsCardRenderer
            item={item}
            onView={setViewItem}
            onEdit={setEditItem}
            onDelete={setDeleteItem}
          />
        )}
      />

      {/* CREATE MODAL */}
      <CreateBaseModal
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
        title="Create Model"
        subtitle="Configure AI model settings."
        fields={modelFields}
        submitLabel="Create Model"
        initialState={{
          name: "",
          provider: "",
          type: "",
          tokens: "",
          description: "",
        }}
        onSubmit={handleCreate}
      />

      {/* VIEW MODAL */}
      <ViewModal
        isOpen={!!viewItem}
        onClose={() => setViewItem(null)}
        title="Model Details"
        data={viewItem}
        fields={[
          { key: "name", label: "Name" },
          { key: "provider", label: "Provider" },
          { key: "type", label: "Type" },
          { key: "tokens", label: "Context Window" },
          {
            key: "status",
            label: "Status",
            render: (v) => <StatusBadge status={v} />,
          },
          { key: "description", label: "Description" },
          { key: "createdOn", label: "Created On" },
        ]}
      />

      {/* EDIT MODAL */}
      <EditModal
        isOpen={!!editItem}
        onClose={() => setEditItem(null)}
        title="Edit Model"
        initialData={editItem}
        fields={[
          { key: "name", label: "Name" },
          { key: "provider", label: "Provider" },
          { key: "type", label: "Type" },
          { key: "tokens", label: "Context Window" },
          { key: "description", label: "Description" },
        ]}
        onSubmit={(updated) =>
          handleUpdate({ ...editItem, ...updated })
        }
      />

      {/* DELETE MODAL */}
      <DeleteConfirmModal
        isOpen={!!deleteItem}
        onClose={() => setDeleteItem(null)}
        title="Delete Model"
        message={`Are you sure you want to delete "${deleteItem?.name}"?`}
        onConfirm={handleDelete}
      />
    </>
  );
};

export default ModelsPage;