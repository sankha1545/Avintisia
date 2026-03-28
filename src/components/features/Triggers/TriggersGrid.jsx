import EmptyState from "../../common/layout/EmptyState";
import TriggerCard from "./TriggerCard";

const TriggersGrid = ({ data, onEdit, onDelete, onToggle, onFire }) => {
  if (!data || data.length === 0) {
    return <EmptyState title="No triggers found" />;
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {data.map((item, index) => (
        <TriggerCard
          key={item.id ?? index}
          item={item}
          onEdit={() => onEdit(item)}
          onDelete={() => onDelete(item)}
          onFire={() => onFire(item)}
          onToggle={() => onToggle(item)}
        />
      ))}
    </div>
  );
};

export default TriggersGrid;