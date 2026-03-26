import { sidebarSections } from '../data/sidebarData';
import SidebarItem from './SidebarItem';

const Sidebar = ({ activeItem, onItemClick }) => {
  return (
    <aside className="fixed left-0 top-14 bottom-0 w-[200px] bg-sidebar-bg border-r border-card-border overflow-y-auto py-4 z-40">
      {sidebarSections.map((section, sectionIndex) => (
        <div key={sectionIndex} className="mb-2">
          {/* Section Title */}
          {section.title && (
            <h3 className="px-4 py-2 text-[11px] font-semibold text-text-muted uppercase tracking-wide">
              {section.title}
            </h3>
          )}

          {/* Section Items */}
          <div className="flex flex-col gap-0.5">
            {section.items.map((item) => (
              <SidebarItem
                key={item.id}
                icon={item.icon}
                label={item.label}
                isActive={activeItem === item.id}
                onClick={() => onItemClick(item.id)}
              />
            ))}
          </div>
        </div>
      ))}
    </aside>
  );
};

export default Sidebar;
