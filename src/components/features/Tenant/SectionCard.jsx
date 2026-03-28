// components/features/Tenant/SectionCard.jsx

import Icons from "../../common/icons/Icons";

const SectionCard = ({ title, icon, children }) => (
  <div className="overflow-hidden bg-white border rounded-xl">
    <div className="flex items-center gap-2 px-5 py-3 border-b bg-gray-50">
      <Icons name={icon} size={14} />
      <span className="text-sm font-semibold">{title}</span>
    </div>
    <div className="p-5">{children}</div>
  </div>
);

export default SectionCard;