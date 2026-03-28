// components/features/Queues/QueueCard.jsx

import DotMenu from "../../common/ui/DotMenu";
import StatChip from "./StatChip";

const QueueCard = ({ item, onDelete, onEdit, onPurge }) => {
  const pending = item?.pending ?? 0;
  const processed = item?.processed ?? 0;
  const failed = item?.failed ?? 0;

  const total = pending + processed + failed;
  const pct = total ? Math.round((processed / total) * 100) : 0;

  return (
    <div className="flex flex-col gap-3 p-4 bg-white border rounded-xl hover:shadow-md">

      <div className="flex justify-between">
        <div>
          <h3 className="text-sm font-semibold">{item.name}</h3>
          <p className="text-xs text-gray-400">
            {item.type} · {item.concurrency} workers
          </p>
        </div>

        <DotMenu
          onEdit={onEdit}
          onDelete={onDelete}
          extra={[{ label: "Purge Queue", action: onPurge }]}
        />
      </div>

      <p className="text-xs text-gray-500">{item.description}</p>

      <div className="flex gap-2">
        <StatChip label="Pending" value={pending} color="#f59e0b" />
        <StatChip label="Processed" value={processed} color="#10b981" />
        <StatChip label="Failed" value={failed} color="#ef4444" />
      </div>

      <div>
        <div className="flex justify-between text-xs text-gray-400">
          <span>Success rate</span>
          <span className="font-semibold text-green-600">{pct}%</span>
        </div>
        <div className="h-1.5 bg-gray-100 rounded">
          <div className="h-full bg-green-500" style={{ width: `${pct}%` }} />
        </div>
      </div>

      <p className="text-xs text-gray-400">
        Created On: {item.createdOn}
      </p>
    </div>
  );
};

export default QueueCard;