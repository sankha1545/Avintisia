"use client";

import { useEffect, useState, useRef } from "react";
import { Search, Bell, ChevronDown, Menu, X } from "lucide-react";

export default function Header({ onMenuClick, isSidebarOpen }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // CMD + K
  useEffect(() => {
    const handleKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
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
      className="fixed top-0 left-0 right-0 z-[60] h-[52px] flex items-center justify-between px-3 sm:px-4 border-b border-white/10 text-white"
      style={{
        backgroundColor: "var(--color-header1)",
        backgroundImage:
          "linear-gradient(to right, var(--color-header1), var(--color-header2))",
      }}
    >
      {/* LEFT */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* 🔥 TOGGLE ICON */}
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

        <button className="hidden sm:flex items-center gap-1.5 bg-white/10 hover:bg-white/20 px-3 py-1 rounded-full text-xs">
          Worcspace 1
          <ChevronDown size={12} />
        </button>
      </div>

      {/* CENTER */}
      <div className="flex justify-center flex-1 px-2 sm:px-4">
        <div className="hidden md:flex items-center w-full max-w-[420px] h-[34px] bg-white/10 rounded-md px-3 gap-2">
          <Search size={15} className="text-white/40" />
          <input className="flex-1 text-sm bg-transparent outline-none placeholder-white/30" />
          <span className="text-[11px] text-white/40">⌘K</span>
        </div>

        <button className="md:hidden text-white/70">
          <Search size={18} />
        </button>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-3 sm:gap-4">
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
              <button className="w-full px-3 py-2 text-left rounded hover:bg-white/10">Profile</button>
              <button className="w-full px-3 py-2 text-left rounded hover:bg-white/10">Settings</button>
              <button className="w-full px-3 py-2 text-left text-red-400 rounded hover:bg-red-500/20">Logout</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}