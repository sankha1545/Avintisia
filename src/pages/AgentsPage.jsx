"use client";

import { useState } from "react";
import { agentsData } from "../data/sidebarData";

import AgentsGrid from "../components/features/Agents/AgentsGrid";
import CreateBaseModal from "../components/common/modal/CreateBaseModal";

import ViewModal from "../components/common/modal/ViewModal";
import EditModal from "../components/common/modal/EditModal";
import DeleteConfirmModal from "../components/common/modal/DeleteConfirmModal";

import StatusBadge from "../components/common/ui/StatusBadge";

const AgentsPage = () => {
  // DATA
  const [data, setData] = useState(agentsData);

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
        description: form.description,
        type: form.type,
        model: form.model,
        status: "idle",
        createdOn: new Date().toLocaleDateString("en-GB"),
      },
      ...prev,
    ]);
  };

  // UPDATE
  const handleUpdate = (updated) => {
    setData((prev) =>
      prev.map((d) => (d.id === updated.id ? { ...d, ...updated } : d))
    );
    setEditItem(null);
  };

  // DELETE
  const handleDelete = () => {
    setData((prev) => prev.filter((d) => d.id !== deleteItem.id));
    setDeleteItem(null);
  };

  // FIELD CONFIG
  const agentFields = [
    {
      name: "name",
      label: "Agent Name",
      type: "text",
      required: true,
    },
    {
      name: "description",
      label: "Description",
      type: "textarea",
    },
    {
      name: "type",
      label: "Type",
      type: "select",
      options: [
        { value: "chat", label: "Chat" },
        { value: "task", label: "Task" },
        { value: "assistant", label: "Assistant" },
      ],
    },
    {
      name: "model",
      label: "Model",
      type: "select",
      options: [
        { value: "gpt-4", label: "GPT-4" },
        { value: "gpt-4o", label: "GPT-4o" },
        { value: "claude", label: "Claude" },
      ],
    },
  ];

  return (
    <div className="flex flex-col w-full h-full">
      
      {/* GRID */}
      <AgentsGrid
        data={data}
        onCreate={() => setShowCreate(true)}
        setViewItem={setViewItem}
        setEditItem={setEditItem}
        setDeleteItem={setDeleteItem}
      />

      {/* CREATE MODAL */}
      <CreateBaseModal
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
        title="Create Agent"
        subtitle="Configure and deploy a new AI agent."
        fields={agentFields}
        submitLabel="Create Agent"
        initialState={{
          name: "",
          description: "",
          type: "chat",
          model: "gpt-4",
        }}
        onSubmit={handleCreate}
      />

      {/* VIEW MODAL */}
      <ViewModal
        isOpen={!!viewItem}
        onClose={() => setViewItem(null)}
        title="Agent Details"
        data={viewItem}
        fields={[
          { key: "name", label: "Name" },
          { key: "description", label: "Description" },
          {
            key: "status",
            label: "Status",
            render: (v) => <StatusBadge status={v} />,
          },
          { key: "type", label: "Type" },
          { key: "model", label: "Model" },
          { key: "createdOn", label: "Created On" },
        ]}
      />

      {/* EDIT MODAL */}
      <EditModal
        isOpen={!!editItem}
        onClose={() => setEditItem(null)}
        title="Edit Agent"
        initialData={editItem}
        fields={[
          { key: "name", label: "Name" },
          { key: "description", label: "Description" },
          { key: "type", label: "Type" },
          { key: "model", label: "Model" },
        ]}
        onSubmit={(updated) =>
          handleUpdate({ ...editItem, ...updated })
        }
      />

      {/* DELETE MODAL */}
      <DeleteConfirmModal
        isOpen={!!deleteItem}
        onClose={() => setDeleteItem(null)}
        title="Delete Agent"
        message={`Are you sure you want to delete "${deleteItem?.name}"?`}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default AgentsPage;