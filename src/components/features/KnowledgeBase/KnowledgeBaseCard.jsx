"use client";

import { MoreVertical } from "lucide-react";

export default function KnowledgeBaseCard({
  title = "Test",
  description = "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
  createdOn = "14/07/2025",
  onCardClick,
  onMenuClick,
  className = "",
}) {
  return (
    <article
      role={onCardClick ? "button" : undefined}
      tabIndex={onCardClick ? 0 : undefined}
      onClick={onCardClick}
      onKeyDown={(e) => {
        if ((e.key === "Enter" || e.key === " ") && onCardClick) {
          e.preventDefault();
          onCardClick(e);
        }
      }}
      className={[
        "group flex w-full flex-col rounded-xl border border-gray-200 bg-white",
        "p-4 sm:p-5",
        "transition-all duration-200",
        "hover:shadow-md hover:border-gray-300 hover:-translate-y-[2px]",
        "active:scale-[0.99]",
        "focus:outline-none focus:ring-2 focus:ring-indigo-500/20",
        "min-h-[180px] sm:min-h-[200px] lg:min-h-[210px]",
        className,
      ].join(" ")}
    >
      {/* HEADER */}
      <div className="flex items-start justify-between gap-2">
        <h3 className="flex-1 min-w-0 text-[14px] sm:text-[15px] font-semibold text-gray-900 leading-snug break-words">
          {title}
        </h3>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onMenuClick?.(e);
          }}
          className="flex items-center justify-center w-8 h-8 text-gray-400 transition rounded-md hover:bg-gray-100 hover:text-gray-600"
        >
          <MoreVertical size={18} />
        </button>
      </div>

      {/* DESCRIPTION */}
      <p className="mt-2 text-[12.5px] sm:text-sm text-gray-600 leading-relaxed line-clamp-2 sm:line-clamp-3">
        {description}
      </p>

      {/* FOOTER */}
      <div className="pt-3 mt-auto">
        <div className="h-px bg-gray-100" />

        <p className="pt-2 text-[11.5px] sm:text-xs text-gray-400">
          Created On:{" "}
          <span className="font-medium text-gray-700">
            {createdOn}
          </span>
        </p>
      </div>
    </article>
  );
}