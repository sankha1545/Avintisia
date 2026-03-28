import { useState, useMemo } from "react";
import { libraryData } from "../data/sidebarData";
import { Modal, DotMenu, EmptyState } from "../components/common/CardGridPage";
import FormField from "../components/common/FormField";
import TextInput from "../components/common/TextInput";
import TextArea from "../components/common/TextArea";
import SelectInput from "../components/common/SelectInput";
import Button from "../components/common/Button";
import Pagination from "../components/common/Pagination";
import SearchInput from "../components/common/SearchInput";
import Icons from "../components/common/Icons";


// ============================
// CATEGORY BADGE
// ============================
const categoryStyles = {
  NLP: "bg-blue-100 text-blue-600",
  Vision: "bg-green-100 text-green-600",
  Automation: "bg-purple-100 text-purple-600",
  Audio: "bg-orange-100 text-orange-600",
  Data: "bg-yellow-100 text-yellow-600",
};

const CategoryBadge = ({ category }) => (
  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${categoryStyles[category] || "bg-gray-100 text-gray-500"}`}>
    {category}
  </span>
);


// ============================
// CREATE MODAL
// ============================
const CreateLibraryModal = ({ onClose, onCreate }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("NLP");
  const [tags, setTags] = useState("");
  const [errors, setErrors] = useState({});

  const submit = () => {
    const e = {};
    if (!name.trim()) e.name = "Required";
    if (!description.trim()) e.description = "Required";
    setErrors(e);
    if (Object.keys(e).length) return;

    onCreate({
      name,
      description,
      category,
      tags,
    });

    onClose();
  };

  return (
    <Modal title="Add to Library" onClose={onClose}>
      <div className="flex flex-col gap-4">

        <FormField label="Template Name" error={errors.name}>
          <TextInput value={name} onChange={setName} />
        </FormField>

        <FormField label="Category">
          <SelectInput
            value={category}
            onChange={setCategory}
            options={[
              { value: "NLP", label: "NLP" },
              { value: "Vision", label: "Vision" },
              { value: "Automation", label: "Automation" },
              { value: "Audio", label: "Audio" },
              { value: "Data", label: "Data" },
            ]}
          />
        </FormField>

        <FormField label="Description" error={errors.description}>
          <TextArea value={description} onChange={setDescription} />
        </FormField>

        <FormField label="Tags">
          <TextInput value={tags} onChange={setTags} />
        </FormField>

        <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
          <Button variant="ghost" onClick={onClose} className="w-full sm:w-auto">
            Cancel
          </Button>
          <Button onClick={submit} className="w-full sm:w-auto">
            Add Template
          </Button>
        </div>
      </div>
    </Modal>
  );
};


// ============================
// CARD
// ============================
const LibraryCard = ({ item, onDelete, onView }) => (
  <div className="flex flex-col w-full gap-2 p-4 transition bg-white border rounded-xl hover:shadow-md">

    <div className="flex justify-between">
      <div className="flex flex-col gap-1">
        <h3 className="text-sm font-semibold">{item.name}</h3>
        <CategoryBadge category={item.category} />
      </div>

      <DotMenu onView={onView} onDelete={onDelete} />
    </div>

    <p className="flex-1 text-xs text-gray-500">{item.description}</p>

    {/* Progress bar */}
    <div className="h-1.5 bg-gray-100 rounded overflow-hidden">
      <div
        className="h-full transition-all bg-gradient-to-r from-blue-500 to-purple-500"
        style={{ width: `${Math.min((item.downloads / 600) * 100, 100)}%` }}
      />
    </div>

    <div className="flex justify-between text-xs text-gray-400">
      <div className="flex items-center gap-1">
        <Icons name="download" size={12} />
        {item.downloads}
      </div>
      <span>{item.createdOn}</span>
    </div>
  </div>
);


// ============================
// MAIN PAGE
// ============================
const CATEGORIES = ["All", "NLP", "Vision", "Automation", "Audio", "Data"];

const LibraryPage = () => {
  const [data, setData] = useState(libraryData);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState(9);

  const handleCreate = (item) => {
    setData((prev) => [
      {
        ...item,
        id: Date.now(),
        downloads: 0,
        createdOn: new Date().toLocaleDateString("en-GB"),
      },
      ...prev,
    ]);
  };

  const handleDelete = (id) => {
    setData((prev) => prev.filter((d) => d.id !== id));
  };

  const filtered = useMemo(() => {
    let d = data;

    if (filter !== "All") {
      d = d.filter((i) => i.category === filter);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      d = d.filter((i) =>
        `${i.name} ${i.description} ${i.category}`.toLowerCase().includes(q)
      );
    }

    return d;
  }, [data, search, filter]);

  const paginated = filtered.slice((page - 1) * rows, page * rows);

  return (
    <div className="flex flex-col w-full h-full gap-4">

      {/* HEADER */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold sm:text-2xl">Library</h1>
          <p className="text-sm text-gray-500">
            Browse and manage reusable agent templates.
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
              placeholder="Search library..."
            />
          </div>

          <Button onClick={() => setShowModal(true)} className="w-full sm:w-auto">
            Add Template
          </Button>
        </div>
      </div>

      {/* FILTERS */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => {
              setFilter(c);
              setPage(1);
            }}
            className={`px-3 py-1 rounded-full text-sm border ${
              filter === c
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-500 border-gray-200"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* GRID */}
      {paginated.length === 0 ? (
        <EmptyState title="No templates found" />
      ) : (
        <div className="grid grid-cols-1 gap-4  sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {paginated.map((item) => (
            <LibraryCard
              key={item.id}
              item={item}
              onView={() => alert(item.name)}
              onDelete={() => handleDelete(item.id)}
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
        <CreateLibraryModal
          onClose={() => setShowModal(false)}
          onCreate={handleCreate}
        />
      )}
    </div>
  );
};

export default LibraryPage;