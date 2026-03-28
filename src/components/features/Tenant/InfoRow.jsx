// components/features/Tenant/InfoRow.jsx

const InfoRow = ({ label, value }) => {
  const isEmpty =
    value === undefined ||
    value === null ||
    value === "";

  return (
    <div className="flex items-center justify-between py-2">

      {/* LABEL */}
      <span className="text-sm text-gray-500">
        {label}
      </span>

      {/* VALUE */}
      <div className="text-sm font-medium text-right text-gray-900">
        {isEmpty ? "—" : value}
      </div>

    </div>
  );
};

export default InfoRow;