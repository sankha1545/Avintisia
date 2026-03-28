// components/features/Library/CategoryBadge.jsx
const categoryStyles = {
  NLP: "bg-blue-100 text-blue-600",
  Vision: "bg-green-100 text-green-600",
  Automation: "bg-purple-100 text-purple-600",
  Audio: "bg-orange-100 text-orange-600",
  Data: "bg-yellow-100 text-yellow-600",
};

const CategoryBadge = ({ category }) => (
  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${categoryStyles[category] || "bg-gray-100 text-gray-500"}`}>
    {category}
  </span>
);

export default CategoryBadge;