"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { NavLink } from "react-router-dom";
import { sidebarSections } from "../../../data/sidebarData";

const HEADER_HEIGHT = 52;

export default function Sidebar({ isOpen, onClose }) {

  // ✅ Close on ESC key (accessibility)
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      window.addEventListener("keydown", handleEsc);
    }

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, onClose]);

  return (
    <>
      {/* OVERLAY */}
      <div
        className={`
          fixed inset-0 z-[50] bg-black/40 backdrop-blur-sm lg:hidden
          transition-opacity duration-300
          ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}
        `}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* SIDEBAR */}
      <aside
        className={`
          fixed left-0 w-64 bg-white border-r z-[55]
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}

          lg:translate-x-0
          lg:static lg:h-auto lg:top-0
        `}
        style={{
          top: HEADER_HEIGHT,
          height: `calc(100vh - ${HEADER_HEIGHT}px)`
        }}
      >
        <div className="flex flex-col h-full">

          {/* MOBILE HEADER */}
          <div className="flex items-center justify-between px-4 border-b h-14 lg:hidden">
            <span className="font-semibold text-gray-800">Menu</span>

            {/* ✅ Accessible button */}
            <button
              onClick={onClose}
              className="p-1 rounded hover:bg-gray-100"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* CONTENT */}
          <div className="flex-1 pt-3 pb-6 overflow-y-auto scroll-smooth">

            {sidebarSections.map((section) => (
              <div key={section.title} className="mb-6">

                {/* SECTION TITLE */}
                <h3 className="px-4 mb-2 text-[10px] font-semibold text-gray-400 uppercase tracking-wide">
                  {section.title}
                </h3>

                <div className="space-y-1">
                  {section.items.map((item) => (
                    <NavLink
                      key={item.id}
                      to={item.path}
                      onClick={onClose}
                      className={({ isActive }) =>
                        `
                        flex items-center gap-3 px-4 py-3 sm:py-2.5 text-[13.5px]
                        rounded-lg border-l-4 transition-all duration-200

                        ${isActive
                          ? "text-indigo-600 bg-indigo-50 border-indigo-600 shadow-sm"
                          : "text-gray-600 hover:bg-gray-50 border-transparent hover:pl-5"
                        }
                        `
                      }
                    >
                      {/* ICON */}
                      {item.isImage ? (
                        <img
                          src={item.icon}
                          alt={item.label}
                          className="w-4 h-4"
                        />
                      ) : item.icon ? (
                        <item.icon className="w-4 h-4" />
                      ) : null}

                      {/* LABEL */}
                      <span className="truncate">{item.label}</span>
                    </NavLink>
                  ))}
                </div>
              </div>
            ))}

          </div>
        </div>
      </aside>
    </>
  );
}