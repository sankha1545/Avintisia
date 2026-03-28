// components/features/Integrations/IntegrationGrid.jsx

import IntegrationCard from "./IntegrationCard";
import EmptyState from "../../common/layout/EmptyState";

const IntegrationGrid = ({ data, onConfigure, onDisconnect }) => {
  if (!data || data.length === 0) {
    return <EmptyState title="No integrations found" />;
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {data.map((item) => (
        <IntegrationCard
          key={item.id}
          item={item}
          onConfigure={onConfigure}
          onDisconnect={onDisconnect}
        />
      ))}
    </div>
  );
};

export default IntegrationGrid;