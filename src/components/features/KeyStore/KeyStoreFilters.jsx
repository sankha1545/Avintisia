// components/features/KeyStore/KeyStoreFilters.jsx
const KeyStoreFilters = ({ providers, providerFilter, setProviderFilter, setPage, data }) => (
  <div className="flex flex-wrap items-center justify-between gap-2">

    <div className="flex flex-wrap gap-2">
      {providers.map((p) => (
        <button
          key={p}
          onClick={() => {
            setProviderFilter(p);
            setPage(1);
          }}
          className={`px-3 py-1 rounded-full text-sm border ${
            providerFilter === p
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-white text-gray-500 border-gray-200"
          }`}
        >
          {p}
        </button>
      ))}
    </div>

    <div className="flex gap-4 text-sm text-gray-500">
      <span>
        <strong>{data.filter((d) => d.status === "active").length}</strong> Active
      </span>
      <span>
        <strong>{data.filter((d) => d.status === "expired").length}</strong> Expired
      </span>
    </div>
  </div>
);

export default KeyStoreFilters;