// components/features/Tenant/MemberRow.jsx

const MemberRow = ({
  name = "Unknown",
  role = "Member",
  email = "—",
  onRemove,
}) => {
  // 🔤 Avatar initial
  const initial = name?.charAt(0)?.toUpperCase() || "?";

  // 🎨 Role styles (scalable)
  const roleStyles = {
    Admin: "bg-blue-100 text-blue-600",
    Member: "bg-gray-100 text-gray-500",
    Viewer: "bg-yellow-100 text-yellow-600",
  };

  return (
    <div className="flex items-center justify-between py-2 border-b last:border-none">

      {/* LEFT */}
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div className="flex items-center justify-center text-xs font-bold text-white bg-blue-600 rounded-md w-9 h-9">
          {initial}
        </div>

        {/* Info */}
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">
            {name}
          </p>
          <p className="text-xs text-gray-400 truncate">
            {email}
          </p>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-2">

        {/* Role Badge */}
        <span
          className={`px-2 py-0.5 text-xs rounded-full ${
            roleStyles[role] || "bg-gray-100 text-gray-500"
          }`}
        >
          {role}
        </span>

        {/* Remove Button */}
        <button
          onClick={onRemove}
          aria-label={`Remove ${name}`}
          className="text-red-500 transition hover:text-red-600"
        >
          🗑
        </button>

      </div>
    </div>
  );
};

export default MemberRow;