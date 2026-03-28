const statusColors = {
  active: "bg-green-100 text-green-600",
  idle: "bg-yellow-100 text-yellow-600",
  stopped: "bg-gray-100 text-gray-500",
  running: "bg-blue-100 text-blue-600",
  failed: "bg-red-100 text-red-500",
};

const StatusBadge = ({ status }) => {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
        statusColors[status] || "bg-gray-100 text-gray-500"
      }`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
};

export default StatusBadge;