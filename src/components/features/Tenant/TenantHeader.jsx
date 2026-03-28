// components/features/Tenant/TenantHeader.jsx

const TenantHeader = ({ title = "Tenant", subtitle }) => {
  return (
    <div className="flex flex-col gap-1">

      {/* TITLE */}
      <h1 className="text-xl font-bold text-gray-900">
        {title}
      </h1>

      {/* OPTIONAL SUBTITLE */}
      {subtitle && (
        <p className="text-sm text-gray-500">
          {subtitle}
        </p>
      )}

    </div>
  );
};

export default TenantHeader;