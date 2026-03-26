import { Search, Bell, ChevronDown } from 'lucide-react';

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 h-14 bg-secondary flex items-center justify-between px-4 z-50">
      {/* Left Section - Logo & Workspace */}
      <div className="flex items-center gap-3">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"
                fill="white"
              />
            </svg>
          </div>
          <span className="text-white font-semibold text-base">Worcspace</span>
        </div>

        {/* Workspace Badge */}
        <div className="flex items-center gap-1 bg-workspace-badge text-white text-xs font-medium px-2.5 py-1 rounded-xl cursor-pointer">
          <span>Worcspace 1</span>
          <ChevronDown size={12} />
        </div>
      </div>

      {/* Center Section - Search */}
      <div className="flex items-center bg-white/10 rounded-lg px-3 py-1.5 w-72">
        <Search size={16} className="text-white/50 mr-2" />
        <input
          type="text"
          placeholder="Search..."
          className="bg-transparent text-white/80 placeholder-white/40 text-sm outline-none w-full"
        />
        <div className="flex items-center gap-0.5 text-white/40 text-xs ml-2 bg-white/10 px-1.5 py-0.5 rounded">
          <span>&#8984;K</span>
        </div>
      </div>

      {/* Right Section - Notifications & Avatar */}
      <div className="flex items-center gap-4">
        <button className="text-white/70 hover:text-white transition-colors">
          <Bell size={20} />
        </button>
        <div className="w-8 h-8 rounded-full bg-avatar flex items-center justify-center text-white text-xs font-semibold cursor-pointer">
          OK
        </div>
      </div>
    </header>
  );
};

export default Header;
