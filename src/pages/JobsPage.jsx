// src/pages/JobsPage.jsx
import { useState, useMemo } from "react";
import { jobsData } from "../data/sidebarData";
import { Modal, DotMenu, EmptyState, StatusBadge } from "../components/common/CardGridPage";
import FormField from "../components/common/FormField";
import TextInput from "../components/common/TextInput";
import TextArea from "../components/common/TextArea";
import SelectInput from "../components/common/SelectInput";
import Button from "../components/common/Button";
import Pagination from "../components/common/Pagination";
import SearchInput from "../components/common/SearchInput";
import Icons from "../components/common/Icons";

const SEED_JOBS = [
  { duration: "42s",  startedAt: "14/07/2025 08:00", status: "completed" },
  { duration: "11s",  startedAt: "14/07/2025 08:05", status: "running"   },
  { duration: "5s",   startedAt: "14/07/2025 08:10", status: "failed"    },
  { duration: "98s",  startedAt: "14/07/2025 08:12", status: "queued"    },
  { duration: "73s",  startedAt: "14/07/2025 08:15", status: "completed" },
  { duration: "18s",  startedAt: "14/07/2025 08:20", status: "running"   },
];

const staticJobs = jobsData.map((j, i) => ({
  ...j, ...SEED_JOBS[i],
  agent: `Agent ${(i % 3) + 1}`,
  type: ["Batch", "Realtime", "Scheduled"][i % 3],
}));

const JobDetailModal = ({ job, onClose }) => (
  <Modal title={`Job: ${job.name}`} onClose={onClose} width={500}>
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {[
          { label: "Status",     val: job.status    },
          { label: "Agent",      val: job.agent     },
          { label: "Type",       val: job.type      },
          { label: "Duration",   val: job.duration  },
          { label: "Started At", val: job.startedAt },
          { label: "Created On", val: job.createdOn },
        ].map(f => (
          <div key={f.label} style={{ background: "#f9fafb", borderRadius: 8, padding: "10px 14px" }}>
            <div style={{ fontSize: 11.5, color: "#9ca3af", marginBottom: 4 }}>{f.label}</div>
            <div style={{ fontSize: 13.5, fontWeight: 600, color: "#1a1d2e" }}>{f.val}</div>
          </div>
        ))}
      </div>
      <div style={{ background: "#f9fafb", borderRadius: 8, padding: "12px 14px" }}>
        <div style={{ fontSize: 11.5, color: "#9ca3af", marginBottom: 6 }}>DESCRIPTION</div>
        <div style={{ fontSize: 13, color: "#374151" }}>{job.description}</div>
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Button variant="ghost" onClick={onClose}>Close</Button>
      </div>
    </div>
  </Modal>
);

const CreateJobModal = ({ onClose, onCreate }) => {
  const [name, setName]       = useState("");
  const [agent, setAgent]     = useState("Agent 1");
  const [type, setType]       = useState("Batch");
  const [description, setDesc] = useState("");
  const [errors, setErrors]   = useState({});

  const submit = () => {
    const e = {};
    if (!name.trim()) e.name = "Name is required";
    setErrors(e);
    if (Object.keys(e).length) return;
    onCreate({ name: name.trim(), agent, type, description: description.trim() });
    onClose();
  };

  return (
    <Modal title="Create Job" onClose={onClose} width={500}>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <FormField label="Job Name" required error={errors.name}>
          <TextInput value={name} onChange={setName} placeholder="e.g. Process Daily Reports" />
        </FormField>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <FormField label="Agent">
            <SelectInput value={agent} onChange={setAgent} options={
              ["Agent 1","Agent 2","Agent 3","Agent 4","Agent 5","Agent 6"]
                .map(a => ({ value: a, label: a }))
            } />
          </FormField>
          <FormField label="Job Type">
            <SelectInput value={type} onChange={setType} options={[
              { value: "Batch",     label: "Batch" },
              { value: "Realtime",  label: "Realtime" },
              { value: "Scheduled", label: "Scheduled" },
            ]} />
          </FormField>
        </div>
        <FormField label="Description">
          <TextArea value={description} onChange={setDesc} placeholder="What does this job do?" rows={2} />
        </FormField>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 8 }}>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={submit}>Create Job</Button>
        </div>
      </div>
    </Modal>
  );
};

const JobCard = ({ item, onDelete, onView, onRetry }) => (
  <div
    style={{ background: "#fff", border: "1px solid #e8eaf2", borderRadius: 10, padding: "18px 18px 16px", display: "flex", flexDirection: "column", gap: 8, transition: "box-shadow .2s", cursor: "pointer" }}
    onClick={onView}
    onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.08)")}
    onMouseLeave={e => (e.currentTarget.style.boxShadow = "none")}
  >
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
      <div>
        <div style={{ fontWeight: 600, fontSize: 14.5, color: "#1a1d2e" }}>{item.name}</div>
        <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 2 }}>{item.agent} · {item.type}</div>
      </div>
      <DotMenu
        onView={onView} onDelete={onDelete}
        extra={[item.status === "failed" && { label: "Retry", icon: "refresh", action: onRetry }].filter(Boolean)}
      />
    </div>

    <p style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.5 }}>{item.description}</p>

    <StatusBadge status={item.status} />

    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#9ca3af" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        <Icons name="activity" size={12} color="#9ca3af" /> {item.duration}
      </div>
      <div>{item.startedAt}</div>
    </div>
    <div style={{ fontSize: 12, color: "#9ca3af" }}>
      <span style={{ fontWeight: 500, color: "#d1d5db" }}>Created On: </span>{item.createdOn}
    </div>
  </div>
);

const JobsPage = () => {
  const [data, setData]           = useState(staticJobs);
  const [showCreate, setShowCreate] = useState(false);
  const [viewJob, setViewJob]     = useState(null);
  const [search, setSearch]       = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage]           = useState(1);
  const [rows, setRows]           = useState(9);

  const handleCreate = item => setData(prev => [{ ...item, id: Date.now(), status: "queued", duration: "—", startedAt: "—", createdOn: new Date().toLocaleDateString("en-GB") }, ...prev]);
  const handleDelete = id   => setData(prev => prev.filter(d => d.id !== id));
  const handleRetry  = id   => setData(prev => prev.map(d => d.id === id ? { ...d, status: "queued" } : d));

  const filtered = useMemo(() => {
    let d = data;
    if (statusFilter !== "All") d = d.filter(i => i.status === statusFilter.toLowerCase());
    if (search.trim()) { const q = search.toLowerCase(); d = d.filter(i => `${i.name} ${i.agent} ${i.type}`.toLowerCase().includes(q)); }
    return d;
  }, [data, search, statusFilter]);

  const paginated = filtered.slice((page - 1) * rows, page * rows);

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "28px 32px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#1a1d2e" }}>Jobs</h1>
          <p style={{ fontSize: 13.5, color: "#6b7280", marginTop: 4 }}>Monitor and manage all running and scheduled jobs.</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <SearchInput value={search} onChange={v => { setSearch(v); setPage(1); }} placeholder="Search jobs..." />
          <Button variant="primary" icon="plus" onClick={() => setShowCreate(true)}>Create Job</Button>
        </div>
      </div>

      {/* Status tabs + stats */}
      <div style={{ display: "flex", gap: 6, marginBottom: 20, alignItems: "center", flexWrap: "wrap" }}>
        {["All", "Completed", "Running", "Failed", "Queued"].map(s => (
          <button key={s} onClick={() => { setStatusFilter(s); setPage(1); }} style={{
            padding: "5px 14px", borderRadius: 20, fontSize: 13, fontWeight: 500, border: "1px solid", cursor: "pointer",
            background: statusFilter === s ? "#4f6ef7" : "#fff",
            color: statusFilter === s ? "#fff" : "#6b7280",
            borderColor: statusFilter === s ? "#4f6ef7" : "#e5e7eb",
          }}>{s}</button>
        ))}
        <div style={{ marginLeft: "auto", display: "flex", gap: 14 }}>
          {[
            { label: "Completed", color: "#10b981", status: "completed" },
            { label: "Running",   color: "#4f6ef7", status: "running"   },
            { label: "Failed",    color: "#ef4444", status: "failed"    },
            { label: "Queued",    color: "#8b5cf6", status: "queued"    },
          ].map(s => (
            <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "#6b7280" }}>
              <span style={{ fontWeight: 700, color: s.color, fontSize: 15 }}>{data.filter(d => d.status === s.status).length}</span> {s.label}
            </div>
          ))}
        </div>
      </div>

      {paginated.length === 0 ? <EmptyState title="No jobs found" /> : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
          {paginated.map(item => (
            <JobCard key={item.id} item={item}
              onView={() => setViewJob(item)}
              onDelete={() => handleDelete(item.id)}
              onRetry={() => handleRetry(item.id)}
            />
          ))}
        </div>
      )}

      <Pagination total={filtered.length} page={page} rowsPerPage={rows} onPage={setPage} onRowsChange={n => { setRows(n); setPage(1); }} />
      {showCreate && <CreateJobModal onClose={() => setShowCreate(false)} onCreate={handleCreate} />}
      {viewJob    && <JobDetailModal job={viewJob}  onClose={() => setViewJob(null)} />}
    </div>
  );
};

export default JobsPage;