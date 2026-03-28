// components/features/Machines/MachineCard.jsx

import DotMenu from "../../common/ui/DotMenu";
import StatusBadge from "../../common/ui/StatusBadge";
import MetricBar from "./MetricBar";

const MachineCard = ({ item, onDelete, onEdit, onStart, onStop }) => {
  const cpu = item?.cpu ?? 0;
  const memory = item?.memory ?? "—";

  return (
    <div className="flex flex-col gap-3 p-4 bg-white border rounded-xl hover:shadow-md">

      <div className="flex justify-between">
        <div>
          <h3 className="text-sm font-semibold">{item.name}</h3>
          <p className="text-xs text-gray-400">
            {item.region} · {item.os}
          </p>
        </div>

        <DotMenu
          onEdit={onEdit}
          onDelete={onDelete}
          extra={[
            item.status !== "running" && { label: "Start", action: onStart },
            item.status === "running" && { label: "Stop", action: onStop },
          ].filter(Boolean)}
        />
      </div>

      <p className="text-xs text-gray-500">{item.description}</p>

      <div className="p-3 space-y-2 rounded-lg bg-gray-50">
        <MetricBar value={cpu} />
        <p className="text-xs">{memory}</p>
      </div>

      <div className="flex justify-between text-xs text-gray-400">
        <StatusBadge status={item.status} />
        <span>{item.createdOn}</span>
      </div>
    </div>
  );
};

export default MachineCard;