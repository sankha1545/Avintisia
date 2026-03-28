import Icons from "../../common/icons/Icons";

const styles = {
  Schedule: "bg-blue-100 text-blue-600",
  Webhook: "bg-purple-100 text-purple-600",
  Event: "bg-orange-100 text-orange-600",
};

const TypeBadge = ({ type }) => {
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${styles[type] || "bg-gray-100 text-gray-500"}`}>
      <Icons name="activity" size={10} />
      {type}
    </span>
  );
};

export default TypeBadge;