import { useState, useRef, useEffect } from "react";
import { MoreVertical } from "lucide-react";
import StatusBadge from "../../common/ui/StatusBadge";

const AgentCard = ({ item, onView, onEdit, onDelete }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return (
    <div className="relative group flex flex-col rounded-xl border border-gray-200 bg-white p-5 transition-all hover:shadow-md hover:-translate-y-[2px]">

      {/* HEADER */}
      <div className="flex items-start justify-between">
        <h3 className="text-sm font-semibold text-gray-900">
          {item.name}
        </h3>

        {/* DOT MENU */}
        <div ref={ref} className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setOpen((prev) => !prev);
            }}
            className="p-1 text-gray-400 rounded hover:bg-gray-100 hover:text-gray-600"
          >
            <MoreVertical size={18} />
          </button>

          {/* DROPDOWN */}
          {open && (
            <div className="absolute right-0 z-20 w-32 mt-2 bg-white border rounded-md shadow-lg">
              <button
                onClick={() => {
                  setOpen(false);
                  onView();
                }}
                className="w-full px-3 py-2 text-sm text-left hover:bg-gray-50"
              >
                View
              </button>

              <button
                onClick={() => {
                  setOpen(false);
                  onEdit();
                }}
                className="w-full px-3 py-2 text-sm text-left hover:bg-gray-50"
              >
                Edit
              </button>

              <button
                onClick={() => {
                  setOpen(false);
                  onDelete();
                }}
                className="w-full px-3 py-2 text-sm text-left text-red-600 hover:bg-red-50"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* DESCRIPTION */}
      <p className="mt-2 text-sm text-gray-600 line-clamp-2">
        {item.description}
      </p>

      {/* META */}
      <div className="flex items-center gap-2 mt-3 text-xs text-gray-500">
        <span>{item.type}</span>
        <span>•</span>
        <span>{item.model}</span>
      </div>

      {/* STATUS */}
      <div className="mt-3">
        <StatusBadge status={item.status} />
      </div>

      {/* FOOTER */}
      <div className="pt-3 mt-auto text-xs text-gray-400 border-t">
        Created On:{" "}
        <span className="font-medium text-gray-700">
          {item.createdOn}
        </span>
      </div>
    </div>
  );
};

export default AgentCard;