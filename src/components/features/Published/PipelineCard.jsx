// components/features/Published/PipelineCard.jsx

import DotMenu from "../../common/ui/DotMenu";
import StatusBadge from "../../common/ui/StatusBadge";

const PipelineCard = ({ item, onDelete, onEdit, onView, onToggle }) => (
  <div className="flex flex-col gap-2 p-4 bg-white border rounded-xl hover:shadow-md">

    <div className="flex justify-between">
      <h3 className="text-sm font-semibold">{item.name}</h3>

      <DotMenu
        onView={onView}
        onEdit={onEdit}
        onDelete={onDelete}
        extra={[
          {
            label: item.status === "live" ? "Unpublish" : "Go Live",
            action: onToggle,
          },
        ]}
      />
    </div>

    <p className="text-xs text-gray-500">{item.description}</p>

    <div className="flex flex-wrap gap-2">
      <StatusBadge status={item.status} />

      <span className="px-2 py-0.5 text-xs bg-gray-100 rounded">
        {item.version}
      </span>

      <span
        className={`px-2 py-0.5 text-xs rounded ${
          item.env === "Production"
            ? "bg-orange-100 text-orange-600"
            : "bg-green-100 text-green-600"
        }`}
      >
        {item.env}
      </span>
    </div>

    <p className="text-xs text-gray-400">
      Created On: {item.createdOn}
    </p>
  </div>
);

export default PipelineCard;