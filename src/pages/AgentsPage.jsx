// src/pages/AgentsPage.jsx
import { useState } from "react";
import CardGridPage, { Card, Modal, StatusBadge } from "../components/common/CardGridPage";
import FormField from "../components/common/FormField";
import TextInput from "../components/common/TextInput";
import TextArea from "../components/common/TextArea";
import Button from "../components/common/Button";
import SelectInput from "../components/common/SelectInput";
import { agentsData } from "../data/agentsData";

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
    onCreate({ name: name.trim(), description: description.trim(), type, model });
    onClose();
  };

  return (
    <Modal title="Create Agent" onClose={onClose} width={520}>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <FormField label="Agent Name" required error={errors.name}>
          <TextInput value={name} onChange={setName} placeholder="e.g. Customer Support Agent" />
        </FormField>
        <FormField label="Description" required error={errors.description}>
          <TextArea value={description} onChange={setDescription} placeholder="What does this agent do?" rows={3} />
        </FormField>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <FormField label="Type">
            <SelectInput value={type} onChange={setType} options={[
              { value: "LLM", label: "LLM" },
              { value: "Rule-Based", label: "Rule-Based" },
              { value: "Hybrid", label: "Hybrid" },
            ]} />
          </FormField>
          <FormField label="Model">
            <SelectInput value={model} onChange={setModel} options={[
              { value: "GPT-4o", label: "GPT-4o" },
              { value: "Claude 3 Sonnet", label: "Claude 3 Sonnet" },
              { value: "Gemini 1.5 Pro", label: "Gemini 1.5 Pro" },
              { value: "Mistral 7B", label: "Mistral 7B" },
            ]} />
          </FormField>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 8 }}>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={submit}>Create Agent</Button>
        </div>
      </div>
    </Modal>
  );
};

const AgentsPage = () => {
  const [data, setData] = useState(agentsData);
  const [showModal, setShowModal] = useState(false);

  const handleCreate = (item) => {
    setData(prev => [{
      ...item, id: Date.now(), status: "idle", createdOn: new Date().toLocaleDateString("en-GB"),
    }, ...prev]);
  };

  const handleDelete = (id) => setData(prev => prev.filter(d => d.id !== id));

  return (
    <>
      <CardGridPage
        title="Agents"
        subtitle="Create and manage your AI agents."
        data={data}
        searchPlaceholder="Search agents..."
        searchKeys={["name", "description", "type", "status"]}
        createLabel="+ Create Agent"
        onCreate={() => setShowModal(true)}
        renderCard={item => (
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
      {showModal && (
        <CreateAgentModal onClose={() => setShowModal(false)} onCreate={handleCreate} />
      )}
    </>
  );
};

export default AgentsPage;