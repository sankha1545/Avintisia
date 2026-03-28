// components/features/Tenant/InfoRow.jsx

const InfoRow = ({ label, value }) => (
  <div className="flex justify-between py-2 border-b last:border-none">
    <span className="text-sm text-gray-500">{label}</span>
    <span className="text-sm font-medium">{value}</span>
  </div>
);

export default InfoRow;