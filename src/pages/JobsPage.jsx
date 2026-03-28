import { useState, useMemo } from "react";
import { jobsData } from "../data/sidebarData";
import {
  Modal,
  DotMenu,
  EmptyState,
  StatusBadge,
} from "../components/common/CardGridPage";
import FormField from "../components/common/FormField";
import TextInput from "../components/common/TextInput";
import TextArea from "../components/common/TextArea";
import SelectInput from "../components/common/SelectInput";
import Button from "../components/common/Button";
import Pagination from "../components/common/Pagination";
import SearchInput from "../components/common/SearchInput";
import Icons from "../components/common/Icons";


// ============================
// DETAIL MODAL
// ============================
const JobDetailModal = ({ job, onClose }) => (
  <Modal title={`Job: ${job.name}`} onClose={onClose}>
    <div className="flex flex-col gap-4">

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {[
          { label: "Status", val: job.status },
          { label: "Agent", val: job.agent },
          { label: "Type", val: job.type },
          { label: "Duration", val: job.duration },
          { label: "Started At", val: job.startedAt },
          { label: "Created On", val: job.createdOn },
        ].map((f) => (
          <div key={f.label} className="p-3 rounded-lg bg-gray-50">
            <p className="text-xs text-gray-400">{f.label}</p>
            <p className="text-sm font-semibold text-gray-800">{f.val}</p>
          </div>
        ))}
      </div>

      <div className="p-3 rounded-lg bg-gray-50">
        <p className="mb-1 text-xs text-gray-400">DESCRIPTION</p>
        <p className="text-sm text-gray-700">{job.description}</p>
      </div>

      <div className="flex justify-end">
        <Button variant="ghost" onClick={onClose}>
          Close
        </Button>
      </div>
    </div>
  </Modal>
);


// ============================
// CREATE MODAL
// ============================
const CreateJobModal = ({ onClose, onCreate }) => {
  const [name, setName] = useState("");
  const [agent, setAgent] = useState("Agent 1");
  const [type, setType] = useState("Batch");
  const [description, setDesc] = useState("");
  const [errors, setErrors] = useState({});

  const submit = () => {
    const e = {};
    if (!name.trim()) e.name = "Required";

    setErrors(e);
    if (Object.keys(e).length) return;

    onCreate({ name, agent, type, description });
    onClose();
  };

  return (
    <Modal title="Create Job" onClose={onClose}>
      <div className="flex flex-col gap-4">

        <FormField label="Job Name" error={errors.name}>
          <TextInput value={name} onChange={setName} />
        </FormField>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <FormField label="Agent">
            <SelectInput
              value={agent}
              onChange={setAgent}
              options={["Agent 1", "Agent 2", "Agent 3"].map((a) => ({
                value: a,
                label: a,
              }))}
            />
          </FormField>

          <FormField label="Job Type">
            <SelectInput
              value={type}
              onChange={setType}
              options={[
                { value: "Batch", label: "Batch" },
                { value: "Realtime", label: "Realtime" },
                { value: "Scheduled", label: "Scheduled" },
              ]}
            />
          </FormField>
        </div>

        <FormField label="Description">
          <TextArea value={description} onChange={setDesc} />
        </FormField>

        <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
          <Button variant="ghost" onClick={onClose} className="w-full sm:w-auto">
            Cancel
          </Button>
          <Button onClick={submit} className="w-full sm:w-auto">
            Create Job
          </Button>
        </div>
      </div>
    </Modal>
  );
};


// ============================
// CARD
// ============================
const JobCard = ({ item, onDelete, onView, onRetry }) => (
  <div
    onClick={onView}
    className="flex flex-col gap-3 p-4 transition bg-white border cursor-pointer rounded-xl hover:shadow-md"
  >
    <div className="flex justify-between">
      <div>
        <h3 className="text-sm font-semibold">{item.name}</h3>
        <p className="text-xs text-gray-400">
          {item.agent} · {item.type}
        </p>
      </div>

      <DotMenu
        onView={onView}
        onDelete={onDelete}
        extra={[
          item.status === "failed" && { label: "Retry", action: onRetry },
        ].filter(Boolean)}
      />
    </div>

    <p className="text-xs text-gray-500">{item.description}</p>

    <StatusBadge status={item.status} />

    <div className="flex justify-between text-xs text-gray-400">
      <div className="flex items-center gap-1">
        <Icons name="activity" size={12} />
        {item.duration}
      </div>
      <span>{item.startedAt}</span>
    </div>

    <p className="text-xs text-gray-400">
      Created On: {item.createdOn}
    </p>
  </div>
);


// ============================
// MAIN PAGE
// ============================
const JobsPage = () => {
  const [data, setData] = useState(jobsData);
  const [showCreate, setShowCreate] = useState(false);
  const [viewJob, setViewJob] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState(9);

  const filtered = useMemo(() => {
    let d = data;

    if (statusFilter !== "All") {
      d = d.filter((i) => i.status === statusFilter.toLowerCase());
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      d = d.filter((i) =>
        `${i.name} ${i.agent} ${i.type}`.toLowerCase().includes(q)
      );
    }

    return d;
  }, [data, search, statusFilter]);

  const paginated = filtered.slice((page - 1) * rows, page * rows);

  return (
    <div className="flex flex-col w-full h-full gap-4">

      {/* HEADER */}
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
        <div>
          <h1 className="text-xl font-bold sm:text-2xl">Jobs</h1>
          <p className="text-sm text-gray-500">
            Monitor and manage jobs.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="w-full sm:w-64">
            <SearchInput
              value={search}
              onChange={(v) => {
                setSearch(v);
                setPage(1);
              }}
              placeholder="Search jobs..."
            />
          </div>

          <Button onClick={() => setShowCreate(true)} className="w-full sm:w-auto">
            Create Job
          </Button>
        </div>
      </div>

      {/* FILTER */}
      <div className="flex flex-wrap gap-2">
        {["All", "Completed", "Running", "Failed", "Queued"].map((s) => (
          <button
            key={s}
            onClick={() => {
              setStatusFilter(s);
              setPage(1);
            }}
            className={`px-3 py-1 rounded-full text-sm border ${
              statusFilter === s
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-500 border-gray-200"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* GRID */}
      {paginated.length === 0 ? (
        <EmptyState title="No jobs found" />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {paginated.map((item) => (
            <JobCard
              key={item.id}
              item={item}
              onView={() => setViewJob(item)}
              onDelete={() => setData((prev) => prev.filter((d) => d.id !== item.id))}
              onRetry={() =>
                setData((prev) =>
                  prev.map((d) =>
                    d.id === item.id ? { ...d, status: "queued" } : d
                  )
                )
              }
            />
          ))}
        </div>
      )}

      {/* PAGINATION */}
      <Pagination
        totalRows={filtered.length}
        currentPage={page}
        totalPages={Math.ceil(filtered.length / rows)}
        rowsPerPage={rows}
        onPageChange={setPage}
        onRowsPerPageChange={(n) => {
          setRows(n);
          setPage(1);
        }}
      />

      {/* MODALS */}
      {showCreate && (
        <CreateJobModal
          onClose={() => setShowCreate(false)}
          onCreate={(item) =>
            setData((prev) => [
              {
                ...item,
                id: Date.now(),
                status: "queued",
                duration: "—",
                startedAt: "—",
                createdOn: new Date().toLocaleDateString("en-GB"),
              },
              ...prev,
            ])
          }
        />
      )}

      {viewJob && (
        <JobDetailModal
          job={viewJob}
          onClose={() => setViewJob(null)}
        />
      )}
    </div>
  );
};

export default JobsPage;