const styles = {
  "API Key": "bg-blue-100 text-blue-600",
  Password: "bg-purple-100 text-purple-600",
  Token: "bg-green-100 text-green-600",
  Certificate: "bg-orange-100 text-orange-600",
};

const TypeBadge = ({ type }) => {
  return (
    <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${styles[type]}`}>
      {type}
    </span>
  );
};

export default TypeBadge;