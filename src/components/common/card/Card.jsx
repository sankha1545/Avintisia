import DotMenu from "../ui/DotMenu";
import StatusBadge from "../ui/StatusBadge";

const Card = ({
  title,
  description,
  meta = [],
  status,
  createdOn,
  onView,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="flex flex-col w-full min-w-0 gap-2 p-4 transition bg-white border border-gray-200 rounded-xl hover:shadow-md">
      
      {/* Top */}
      <div className="flex items-start justify-between">
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
        <DotMenu onView={onView} onEdit={onEdit} onDelete={onDelete} />
      </div>

      {/* Description */}
      <p className="flex-1 text-xs leading-relaxed text-gray-500">
        {description}
      </p>

      {/* Meta */}
      {meta.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {meta.map((m, i) => (
            <span
              key={i}
              className="px-2 py-0.5 text-[11px] bg-gray-100 text-gray-600 rounded-full"
            >
              {m}
            </span>
          ))}
        </div>
      )}

      {/* Status */}
      {status && <StatusBadge status={status} />}

      {/* Footer */}
      <p className="mt-1 text-[11px] text-gray-400">
        <span className="font-medium text-gray-300">Created On: </span>
        {createdOn}
      </p>
    </div>
  );
};

export default Card;