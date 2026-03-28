// src/pages/AgentsPage.jsx
import { useState } from "react";
import CardGridPage, {
  Card,
  Modal,
  StatusBadge,
} from "../components/common/CardGridPage";
import FormField from "../components/common/FormField";
import TextInput from "../components/common/TextInput";
import TextArea from "../components/common/TextArea";
import Button from "../components/common/Button";
import SelectInput from "../components/common/SelectInput";
import { agentsData } from "../data/sidebarData";


// ============================
//  CREATE AGENT MODAL
// ============================
const CreateAgentModal = ({ onClose, onCreate }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("LLM");
  const [model, setModel] = useState("GPT-4o");
  const [errors, setErrors] = useState({});

  const submit = () => {
    const e = {};

    if (!name.trim()) e.name = "Name is required";
    if (!description.trim()) e.description = "Description is required";

    setErrors(e);

    if (Object.keys(e).length) return;

    onCreate({
      name: name.trim(),
      description: description.trim(),
      type,
      model,
    });

    onClose();
  };

  return (
    <Modal title="Create Agent" onClose={onClose} width={520}>
      <div className="flex flex-col gap-4 sm:gap-5">

        {/* Agent Name */}
        <FormField label="Agent Name" required error={errors.name}>
          <TextInput
            value={name}
            onChange={setName}
            placeholder="e.g. Customer Support Agent"
          />
        </FormField>

        {/* Description */}
        <FormField label="Description" required error={errors.description}>
          <TextArea
            value={description}
            onChange={setDescription}
            placeholder="What does this agent do?"
            rows={3}
          />
        </FormField>

        {/* Grid Inputs */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <FormField label="Type">
            <SelectInput
              value={type}
              onChange={setType}
              options={[
                { value: "LLM", label: "LLM" },
                { value: "Rule-Based", label: "Rule-Based" },
                { value: "Hybrid", label: "Hybrid" },
              ]}
            />
          </FormField>

          <FormField label="Model">
            <SelectInput
              value={model}
              onChange={setModel}
              options={[
                { value: "GPT-4o", label: "GPT-4o" },
                { value: "Claude 3 Sonnet", label: "Claude 3 Sonnet" },
                { value: "Gemini 1.5 Pro", label: "Gemini 1.5 Pro" },
                { value: "Mistral 7B", label: "Mistral 7B" },
              ]}
            />
          </FormField>
        </div>

        {/* Actions */}
        <div className="flex flex-col justify-end gap-2 pt-2 sm:flex-row sm:gap-3">
          <Button
            variant="ghost"
            onClick={onClose}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>

          <Button
            variant="primary"
            onClick={submit}
            className="w-full sm:w-auto"
          >
            Create Agent
          </Button>
        </div>
      </div>
    </Modal>
  );
};


// ============================
//  MAIN PAGE
// ============================
const AgentsPage = () => {
  const [data, setData] = useState(agentsData);
  const [showModal, setShowModal] = useState(false);

  // Create Agent
  const handleCreate = (item) => {
    setData((prev) => [
      {
        ...item,
        id: Date.now(),
        status: "idle",
        createdOn: new Date().toLocaleDateString("en-GB"),
      },
      ...prev,
    ]);
  };

  // Delete Agent
  const handleDelete = (id) => {
    setData((prev) => prev.filter((d) => d.id !== id));
  };

  return (
    <div className="flex flex-col w-full h-full">

      <CardGridPage
        title="Agents"
        subtitle="Create and manage your AI agents."
        data={data}
        searchPlaceholder="Search agents..."
        searchKeys={["name", "description", "type", "status"]}
        createLabel="+ Create Agent"
        onCreate={() => setShowModal(true)}

        renderCard={(item) => (
          <Card
            key={item.id}
            title={item.name}
            description={item.description}
            meta={[item.type, item.model || "GPT-4o"]}
            status={item.status}
            createdOn={item.createdOn}

            onView={() => alert(`Viewing agent: ${item.name}`)}
            onEdit={() => alert(`Edit agent: ${item.name}`)}
            onDelete={() => handleDelete(item.id)}
          />
        )}
      />

      {/* MODAL */}
      {showModal && (
        <CreateAgentModal
          onClose={() => setShowModal(false)}
          onCreate={handleCreate}
        />
      )}
    </div>
  );
};

export default AgentsPage;