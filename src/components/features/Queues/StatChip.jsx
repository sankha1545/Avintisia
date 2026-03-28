// components/features/Queues/StatChip.jsx

const StatChip = ({ label, value, color }) => (
  <div className="flex flex-col items-center flex-1 p-2 rounded-lg bg-gray-50">
    <span className="text-lg font-bold" style={{ color }}>
      {value}
    </span>
    <span className="text-[11px] text-gray-400">{label}</span>
  </div>
);

export default StatChip;