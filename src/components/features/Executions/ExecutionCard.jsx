// components/features/Executions/ExecutionCard.jsx

import Icons from "../../common/icons/Icons";
import DotMenu from "../../common/ui/DotMenu";
import StatusBadge from "../../common/ui/StatusBadge";

const ExecutionCard = ({ item, onView }) => {
  const lastLog =
    item?.logs?.length > 0
      ? item.logs[item.logs.length - 1]
      : "No logs available";

  return (
    <div
      onClick={onView}
      className="flex flex-col w-full gap-2 p-4 transition bg-white border cursor-pointer rounded-xl hover:shadow-md"
    >
      <div className="flex justify-between">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">
            {item.name}
          </h3>
          <p className="text-xs text-gray-400">
            {item.agent} · {item.pipeline}
          </p>
        </div>

        <DotMenu onView={onView} />
      </div>

      <p className="text-xs text-gray-500">{item.description}</p>

      <StatusBadge status={item.status} />

      <div className="bg-[#0f111a] rounded px-2 py-1 text-xs text-gray-400 font-mono">
        {lastLog}
      </div>

      <div className="flex justify-between text-xs text-gray-400">
        <div className="flex items-center gap-1">
          <Icons name="activity" size={12} />
          {item.duration}
        </div>
        <span>{item.createdOn}</span>
      </div>
    </div>
  );
};

export default ExecutionCard;