// components/features/KeyStore/ProviderBadge.jsx
const providerStyles = {
  OpenAI: "bg-green-100 text-green-600",
  Anthropic: "bg-orange-100 text-orange-600",
  Stripe: "bg-indigo-100 text-indigo-600",
  AWS: "bg-yellow-100 text-yellow-600",
  GitHub: "bg-gray-200 text-gray-700",
  SendGrid: "bg-blue-100 text-blue-600",
  Custom: "bg-gray-100 text-gray-500",
};

const ProviderBadge = ({ provider }) => (
  <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded-full ${providerStyles[provider] || "bg-gray-100 text-gray-500"}`}>
    <span className="w-2 h-2 bg-current rounded-full" />
    {provider}
  </span>
);

export default ProviderBadge;