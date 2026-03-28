// components/features/KeyStore/KeyStoreGrid.jsx

import KeyCard from "./KeyCard";
import EmptyState from "../../common/layout/EmptyState";

const KeyStoreGrid = ({ data, onDelete, onRotate }) => {
  if (!data || data.length === 0) {
    return <EmptyState title="No keys found" />;
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {data.map((item) => (
        <KeyCard
          key={item.id}
          item={item}
          onDelete={() => onDelete(item)}
          onRotate={() => onRotate(item)}
        />
      ))}
    </div>
  );
};

export default KeyStoreGrid;