"use client";

import { useEffect, useState, useRef } from "react";
import { Search, Bell, ChevronDown, Menu } from "lucide-react";

export default function Header({ onMenuClick }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // ⌘K shortcut
  useEffect(() => {
    const handleKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  // close dropdown on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 h-[52px] border-b border-white/10 px-4 flex items-center justify-between"
      
      // 🔥 CRITICAL FIX: force gradient using inline style
      style={{
        background: "linear-gradient(to right, var(--color-header1), var(--color-header2))",
      }}
    >
      {/* LEFT */}
      <div className="flex items-center gap-3">
        {/* Mobile Hamburger */}
        <button className="lg:hidden text-white" onClick={onMenuClick}>
          <Menu size={20} />
        </button>

        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-12 rounded-full flex items-center justify-center overflow-hidden ">
            <img
              src="/logo.png"
              alt="Logo"
              className="w-full h-full object-contain p-[2px]"
            />
          </div>

          <span className="text-white text-sm font-semibold hidden sm:block">
            Worcspace
          </span>
        </div>

        {/* Workspace Switch */}
        <button className="hidden sm:flex items-center gap-1.5 bg-[--color-header3] hover:bg-white/20 px-3 py-1 rounded-full text-xs text-white transition">
          Worcspace 1
          <ChevronDown size={12} />
        </button>
      </div>

      {/* CENTER SEARCH */}
      <div className="flex-1 flex justify-center px-4">
        <div className="hidden md:flex items-center w-full max-w-[420px] h-[34px] bg-[--color-search] rounded-md px-3 gap-2">
          <Search size={15} className="text-white/40" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent outline-none text-sm text-white placeholder-white/30 flex-1"
          />
          <span className="text-[11px] px-2 py-[2px] text-white/40 rounded">
            ⌘K
          </span>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4">
        {/* Notification */}
        <button className="relative text-white/70 hover:text-white transition">
          <Bell size={18} />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* Avatar */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-8 h-8 rounded-full bg-indigo-500 text-white text-xs font-semibold flex items-center justify-center"
          >
            GK
          </button>

          {/* Dropdown */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-44 bg-[#2a2550] border border-white/10 rounded-lg shadow-lg p-2 text-sm text-white animate-in fade-in zoom-in-95">
              <button className="block w-full text-left px-3 py-2 hover:bg-white/10 rounded">
                Profile
              </button>
              <button className="block w-full text-left px-3 py-2 hover:bg-white/10 rounded">
                Settings
              </button>
              <button className="block w-full text-left px-3 py-2 hover:bg-red-500/20 text-red-400 rounded">
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}