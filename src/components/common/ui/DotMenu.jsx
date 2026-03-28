import { useState } from "react";
import Icons from "../icons/Icons";

const DotMenu = ({ onView, onEdit, onDelete }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen((o) => !o);
        }}
        className="p-1 rounded hover:bg-gray-100"
      >
        <Icons name="moreVertical" size={16} />
      </button>

      {open && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />

          {/* Menu */}
          <div className="absolute right-0 z-50 overflow-hidden bg-white border rounded-lg shadow-lg top-8 w-36">
            {onView && <MenuItem label="View" onClick={onView} />}
            {onEdit && <MenuItem label="Edit" onClick={onEdit} />}
            {onDelete && (
              <MenuItem label="Delete" onClick={onDelete} danger />
            )}
          </div>
        </>
      )}
    </div>
  );
};

const MenuItem = ({ label, onClick, danger }) => (
  <div
    onClick={(e) => {
      e.stopPropagation();
      onClick();
    }}
    className={`px-3 py-2 text-sm cursor-pointer ${
      danger ? "text-red-500 hover:bg-red-50" : "hover:bg-gray-50"
    }`}
  >
    {label}
  </div>
);

export default DotMenu;