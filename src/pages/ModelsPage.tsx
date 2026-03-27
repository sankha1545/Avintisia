// src/pages/ModelsPage.jsx
import { useState } from "react";
import CardGridPage, { Card, Modal, StatusBadge } from "../components/common/CardGridPage";
import FormField from "../components/common/FormField";
import TextInput from "../components/common/TextInput";
import TextArea from "../components/common/TextArea";
import SelectInput from "../components/common/SelectInput";
import Button from "../components/common/Button";
import { modelsData } from "../data/sidebarData";

const CreateModelModal = ({ onClose, onCreate }) => {
  const [name, setName] = useState("");
  const [provider, setProvider] = useState("OpenAI");
  const [type, setType] = useState("LLM");
  const [tokens, setTokens] = useState("128k");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState({});

  const submit = () => {
    const e = {};
    if (!name.trim()) e.name = "Name is required";
    setErrors(e);
    if (Object.keys(e).length) return;
    onCreate({ name: name.trim(), provider, type, tokens, description: description.trim() });
    onClose();
  };

  return (
    <Modal title="Add AI Model" onClose={onClose} width={520}>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <FormField label="Model Name" required error={errors.name}>
          <TextInput value={name} onChange={setName} placeholder="e.g. GPT-4o" />
        </FormField>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <FormField label="Provider">
            <SelectInput value={provider} onChange={setProvider} options={[
              { value: "OpenAI", label: "OpenAI" },
              { value: "Anthropic", label: "Anthropic" },
              { value: "Google", label: "Google" },
              { value: "Mistral", label: "Mistral" },
              { value: "Custom", label: "Custom" },
            ]} />
          </FormField>
          <FormField label="Type">
            <SelectInput value={type} onChange={setType} options={[
              { value: "LLM", label: "LLM" },
              { value: "Vision", label: "Vision" },
              { value: "Audio", label: "Audio" },
              { value: "Embedding", label: "Embedding" },
            ]} />
          </FormField>
        </div>
        <FormField label="Context Window">
          <SelectInput value={tokens} onChange={setTokens} options={[
            { value: "8k", label: "8k" },
            { value: "32k", label: "32k" },
            { value: "128k", label: "128k" },
            { value: "200k", label: "200k" },
            { value: "1M", label: "1M" },
            { value: "N/A", label: "N/A" },
          ]} />
        </FormField>
        <FormField label="Description">
          <TextArea value={description} onChange={setDescription} placeholder="Describe this model..." rows={2} />
        </FormField>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 8 }}>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={submit}>Add Model</Button>
        </div>
      </div>
    </Modal>
  );
};

const ModelsPage = () => {
  const [data, setData] = useState(modelsData);
  const [showModal, setShowModal] = useState(false);

  const handleCreate = (item) => {
    setData(prev => [{
      ...item, id: Date.now(), status: "active", createdOn: new Date().toLocaleDateString("en-GB"),
    }, ...prev]);
  };
  const handleDelete = (id) => setData(prev => prev.filter(d => d.id !== id));

  return (
    <>
      <CardGridPage
        title="AI Models"
        subtitle="View and configure AI models."
        data={data}
        searchPlaceholder="Search models..."
        searchKeys={["name", "provider", "type", "status"]}
        createLabel="+ Add Model"
        onCreate={() => setShowModal(true)}
        renderCard={item => (
          <Card
            key={item.id}
            title={item.name}
            description={item.description}
            meta={[item.provider, item.type, `${item.tokens} ctx`]}
            status={item.status}
            createdOn={item.createdOn}
            onView={() => alert(`View: ${item.name}`)}
            onEdit={() => alert(`Edit: ${item.name}`)}
            onDelete={() => handleDelete(item.id)}
          />
        )}
      />
      {showModal && (
        <CreateModelModal onClose={() => setShowModal(false)} onCreate={handleCreate} />
      )}
    </>
  );
};

export default ModelsPage;