// components/features/Models/ModelsCardRenderer.jsx

import Card from "../../common/card/Card";

const ModelsCardRenderer = ({
  item,
  onView,
  onEdit,
  onDelete,
}) => {
  return (
    <Card
      title={item.name}
      description={item.description}
      meta={[item.provider, item.type, `${item.tokens} ctx`]}
      status={item.status}
      createdOn={item.createdOn}
      onView={() => onView(item)}
      onEdit={() => onEdit(item)}
      onDelete={() => onDelete(item)}
    />
  );
};

export default ModelsCardRenderer;