// components/features/Machines/MetricBar.jsx
const MetricBar = ({ value }) => {
  const pct = parseInt(value) || 0;

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-gray-100 rounded overflow-hidden">
        <div
          className={`h-full ${
            pct > 80 ? "bg-red-500" : pct > 60 ? "bg-yellow-500" : "bg-blue-500"
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="w-8 text-xs text-right text-gray-500">{value}</span>
    </div>
  );
};

export default MetricBar;