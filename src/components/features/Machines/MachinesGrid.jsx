// components/features/Machines/MachinesGrid.jsx

import MachineCard from "./MachineCard";
import EmptyState from "../../common/layout/EmptyState";

const MachinesGrid = ({ data, onEdit, onDelete, onStart, onStop }) => {
  if (!data || data.length === 0) {
    return <EmptyState title="No machines found" />;
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {data.map((item) => (
        <MachineCard
          key={item.id}
          item={item}
          onEdit={() => onEdit(item)}
          onDelete={() => onDelete(item)}
          onStart={() => onStart(item.id)}
          onStop={() => onStop(item.id)}
        />
      ))}
    </div>
  );
};

export default MachinesGrid;