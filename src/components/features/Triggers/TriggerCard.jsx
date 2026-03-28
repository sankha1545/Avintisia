import DotMenu from "../../common/ui/DotMenu";
import TypeBadge from "./TypeBadge";
import Toggle from "./Toggle";

const TriggerCard = ({ item, onDelete, onEdit, onToggle, onFire }) => {
  const status = item?.status ?? "disabled";
  const lastRun = item?.lastRun ?? "Never";

  return (
    <div className="flex flex-col gap-3 p-4 transition bg-white border rounded-xl hover:shadow-md">

      {/* HEADER */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">
            {item.name}
          </h3>
          <TypeBadge type={item.type} />
        </div>

        <DotMenu
          onEdit={onEdit}
          onDelete={onDelete}
          onView={onFire}
        />
      </div>

      {/* DESCRIPTION */}
      <p className="text-xs text-gray-500">
        {item.description}
      </p>

      {/* TOGGLE */}
      <div className="flex items-center justify-between">
        <Toggle
          enabled={status === "enabled"}
          onChange={onToggle}
        />
      </div>

      {/* FOOTER */}
      <div className="pt-2 mt-2 border-t">
        <p className="text-[11px] text-gray-400">
          Last Run: {lastRun}
        </p>

        <p className="text-[11px] text-gray-400">
          Created On: {item.createdOn}
        </p>

        <p className="mt-1 text-xs">
          <span
            className={
              status === "enabled"
                ? "text-green-600"
                : "text-gray-400"
            }
          >
            {status === "enabled" ? "Active" : "Disabled"}
          </span>
        </p>
      </div>

    </div>
  );
};

export default TriggerCard;