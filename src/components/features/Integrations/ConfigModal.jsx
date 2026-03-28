// components/features/Integrations/ConfigModal.jsx

import { useState, useEffect } from "react";
import Modal from "../../common/modal/Modal";
import FormField from "../../common/form/FormField";
import TextInput from "../../common/ui/TextInput";
import Button from "../../common/ui/Button";

const ConfigModal = ({ integration, onClose, onSave }) => {
  const [apiKey, setApiKey] = useState("");

  // Reset when integration changes
  useEffect(() => {
    if (integration) setApiKey("");
  }, [integration]);

  if (!integration) return null;

  return (
    <Modal title={`Configure ${integration.name}`} onClose={onClose}>
      <div className="flex flex-col gap-4">

        <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
          <span className="text-2xl">{integration.icon}</span>
          <div>
            <p className="font-semibold">{integration.name}</p>
            <p className="text-xs text-gray-400">{integration.category}</p>
          </div>
        </div>

        <FormField label="API Key">
          <TextInput value={apiKey} onChange={setApiKey} />
        </FormField>

        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              onSave(integration.id);
              onClose();
            }}
          >
            Connect
          </Button>
        </div>

      </div>
    </Modal>
  );
};

export default ConfigModal;