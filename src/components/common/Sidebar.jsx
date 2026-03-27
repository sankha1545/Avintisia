"use client";

import { Menu, X } from "lucide-react";
import { NavLink } from "react-router-dom";
import {  sidebarSections } from "../../data/sidebarData";

export default function Sidebar({ isOpen, onClose, onOpen }) {
  return (
    <>
      {/* 🔷 MOBILE TOP BAR */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-white border-b flex items-center px-4 z-50">
        <button onClick={onOpen}>
          <Menu className="w-6 h-6 text-gray-700" />
        </button>
        <span className="ml-4 font-semibold text-gray-800">
          Workspace
        </span>
      </div>

      {/* 🔷 OVERLAY */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* 🔷 SIDEBAR */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-white border-r z-50
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:top-[52px] lg:h-[calc(100vh-52px)]
          lg:translate-x-0 lg:static
        `}
      >
        <div className="flex flex-col h-full">

          {/* 🔷 MOBILE HEADER */}
          <div className="lg:hidden flex justify-between items-center px-4 h-14 border-b">
            <span className="font-semibold text-gray-800">Menu</span>
            <X
              onClick={onClose}
              className="w-5 h-5 cursor-pointer text-gray-600"
            />
          </div>

          {/* 🔷 SCROLL AREA */}
          <div className="flex-1 overflow-y-auto pt-3 pb-6">

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
                      end
                      onClick={onClose}
                      className={({ isActive }) =>
                        `
                        w-full flex items-center gap-3 px-4 py-3 sm:py-2.5
                        text-[13.5px] rounded-lg transition-all border-l-4
                        ${
                          isActive
                            ? "text-indigo-600 bg-indigo-50 border-indigo-600"
                            : "text-gray-600 hover:bg-gray-50 border-transparent"
                        }
                      `
                      }
                    >
                      {item.isImage ? (
                        <img
                          src={item.icon}
                          alt={item.label}
                          className="w-4 h-4"
                        />
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