"use client";

import { useState } from "react";
import { triggersData } from "../data/sidebarData";

import CardGridPage from "../components/common/layout/CardGridPage";
import TriggerCard from "../components/features/Triggers/TriggerCard";

import CreateBaseModal from "../components/common/modal/CreateBaseModal";
import EditModal from "../components/common/modal/EditModal";
import DeleteConfirmModal from "../components/common/modal/DeleteConfirmModal";

const TriggersPage = () => {
  // DATA (safe initialization)
  const [data, setData] = useState(
    Array.isArray(triggersData) ? triggersData : []
  );

  // MODALS
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);
  const [fireItem, setFireItem] = useState(null);

  // CREATE
  const handleCreate = (form) => {
    setData((prev) => [
      {
        id: Date.now(),
        name: form.name,
        description: form.description,
        status: "enabled",
        lastRun: "Never",
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

  // FIRE
  const handleFire = () => {
    if (!fireItem?.id) return;

    console.log("Fired:", fireItem.name);
    setFireItem(null);
  };

  // CREATE FIELDS
  const triggerFields = [
    {
      name: "name",
      label: "Trigger Name",
      type: "text",
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
        title="Triggers"
        subtitle="Configure schedules, webhooks, and event triggers."
        data={data}
        searchPlaceholder="Search triggers..."
        createLabel="Create Trigger"
        onCreate={() => setShowModal(true)}
        renderCard={(item) => (
          <TriggerCard
            key={item.id}
            item={item}
            onEdit={() => setEditItem(item)}
            onDelete={() => setDeleteItem(item)}
            onFire={() => setFireItem(item)}
            onToggle={() =>
              setData((prev) =>
                prev.map((d) =>
                  d.id === item.id
                    ? {
                        ...d,
                        status:
                          d.status === "enabled"
                            ? "disabled"
                            : "enabled",
                      }
                    : d
                )
              )
            }
          />
        )}
      />

      {/* CREATE MODAL */}
      <CreateBaseModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Create Trigger"
        subtitle="Set up automated workflows and events."
        fields={triggerFields}
        submitLabel="Create Trigger"
        initialState={{
          name: "",
          description: "",
        }}
        onSubmit={handleCreate}
      />

      {/* EDIT MODAL */}
      <EditModal
        isOpen={!!editItem}
        onClose={() => setEditItem(null)}
        initialData={editItem}
        title="Edit Trigger"
        fields={[
          { key: "name", label: "Name" },
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
        title="Delete Trigger"
        message={`Delete "${deleteItem?.name}"?`}
        onConfirm={handleDelete}
      />

      {/* FIRE MODAL */}
      <DeleteConfirmModal
        isOpen={!!fireItem}
        onClose={() => setFireItem(null)}
        title="Fire Trigger"
        message={`Execute "${fireItem?.name}" now?`}
        onConfirm={handleFire}
      />

    </div>
  );
};

export default TriggersPage;