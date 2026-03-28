// components/features/Jobs/JobDetailModal.jsx

import Modal from "../../common/modal/Modal";
import Button from "../../common/ui/Button";

const JobDetailModal = ({ job, onClose }) => {
  if (!job) return null;

  return (
    <Modal title={`Job: ${job.name}`} onClose={onClose}>
      <div className="flex flex-col gap-4">

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {[
            { label: "Status", val: job.status ?? "—" },
            { label: "Agent", val: job.agent ?? "—" },
            { label: "Type", val: job.type ?? "—" },
            { label: "Duration", val: job.duration ?? "—" },
            { label: "Started At", val: job.startedAt ?? "—" },
            { label: "Created On", val: job.createdOn ?? "—" },
          ].map((f) => (
            <div key={f.label} className="p-3 rounded-lg bg-gray-50">
              <p className="text-xs text-gray-400">{f.label}</p>
              <p className="text-sm font-semibold text-gray-800">
                {f.val}
              </p>
            </div>
          ))}
        </div>

        <div className="p-3 rounded-lg bg-gray-50">
          <p className="mb-1 text-xs text-gray-400">DESCRIPTION</p>
          <p className="text-sm text-gray-700">
            {job.description || "—"}
          </p>
        </div>

        <div className="flex justify-end">
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
        </div>

      </div>
    </Modal>
  );
};

export default JobDetailModal;