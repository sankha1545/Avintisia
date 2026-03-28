// components/features/Integrations/IntegrationCard.jsx
import Button from "../../common/ui/Button";

const IntegrationCard = ({ item, onConfigure, onDisconnect }) => {
  const connected = item.status === "connected";

  return (
    <div
      className={`p-4 rounded-xl border transition hover:shadow-md ${
        connected ? "border-green-200" : "border-gray-200"
      }`}
    >
      <div className="flex justify-between">
        <div className="flex gap-3">
          <div className="flex items-center justify-center text-xl bg-gray-100 rounded-lg w-11 h-11">
            {item.icon}
          </div>
          <div>
            <p className="text-sm font-semibold">{item.name}</p>
            <p className="text-xs text-gray-400">{item.category}</p>
          </div>
        </div>

        <span
          className={`text-xs px-2 py-0.5 rounded-full ${
            connected
              ? "bg-green-100 text-green-600"
              : "bg-gray-100 text-gray-400"
          }`}
        >
          {connected ? "Connected" : "Not Connected"}
        </span>
      </div>

      <p className="mt-2 text-xs text-gray-500">{item.description}</p>

      <div className="mt-3">
        {connected ? (
          <div className="flex gap-2">
            <Button size="sm" variant="ghost" onClick={() => onConfigure(item)}>
              Configure
            </Button>

            <Button
              size="sm"
              variant="danger"
              onClick={() => onDisconnect(item)}
            >
              Disconnect
            </Button>
          </div>
        ) : (
          <Button size="sm" className="w-full" onClick={() => onConfigure(item)}>
            Connect
          </Button>
        )}
      </div>
    </div>
  );
};

export default IntegrationCard;