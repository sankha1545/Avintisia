// src/components/common/CardGridPage.jsx
// Generic card-grid layout identical to KnowledgeBase style
import { useState, useMemo } from "react";
import Icons from "./Icons";
import SearchInput from "./SearchInput";
import Button from "./Button";
import Pagination from "./Pagination";

// ── Status Badge ────────────────────────────────────────────────────────────
const statusColors = {
  active: "#10b981", idle: "#f59e0b", stopped: "#6b7280", running: "#4f6ef7",
  pending: "#f59e0b", completed: "#10b981", failed: "#ef4444", queued: "#8b5cf6",
  live: "#10b981", draft: "#9ca3af", enabled: "#10b981", disabled: "#6b7280",
  connected: "#10b981", disconnected: "#9ca3af", success: "#10b981",
  expired: "#ef4444",
};

export const StatusBadge = ({ status }) => (
  <span style={{
    display: "inline-flex", alignItems: "center", gap: 5,
    fontSize: 11.5, fontWeight: 500, padding: "2px 8px", borderRadius: 20,
    background: (statusColors[status] || "#9ca3af") + "18",
    color: statusColors[status] || "#9ca3af",
    textTransform: "capitalize",
  }}>
    <span style={{ width: 6, height: 6, borderRadius: "50%", background: statusColors[status] || "#9ca3af" }} />
    {status}
  </span>
);

// ── Dot Menu ─────────────────────────────────────────────────────────────────
export const DotMenu = ({ onEdit, onDelete, onView, onCopy, extra = [] }) => {
  const [open, setOpen] = useState(false);
  const actions = [
    onView   && { label: "View",   icon: "eye",   action: onView },
    onEdit   && { label: "Edit",   icon: "edit",  action: onEdit },
    onCopy   && { label: "Copy",   icon: "copy",  action: onCopy },
    ...extra,
    onDelete && { label: "Delete", icon: "trash", action: onDelete, danger: true },
  ].filter(Boolean);

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={e => { e.stopPropagation(); setOpen(o => !o); }}
        style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: "#9ca3af", borderRadius: 4 }}
      >
        <Icons name="moreVertical" size={16} color="#9ca3af" />
      </button>
      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 90 }} />
          <div style={{
            position: "absolute", right: 0, top: 28, zIndex: 100,
            background: "#fff", border: "1px solid #e5e7eb", borderRadius: 8,
            boxShadow: "0 8px 24px rgba(0,0,0,0.12)", minWidth: 140, overflow: "hidden",
          }}>
            {actions.map(a => (
              <div
                key={a.label}
                onClick={e => { e.stopPropagation(); a.action(); setOpen(false); }}
                style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "9px 14px", fontSize: 13, cursor: "pointer",
                  color: a.danger ? "#ef4444" : "#374151",
                  transition: "background .1s",
                }}
                onMouseEnter={e => (e.currentTarget.style.background = "#f9fafb")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
              >
                <Icons name={a.icon} size={13} color={a.danger ? "#ef4444" : "#6b7280"} />
                {a.label}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

// ── Card ─────────────────────────────────────────────────────────────────────
export const Card = ({ title, description, meta = [], status, createdOn, onEdit, onDelete, onView, onCopy, extra = [] }) => (
  <div style={{
    background: "#fff", border: "1px solid #e8eaf2", borderRadius: 10,
    padding: "18px 18px 16px", display: "flex", flexDirection: "column",
    gap: 8, cursor: "default", transition: "box-shadow .2s",
    boxSizing: "border-box",
  }}
    onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.08)")}
    onMouseLeave={e => (e.currentTarget.style.boxShadow = "none")}
  >
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
      <span style={{ fontWeight: 600, fontSize: 14.5, color: "#1a1d2e" }}>{title}</span>
      <DotMenu onEdit={onEdit} onDelete={onDelete} onView={onView} onCopy={onCopy} extra={extra} />
    </div>
    <p style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.55, flex: 1 }}>{description}</p>
    {meta.length > 0 && (
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {meta.map((m, i) => (
          <span key={i} style={{
            fontSize: 11.5, background: "#f3f4f6", color: "#6b7280",
            padding: "2px 8px", borderRadius: 20, fontWeight: 500,
          }}>
            {m}
          </span>
        ))}
      </div>
    )}
    {status && <div style={{ marginTop: 2 }}><StatusBadge status={status} /></div>}
    <div style={{ marginTop: 4, fontSize: 12, color: "#9ca3af" }}>
      <span style={{ fontWeight: 500, color: "#d1d5db" }}>Created On: </span>
      {createdOn}
    </div>
  </div>
);

// ── Empty State ───────────────────────────────────────────────────────────────
export const EmptyState = ({ title = "No items found", subtitle, action }) => (
  <div style={{
    display: "flex", flexDirection: "column", alignItems: "center",
    justifyContent: "center", padding: "80px 24px", gap: 12,
  }}>
    <div style={{
      width: 56, height: 56, background: "#f3f4f6", borderRadius: "50%",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <Icons name="search" size={22} color="#9ca3af" />
    </div>
    <div style={{ textAlign: "center" }}>
      <p style={{ fontWeight: 600, fontSize: 15, color: "#374151" }}>{title}</p>
      {subtitle && <p style={{ fontSize: 13, color: "#9ca3af", marginTop: 4 }}>{subtitle}</p>}
    </div>
    {action}
  </div>
);

// ── Modal ─────────────────────────────────────────────────────────────────────
export const Modal = ({ title, onClose, children, width = 480 }) => (
  <div style={{
    position: "fixed", inset: 0, zIndex: 300,
    background: "rgba(0,0,0,0.45)", display: "flex",
    alignItems: "center", justifyContent: "center",
  }}
    onClick={onClose}
  >
    <div
      onClick={e => e.stopPropagation()}
      style={{
        background: "#fff", borderRadius: 12, width, maxWidth: "90vw",
        maxHeight: "90vh", overflow: "auto",
        boxShadow: "0 24px 60px rgba(0,0,0,0.25)",
      }}
    >
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "18px 22px 0",
      }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1a1d2e" }}>{title}</h3>
        <button
          onClick={onClose}
          style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af", padding: 4 }}
        >
          <Icons name="x" size={18} color="#9ca3af" />
        </button>
      </div>
      <div style={{ padding: "18px 22px 22px" }}>{children}</div>
    </div>
  </div>
);

// ── Main CardGridPage ─────────────────────────────────────────────────────────
const CardGridPage = ({
  title,
  subtitle,
  data,
  searchPlaceholder,
  searchKeys = ["name", "title", "description"],
  renderCard,
  createLabel = "+ Create New",
  onCreate,
  filterBar,
}) => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState(9);

  const filtered = useMemo(() => {
    if (!search.trim()) return data;
    const q = search.toLowerCase();
    return data.filter(item =>
      searchKeys.some(k => String(item[k] ?? "").toLowerCase().includes(q))
    );
  }, [search, data, searchKeys]);

  const paginated = filtered.slice((page - 1) * rows, page * rows);

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "28px 32px" }}>
      {/* Header */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        marginBottom: 24, gap: 16,
      }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#1a1d2e" }}>{title}</h1>
          {subtitle && <p style={{ fontSize: 13.5, color: "#6b7280", marginTop: 4 }}>{subtitle}</p>}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <SearchInput value={search} onChange={v => { setSearch(v); setPage(1); }} placeholder={searchPlaceholder} />
          {onCreate && (
            <Button variant="primary" icon="plus" onClick={onCreate}>{createLabel}</Button>
          )}
        </div>
      </div>

      {/* Optional filter bar */}
      {filterBar && <div style={{ marginBottom: 16 }}>{filterBar}</div>}

      {/* Grid */}
      {paginated.length === 0 ? (
        <EmptyState
          title="No results found"
          subtitle={`No items match "${search}"`}
          action={<Button variant="secondary" onClick={() => setSearch("")}>Clear search</Button>}
        />
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 14,
        }}>
          {paginated.map(item => renderCard(item))}
        </div>
      )}

      {/* Pagination */}
      <Pagination
        total={filtered.length}
        page={page}
        rowsPerPage={rows}
        onPage={setPage}
        onRowsChange={n => { setRows(n); setPage(1); }}
      />
    </div>
  );
};

export default CardGridPage;