"use client";

import { X } from "lucide-react";
import { NavLink } from "react-router-dom";
import { sidebarSections } from "../../../data/sidebarData";

export default function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {/* OVERLAY */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[50] bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed left-0 w-64 bg-white border-r z-[55]
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}

          top-[52px] h-[calc(100vh-52px)]

          lg:translate-x-0
          lg:static lg:h-auto lg:top-0
        `}
      >
        <div className="flex flex-col h-full">

          {/* MOBILE HEADER */}
          <div className="flex items-center justify-between px-4 border-b h-14 lg:hidden">
            <span className="font-semibold text-gray-800">Menu</span>
            <X onClick={onClose} className="w-5 h-5 cursor-pointer" />
          </div>

          {/* CONTENT */}
          <div className="flex-1 pt-3 pb-6 overflow-y-auto">
            {sidebarSections.map((section, i) => (
              <div key={i} className="mb-6">
                <h3 className="px-4 mb-2 text-[10px] font-semibold text-gray-400 uppercase">
                  {section.title}
                </h3>

                <div className="space-y-2">
                  {section.items.map((item) => (
                    <NavLink
                      key={item.id}
                      to={item.path}
                      onClick={onClose}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-3 sm:py-2.5 text-[13.5px] rounded-lg border-l-4 ${
                          isActive
                            ? "text-indigo-600 bg-indigo-50 border-indigo-600"
                            : "text-gray-600 hover:bg-gray-50 border-transparent"
                        }`
                      }
                    >
                      {item.isImage ? (
                        <img src={item.icon} className="w-4 h-4" />
                      ) : (
                        <item.icon className="w-4 h-4" />
                      )}
                      {item.label}
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