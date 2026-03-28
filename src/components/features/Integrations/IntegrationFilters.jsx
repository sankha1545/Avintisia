// components/features/Integrations/IntegrationFilters.jsx
const IntegrationFilters = ({ value, onChange }) => {
  const tabs = ["All", "Connected", "Not Connected"];

  return (
    <div className="flex items-center gap-6 overflow-x-auto border-b border-gray-200">
      {tabs.map((tab) => {
        const active = value === tab;

        return (
          <button
            key={tab}
            onClick={() => onChange(tab)}
            className={`relative pb-2 text-sm font-medium ${
              active
                ? "text-gray-900"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            {tab}
            {active && (
              <span className="absolute left-0 bottom-0 h-[2px] w-full bg-blue-600 rounded-full" />
            )}
          </button>
        );
      })}
    </div>
  );
};

export default IntegrationFilters;