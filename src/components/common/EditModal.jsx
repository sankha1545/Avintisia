import { useState, useEffect } from "react";
import Button from "./Button";
import { Modal } from "./CardGridPage";

const EditModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = {},
  fields = [],
  title = "Edit Item",
}) => {
  const [form, setForm] = useState({});

  useEffect(() => {
    setForm(initialData || {});
  }, [initialData]);

  if (!isOpen) return null;

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <Modal title={title} onClose={onClose}>
      <div className="space-y-4">
        {fields.map((field) => (
          <div key={field.key}>
            <label className="block mb-1 text-xs font-medium text-gray-600">
              {field.label}
            </label>

            <input
              type={field.type || "text"}
              value={form[field.key] || ""}
              onChange={(e) => handleChange(field.key, e.target.value)}
              className="w-full px-3 py-2 text-sm border rounded-md outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        ))}

        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>

          <Button onClick={() => onSubmit(form)}>
            Save Changes
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default EditModal;