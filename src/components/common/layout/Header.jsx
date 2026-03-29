"use client";

import { useEffect, useState, useRef } from "react";
import { Search, Bell, ChevronDown, Menu, X } from "lucide-react";

export default function Header({ onMenuClick, isSidebarOpen }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const dropdownRef = useRef(null);
  const searchRef = useRef(null);

  // CMD + K shortcut
  useEffect(() => {
    const handleKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  // Click outside dropdown
  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    window.addEventListener("mousedown", handleClick);
    return () => window.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <header
  className="fixed top-0 left-0 right-0 z-[60] h-[56px] flex items-center px-2 sm:px-4 border-b border-white/10 text-white"
  style={{
    backgroundColor: "var(--color-header1)",
    backgroundImage:
      "linear-gradient(to right, var(--color-header1), var(--color-header2))",
  }}
>
  {/* LEFT */}
  <div className="flex items-center gap-2 shrink-0">
    <button className="lg:hidden" onClick={onMenuClick}>
      {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
    </button>

    <div className="flex items-center gap-2">
      <div className="overflow-hidden rounded-full w-7 h-7">
        <img src="/logo.png" className="w-full h-full object-contain p-[2px]" />
      </div>
      <span className="hidden text-sm font-semibold sm:block">
        Worcspace
      </span>
    </div>
  </div>

  {/* CENTER */}
  <div className="flex justify-center flex-1 min-w-0 px-2">
    <div
      className={`
        w-full transition-all duration-300
        ${isSearchFocused ? "max-w-[500px]" : "max-w-[180px] sm:max-w-[300px] md:max-w-[420px]"}
      `}
    >
      <div className="flex items-center w-full h-[34px] bg-white/10 rounded-md px-2 sm:px-3 gap-2 overflow-hidden">
        <Search size={16} className="text-white/40 shrink-0" />

       <input
  ref={searchRef}
  type="text"
  placeholder="Search..."
  onFocus={() => setIsSearchFocused(true)}
  onBlur={() => setIsSearchFocused(false)}
  className="flex-1 min-w-0 text-sm truncate bg-transparent outline-none placeholder-white/30"
/>

        <span className="hidden sm:block text-[11px] text-white/40">
          ⌘K
        </span>
      </div>
    </div>
  </div>

  {/* RIGHT */}
  <div className="flex items-center gap-2 sm:gap-4 shrink-0">
    <button className="relative text-white/70 hover:text-white">
      <Bell size={18} />
      <span className="absolute w-2 h-2 bg-red-500 rounded-full -top-1 -right-1" />
    </button>

    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsDropdownOpen((prev) => !prev)}
        className="flex items-center justify-center w-8 h-8 text-xs font-semibold bg-indigo-500 rounded-full"
      >
        GK
      </button>

      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-44 bg-[#2a2550] border border-white/10 rounded-lg shadow-lg p-2 text-sm z-[65]">
          <button className="w-full px-3 py-2 text-left rounded hover:bg-white/10">
            Profile
          </button>
          <button className="w-full px-3 py-2 text-left rounded hover:bg-white/10">
            Settings
          </button>
          <button className="w-full px-3 py-2 text-left text-red-400 rounded hover:bg-red-500/20">
            Logout
          </button>
        </div>
      )}
    </div>
  </div>
</header>
  );
}