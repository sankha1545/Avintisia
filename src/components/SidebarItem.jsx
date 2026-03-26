const SidebarItem = ({ icon: Icon, label, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-2 text-sm rounded-r-lg transition-all duration-150 cursor-pointer
        ${
          isActive
            ? 'bg-active-bg text-primary font-medium border-l-[3px] border-primary'
            : 'text-text-secondary hover:bg-gray-50 border-l-[3px] border-transparent'
        }
      `}
    >
      <Icon
        size={18}
        className={isActive ? 'text-primary' : 'text-text-secondary'}
        strokeWidth={isActive ? 2 : 1.75}
      />
      <span>{label}</span>
    </button>
  );
};

export default SidebarItem;
