import { useState, useMemo } from "react";
import { publishedData } from "../data/sidebarData";
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


// ============================
// CREATE MODAL
// ============================
const CreatePipelineModal = ({ onClose, onCreate }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [version, setVersion] = useState("v1.0");
  const [env, setEnv] = useState("Production");
  const [errors, setErrors] = useState({});

  const submit = () => {
    const e = {};
    if (!name.trim()) e.name = "Required";
    if (!description.trim()) e.description = "Required";

    setErrors(e);
    if (Object.keys(e).length) return;

    onCreate({ name, description, version, env });
    onClose();
  };

  return (
    <Modal title="Publish Pipeline" onClose={onClose}>
      <div className="flex flex-col gap-4">

        <FormField label="Pipeline Name" error={errors.name}>
          <TextInput value={name} onChange={setName} />
        </FormField>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <FormField label="Version">
            <TextInput value={version} onChange={setVersion} />
          </FormField>

          <FormField label="Environment">
            <SelectInput
              value={env}
              onChange={setEnv}
              options={[
                { value: "Production", label: "Production" },
                { value: "Staging", label: "Staging" },
                { value: "Dev", label: "Dev" },
              ]}
            />
          </FormField>
        </div>

        <FormField label="Description" error={errors.description}>
          <TextArea value={description} onChange={setDescription} />
        </FormField>

        <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
          <Button variant="ghost" onClick={onClose} className="w-full sm:w-auto">
            Cancel
          </Button>
          <Button onClick={submit} className="w-full sm:w-auto">
            Publish
          </Button>
        </div>
      </div>
    </Modal>
  );
};


// ============================
// CARD
// ============================
const PipelineCard = ({ item, onDelete, onEdit, onView, onToggle }) => (
  <div className="flex flex-col gap-2 p-4 transition bg-white border rounded-xl hover:shadow-md">

    <div className="flex items-start justify-between">
      <h3 className="text-sm font-semibold">{item.name}</h3>

      <DotMenu
        onView={onView}
        onEdit={onEdit}
        onDelete={onDelete}
        extra={[
          {
            label: item.status === "live" ? "Unpublish" : "Go Live",
            action: onToggle,
          },
        ]}
      />
    </div>

    <p className="flex-1 text-xs text-gray-500">{item.description}</p>

    <div className="flex flex-wrap items-center gap-2">
      <StatusBadge status={item.status} />

      <span className="px-2 py-0.5 text-xs bg-gray-100 rounded-full">
        {item.version}
      </span>

      {item.env && (
        <span
          className={`px-2 py-0.5 text-xs rounded-full ${
            item.env === "Production"
              ? "bg-orange-100 text-orange-600"
              : "bg-green-100 text-green-600"
          }`}
        >
          {item.env}
        </span>
      )}
    </div>

    <p className="text-xs text-gray-400">
      Created On: {item.createdOn}
    </p>
  </div>
);


// ============================
// MAIN PAGE
// ============================
const PublishedPage = () => {
  const [data, setData] = useState(
    publishedData.map((d, i) => ({
      ...d,
      env: i % 2 === 0 ? "Production" : "Staging",
    }))
  );

  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState(9);

  const handleCreate = (item) => {
    setData((prev) => [
      {
        ...item,
        id: Date.now(),
        status: "draft",
        createdOn: new Date().toLocaleDateString("en-GB"),
      },
      ...prev,
    ]);
  };

  const handleDelete = (id) => {
    setData((prev) => prev.filter((d) => d.id !== id));
  };

  const handleToggle = (id) => {
    setData((prev) =>
      prev.map((d) =>
        d.id === id
          ? { ...d, status: d.status === "live" ? "draft" : "live" }
          : d
      )
    );
  };

  const filtered = useMemo(() => {
    let d = data;

    if (statusFilter !== "All") {
      d = d.filter((i) => i.status === statusFilter.toLowerCase());
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      d = d.filter((i) =>
        `${i.name} ${i.description} ${i.version}`
          .toLowerCase()
          .includes(q)
      );
    }

    return d;
  }, [data, search, statusFilter]);

  const paginated = filtered.slice((page - 1) * rows, page * rows);

  return (
    <div className="flex flex-col w-full h-full gap-4">

      {/* HEADER */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold sm:text-2xl">Published</h1>
          <p className="text-sm text-gray-500">
            Manage your published pipelines and workflows.
          </p>
        </div>

        <div className="flex flex-col w-full gap-2 sm:flex-row sm:w-auto">
          <div className="w-full sm:w-64">
            <SearchInput
              value={search}
              onChange={(v) => {
                setSearch(v);
                setPage(1);
              }}
              placeholder="Search pipelines..."
            />
          </div>

          <Button onClick={() => setShowModal(true)} className="w-full sm:w-auto">
            Publish New
          </Button>
        </div>
      </div>

      {/* FILTER + STATS */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          {["All", "Live", "Draft"].map((s) => (
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

        {/* Stats */}
        <div className="flex gap-4 text-sm text-gray-500">
          <span><strong>{data.length}</strong> Total</span>
          <span><strong>{data.filter(d => d.status === "live").length}</strong> Live</span>
          <span><strong>{data.filter(d => d.status === "draft").length}</strong> Draft</span>
        </div>
      </div>

      {/* GRID */}
      {paginated.length === 0 ? (
        <EmptyState title="No pipelines found" />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {paginated.map((item) => (
            <PipelineCard
              key={item.id}
              item={item}
              onView={() => alert(item.name)}
              onEdit={() => alert(item.name)}
              onDelete={() => handleDelete(item.id)}
              onToggle={() => handleToggle(item.id)}
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

      {/* MODAL */}
      {showModal && (
        <CreatePipelineModal
          onClose={() => setShowModal(false)}
          onCreate={handleCreate}
        />
      )}
    </div>
  );
};

export default PublishedPage;