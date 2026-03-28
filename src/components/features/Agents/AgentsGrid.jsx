// components/features/Agents/AgentsGrid.jsx

import CardGridPage from "../../common/layout/CardGridPage";
import AgentCard from "./AgentCard";

const AgentsGrid = ({
  data,
  onCreate,
  setViewItem,
  setEditItem,
  setDeleteItem,
}) => {
  return (
    <CardGridPage
      title="Agents"
      subtitle="Create and manage your AI agents."
      data={data}
      searchPlaceholder="Search agents..."
      searchKeys={["name", "description", "type", "status"]}
      createLabel="+ Create Agent"
      onCreate={onCreate}
      renderCard={(item) => (
        <AgentCard
          item={item}
          onView={() => setViewItem(item)}
          onEdit={() => setEditItem(item)}
          onDelete={() => setDeleteItem(item)}
        />
      )}
    />
  );
};

export default AgentsGrid;