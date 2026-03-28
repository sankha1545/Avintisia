const Toggle = ({ enabled, onToggle }) => {
  return (
    <div
      onClick={onToggle}
      className={`w-10 h-5 flex items-center rounded-full cursor-pointer transition ${
        enabled ? "bg-blue-600" : "bg-gray-300"
      }`}
    >
      <div
        className={`w-4 h-4 bg-white rounded-full shadow transform transition ${
          enabled ? "translate-x-5" : "translate-x-1"
        }`}
      />
    </div>
  );
};

export default Toggle;