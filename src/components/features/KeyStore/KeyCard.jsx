// components/features/KeyStore/KeyCard.jsx

import { useState } from "react";
import DotMenu from "../../common/ui/DotMenu";
import StatusBadge from "../../common/ui/StatusBadge";
import Icons from "../../common/icons/Icons";
import ProviderBadge from "./ProviderBadge";

const KeyCard = ({ item, onDelete, onRotate }) => {
  const [revealed, setRevealed] = useState(false);

  const apiKey = item?.apiKey || "sk-xxxx";

  return (
    <div className="flex flex-col gap-3 p-4 transition bg-white border rounded-xl hover:shadow-md">

      <div className="flex justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Icons name="key" size={14} />
            <h3 className="text-sm font-semibold">{item.name}</h3>
          </div>
          <ProviderBadge provider={item.provider} />
        </div>

        <DotMenu
          onDelete={onDelete}
          extra={[{ label: "Rotate", action: onRotate }]}
        />
      </div>

      <p className="text-xs text-gray-500">{item.description}</p>

      <div className="flex items-center justify-between px-3 py-2 bg-gray-100 rounded">
        <span className="font-mono text-xs text-gray-600 truncate">
          {revealed ? apiKey : "••••••••••••••••••"}
        </span>

        <button onClick={() => setRevealed((prev) => !prev)}>
          <Icons name={revealed ? "eyeOff" : "eye"} size={14} />
        </button>
      </div>

      <div className="flex items-center justify-between text-xs text-gray-400">
        <StatusBadge status={item.status} />
        <span>Created: {item.createdOn}</span>
      </div>
    </div>
  );
};

export default KeyCard;