import Icons from "../icons/Icons";

const EmptyState = ({ title, subtitle, action }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16">
      <div className="flex items-center justify-center bg-gray-100 rounded-full w-14 h-14">
        <Icons name="search" size={20} className="text-gray-400" />
      </div>

      <div className="text-center">
        <p className="font-semibold text-gray-700">{title}</p>
        {subtitle && (
          <p className="mt-1 text-sm text-gray-400">{subtitle}</p>
        )}
      </div>

      {action}
    </div>
  );
};

export default EmptyState;