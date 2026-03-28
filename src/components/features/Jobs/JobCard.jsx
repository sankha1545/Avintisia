// components/features/Jobs/JobCard.jsx

import DotMenu from "../../common/ui/DotMenu";
import StatusBadge from "../../common/ui/StatusBadge";
import Icons from "../../common/icons/Icons";

const JobCard = ({ item, onDelete, onView, onRetry }) => {
  const status = item?.status ?? "unknown";
  const duration = item?.duration ?? "—";
  const startedAt = item?.startedAt ?? "—";

  return (
    <div
      onClick={onView}
      className="flex flex-col gap-3 p-4 transition bg-white border cursor-pointer rounded-xl hover:shadow-md"
    >
      <div className="flex justify-between">
        <div>
          <h3 className="text-sm font-semibold">{item.name}</h3>
          <p className="text-xs text-gray-400">
            {item.agent} · {item.type}
          </p>
        </div>

        <DotMenu
          onView={onView}
          onDelete={onDelete}
          extra={[
            status === "failed" && { label: "Retry", action: onRetry },
          ].filter(Boolean)}
        />
      </div>

      <p className="text-xs text-gray-500">{item.description}</p>

      <StatusBadge status={status} />

      <div className="flex justify-between text-xs text-gray-400">
        <div className="flex items-center gap-1">
          <Icons name="activity" size={12} />
          {duration}
        </div>
        <span>{startedAt}</span>
      </div>

      <p className="text-xs text-gray-400">
        Created On: {item.createdOn}
      </p>
    </div>
  );
};

export default JobCard;