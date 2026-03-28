// components/features/Executions/ExecutionViewModal.jsx

import Modal from "../../common/modal/Modal";
import StatusBadge from "../../common/ui/StatusBadge";
import Button from "../../common/ui/Button";

const ExecutionViewModal = ({ execution, onClose }) => {
  if (!execution) return null;

  const logs = Array.isArray(execution.logs) ? execution.logs : [];

  return (
    <Modal title={`Logs: ${execution.name}`} onClose={onClose}>
      <div className="flex flex-col gap-4">

        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
          <StatusBadge status={execution.status} />
          <span>
            Duration:{" "}
            <strong className="text-gray-700">
              {execution.duration}
            </strong>
          </span>
          <span>
            Agent:{" "}
            <strong className="text-gray-700">
              {execution.agent}
            </strong>
          </span>
        </div>

        <div className="bg-[#0f111a] rounded-lg p-3 max-h-52 overflow-y-auto text-xs font-mono space-y-1">
          {logs.length > 0 ? (
            logs.map((log, i) => (
              <div key={i} className="text-gray-400">
                {log}
              </div>
            ))
          ) : (
            <div className="text-gray-500">No logs available</div>
          )}
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <p className="mb-1 text-xs font-semibold text-gray-400">
              INPUT
            </p>
            <div className="p-2 font-mono text-xs bg-gray-100 rounded">
              {execution.input || "—"}
            </div>
          </div>

          <div>
            <p className="mb-1 text-xs font-semibold text-gray-400">
              OUTPUT
            </p>
            <div className="p-2 font-mono text-xs bg-gray-100 rounded">
              {execution.output || "—"}
            </div>
          </div>
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

export default ExecutionViewModal;