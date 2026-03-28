// components/features/Library/LibraryCard.jsx

import DotMenu from "../../common/ui/DotMenu";
import Icons from "../../common/icons/Icons";
import CategoryBadge from "./CategoryBadge";

const LibraryCard = ({ item, onDelete, onView }) => {
  const downloads = item?.downloads ?? 0;
  const progress = Math.min((downloads / 600) * 100, 100);

  return (
    <div className="flex flex-col w-full gap-2 p-4 transition bg-white border rounded-xl hover:shadow-md">

      <div className="flex justify-between">
        <div className="flex flex-col gap-1">
          <h3 className="text-sm font-semibold">{item.name}</h3>
          <CategoryBadge category={item.category} />
        </div>

        <DotMenu onView={onView} onDelete={onDelete} />
      </div>

      <p className="flex-1 text-xs text-gray-500">
        {item.description}
      </p>

      <div className="h-1.5 bg-gray-100 rounded overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex justify-between text-xs text-gray-400">
        <div className="flex items-center gap-1">
          <Icons name="download" size={12} />
          {downloads}
        </div>
        <span>{item.createdOn}</span>
      </div>
    </div>
  );
};

export default LibraryCard;