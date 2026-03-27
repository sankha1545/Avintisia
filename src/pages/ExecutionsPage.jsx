// src/pages/ExecutionsPage.jsx
import { useState, useMemo } from "react";
import { executionsData } from "../data/sidebarData";
import { Modal, DotMenu, EmptyState, StatusBadge } from "../components/common/CardGridPage";
import Button from "../components/common/Button";
import Pagination from "../components/common/Pagination";
import SearchInput from "../components/common/SearchInput";
import SelectInput from "../components/common/SelectInput";
import Icons from "../components/common/Icons";

const SEED_EXEC = [
  { status: "success", duration: "34s",  logs: ["[INFO] Execution started", "[INFO] Agent loaded", "[INFO] Processing input...", "[SUCCESS] Task completed in 34s"] },
  { status: "running", duration: "12s",  logs: ["[INFO] Execution started", "[INFO] Agent loaded", "[INFO] Processing..."] },
  { status: "failed",  duration: "5s",   logs: ["[INFO] Execution started", "[ERROR] API timeout after 5s", "[FATAL] Execution terminated"] },
  { status: "success", duration: "67s",  logs: ["[INFO] Execution started", "[INFO] Processing 142 items", "[SUCCESS] All items processed"] },
  { status: "running", duration: "28s",  logs: ["[INFO] Execution started", "[INFO] Loading model...", "[INFO] Running inference..."] },
  { status: "failed",  duration: "8s",   logs: ["[INFO] Execution started", "[ERROR] Invalid input format", "[FATAL] Execution aborted"] },
];

const staticExecutions = executionsData.map((e, i) => ({
  ...e, ...SEED_EXEC[i],
  pipeline: `Pipeline ${(i % 3) + 1}`,
  input: `{"query": "task_${i + 1}"}`,
  output: SEED_EXEC[i].status === "failed" ? "null" : `{"result": "ok", "items": ${10 + i * 3}}`,
}));

const LogModal = ({ execution, onClose }) => (
  <Modal title={`Logs: ${execution.name}`} onClose={onClose} width={580}>
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "flex", gap: 10 }}>
        <StatusBadge status={execution.status} />
        <span style={{ fontSize: 12.5, color: "#9ca3af" }}>Duration: <strong style={{ color: "#374151" }}>{execution.duration}</strong></span>
        <span style={{ fontSize: 12.5, color: "#9ca3af" }}>Agent: <strong style={{ color: "#374151" }}>{execution.agent}</strong></span>
      </div>

      {/* Log output */}
      <div style={{ background: "#0f111a", borderRadius: 10, padding: "14px 16px", maxHeight: 220, overflowY: "auto" }}>
        {execution.logs.map((log, i) => (
          <div key={i} style={{
            fontFamily: "monospace", fontSize: 12.5, lineHeight: 1.7,
            color: log.startsWith("[ERROR]") || log.startsWith("[FATAL]") ? "#f87171"
                 : log.startsWith("[SUCCESS]") ? "#34d399"
                 : log.startsWith("[WARN]") ? "#fbbf24" : "#94a3b8",
          }}>
            {log}
          </div>
        ))}
      </div>

      {/* I/O */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {[{ label: "Input", val: execution.input }, { label: "Output", val: execution.output }].map(f => (
          <div key={f.label}>
            <div style={{ fontSize: 11.5, fontWeight: 600, color: "#9ca3af", marginBottom: 6 }}>{f.label.toUpperCase()}</div>
            <div style={{ background: "#f3f4f6", borderRadius: 8, padding: "8px 12px", fontFamily: "monospace", fontSize: 12, color: "#374151" }}>
              {f.val}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Button variant="ghost" onClick={onClose}>Close</Button>
      </div>
    </div>
  </Modal>
);

const ExecutionCard = ({ item, onDelete, onView }) => (
  <div
    style={{ background: "#fff", border: "1px solid #e8eaf2", borderRadius: 10, padding: "18px 18px 16px", display: "flex", flexDirection: "column", gap: 8, transition: "box-shadow .2s", cursor: "pointer" }}
    onClick={onView}
    onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.08)")}
    onMouseLeave={e => (e.currentTarget.style.boxShadow = "none")}
  >
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
      <div>
        <div style={{ fontWeight: 600, fontSize: 14.5, color: "#1a1d2e" }}>{item.name}</div>
        <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 2 }}>{item.agent} · {item.pipeline}</div>
      </div>
      <DotMenu onView={onView} onDelete={onDelete} />
    </div>

    <p style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.5 }}>{item.description}</p>

    <StatusBadge status={item.status} />

    {/* Log preview */}
    <div style={{ background: "#0f111a", borderRadius: 8, padding: "8px 10px", fontSize: 11.5, color: "#64748b", fontFamily: "monospace" }}>
      {item.logs[item.logs.length - 1]}
    </div>

    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#9ca3af" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        <Icons name="activity" size={12} color="#9ca3af" /> {item.duration}
      </div>
      <span style={{ fontSize: 12, color: "#9ca3af" }}>
        <span style={{ fontWeight: 500, color: "#d1d5db" }}>Created On: </span>{item.createdOn}
      </span>
    </div>
  </div>
);

const ExecutionsPage = () => {
  const [data]                    = useState(staticExecutions);
  const [search, setSearch]       = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [viewExec, setViewExec]   = useState(null);
  const [page, setPage]           = useState(1);
  const [rows, setRows]           = useState(9);

  const filtered = useMemo(() => {
    let d = data;
    if (statusFilter !== "All") d = d.filter(i => i.status === statusFilter.toLowerCase());
    if (search.trim()) { const q = search.toLowerCase(); d = d.filter(i => `${i.name} ${i.agent} ${i.pipeline}`.toLowerCase().includes(q)); }
    return d;
  }, [data, search, statusFilter]);

  const paginated = filtered.slice((page - 1) * rows, page * rows);

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "28px 32px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#1a1d2e" }}>Executions</h1>
          <p style={{ fontSize: 13.5, color: "#6b7280", marginTop: 4 }}>View execution history, logs, and results.</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <SearchInput value={search} onChange={v => { setSearch(v); setPage(1); }} placeholder="Search executions..." />
        </div>
      </div>

      <div style={{ display: "flex", gap: 6, marginBottom: 20, alignItems: "center", flexWrap: "wrap" }}>
        {["All", "Success", "Running", "Failed"].map(s => (
          <button key={s} onClick={() => { setStatusFilter(s); setPage(1); }} style={{
            padding: "5px 14px", borderRadius: 20, fontSize: 13, fontWeight: 500, border: "1px solid", cursor: "pointer",
            background: statusFilter === s ? "#4f6ef7" : "#fff",
            color: statusFilter === s ? "#fff" : "#6b7280",
            borderColor: statusFilter === s ? "#4f6ef7" : "#e5e7eb",
          }}>{s}</button>
        ))}
        <div style={{ marginLeft: "auto", display: "flex", gap: 14 }}>
          {[
            { label: "Success", color: "#10b981", status: "success" },
            { label: "Running", color: "#4f6ef7", status: "running" },
            { label: "Failed",  color: "#ef4444", status: "failed"  },
          ].map(s => (
            <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "#6b7280" }}>
              <span style={{ fontWeight: 700, color: s.color, fontSize: 15 }}>{data.filter(d => d.status === s.status).length}</span> {s.label}
            </div>
          ))}
        </div>
      </div>

      {paginated.length === 0 ? <EmptyState title="No executions found" /> : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
          {paginated.map(item => (
            <ExecutionCard key={item.id} item={item}
              onView={() => setViewExec(item)}
              onDelete={() => {}}
            />
          ))}
        </div>
      )}

      <Pagination total={filtered.length} page={page} rowsPerPage={rows} onPage={setPage} onRowsChange={n => { setRows(n); setPage(1); }} />
      {viewExec && <LogModal execution={viewExec} onClose={() => setViewExec(null)} />}
    </div>
  );
};

export default ExecutionsPage;