import Modal from "../modal/Modal";

const ViewModal = ({
  isOpen,
  onClose,
  title = "View Details",
  data = {},
  fields = [],
}) => {
  if (!isOpen) return null;

  return (
    <Modal title={title} onClose={onClose}>
      <div className="space-y-4">

        {fields.map((field) => {
          const value = data?.[field.key];

          return (
            <div key={field.key}>
              <p className="text-xs font-medium text-gray-400">
                {field.label}
              </p>

              {field.render ? (
                <div className="mt-1">{field.render(value, data)}</div>
              ) : (
                <p className="mt-1 text-sm text-gray-800 break-words">
                  {value || "-"}
                </p>
              )}
            </div>
          );
        })}

      </div>
    </Modal>
  );
};

export default ViewModal;