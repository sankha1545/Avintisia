import { useState } from "react";
import DotMenu from "../../common/ui/DotMenu";
import Icons from "../../common/icons/Icons";
import TypeBadge from "./TypeBadge";

const VaultCard = ({ item, onDelete, onCopy }) => {
  const [revealed, setRevealed] = useState(false);

  if (!item) return null;

  return (
    <div className="flex flex-col gap-3 p-4 bg-white border rounded-xl">

      <div className="flex justify-between">
        <div>
          <h3 className="text-sm font-semibold">{item.name}</h3>
          <TypeBadge type={item.type} />
        </div>

        <DotMenu
          onDelete={onDelete}
          extra={[{ label: "Copy", action: onCopy }]}
        />
      </div>

      <p className="text-xs text-gray-500">{item.description}</p>

      <div className="flex items-center justify-between px-3 py-2 bg-gray-100 rounded">
        <span className="font-mono text-xs">
          {revealed ? item.secretValue : "••••••••"}
        </span>

        <button onClick={() => setRevealed(!revealed)}>
          <Icons name={revealed ? "eyeOff" : "eye"} size={14} />
        </button>
      </div>

      <div className="flex justify-between text-xs text-gray-400">
        <span>{item.lastAccessed}</span>
        <span>{item.createdOn}</span>
      </div>

    </div>
  );
};

export default VaultCard;