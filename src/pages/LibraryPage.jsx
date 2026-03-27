// src/pages/LibraryPage.jsx
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

const categoryColors = {
  NLP:        { bg: "#eff6ff", color: "#3b82f6" },
  Vision:     { bg: "#f0fdf4", color: "#10b981" },
  Automation: { bg: "#faf5ff", color: "#8b5cf6" },
  Audio:      { bg: "#fff7ed", color: "#f97316" },
  Data:       { bg: "#fef9c3", color: "#d97706" },
};

const CategoryBadge = ({ category }) => {
  const c = categoryColors[category] || { bg: "#f3f4f6", color: "#6b7280" };
  return (
    <span style={{ fontSize: 11.5, fontWeight: 600, padding: "2px 9px", borderRadius: 20, background: c.bg, color: c.color }}>
      {category}
    </span>
  );
};

const CreateLibraryModal = ({ onClose, onCreate }) => {
  const [name, setName]               = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory]       = useState("NLP");
  const [tags, setTags]               = useState("");
  const [errors, setErrors]           = useState({});

  const submit = () => {
    const e = {};
    if (!name.trim())        e.name        = "Name is required";
    if (!description.trim()) e.description = "Description is required";
    setErrors(e);
    if (Object.keys(e).length) return;
    onCreate({ name: name.trim(), description: description.trim(), category, tags: tags.trim() });
    onClose();
  };

  return (
    <Modal title="Add to Library" onClose={onClose} width={520}>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <FormField label="Template Name" required error={errors.name}>
          <TextInput value={name} onChange={setName} placeholder="e.g. Email Classifier Template" />
        </FormField>
        <FormField label="Category">
          <SelectInput value={category} onChange={setCategory} options={[
            { value: "NLP",        label: "NLP" },
            { value: "Vision",     label: "Vision" },
            { value: "Automation", label: "Automation" },
            { value: "Audio",      label: "Audio" },
            { value: "Data",       label: "Data" },
          ]} />
        </FormField>
        <FormField label="Description" required error={errors.description}>
          <TextArea value={description} onChange={setDescription} placeholder="Describe this template..." rows={3} />
        </FormField>
        <FormField label="Tags (comma separated)">
          <TextInput value={tags} onChange={setTags} placeholder="e.g. nlp, classification, email" />
        </FormField>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 8 }}>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={submit}>Add Template</Button>
        </div>
      </div>
    </Modal>
  );
};

const LibraryCard = ({ item, onDelete, onView }) => (
  <div
    style={{
      background: "#fff", border: "1px solid #e8eaf2", borderRadius: 10,
      padding: "18px 18px 16px", display: "flex", flexDirection: "column",
      gap: 8, transition: "box-shadow .2s", boxSizing: "border-box",
    }}
    onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.08)")}
    onMouseLeave={e => (e.currentTarget.style.boxShadow = "none")}
  >
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <span style={{ fontWeight: 600, fontSize: 14.5, color: "#1a1d2e" }}>{item.name}</span>
        <CategoryBadge category={item.category} />
      </div>
      <DotMenu
        onView={onView}
        onDelete={onDelete}
        extra={[{ label: "Download", icon: "download", action: () => alert(`Downloading ${item.name}`) }]}
      />
    </div>
    <p style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.55, flex: 1 }}>{item.description}</p>

    {/* Download count bar */}
    <div style={{ background: "#f3f4f6", borderRadius: 6, height: 5, overflow: "hidden", marginTop: 4 }}>
      <div style={{
        height: "100%", width: `${Math.min((item.downloads / 600) * 100, 100)}%`,
        background: "linear-gradient(90deg, #4f6ef7, #8b5cf6)", borderRadius: 6,
        transition: "width .6s ease",
      }} />
    </div>

    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#6b7280" }}>
        <Icons name="download" size={12} color="#9ca3af" />
        {item.downloads} downloads
      </div>
      <span style={{ fontSize: 12, color: "#9ca3af" }}>
        <span style={{ fontWeight: 500, color: "#d1d5db" }}>Created On: </span>{item.createdOn}
      </span>
    </div>
  </div>
);

const CATEGORIES = ["All", "NLP", "Vision", "Automation", "Audio", "Data"];

const LibraryPage = () => {
  const [data, setData]         = useState(libraryData);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch]     = useState("");
  const [filter, setFilter]     = useState("All");
  const [page, setPage]         = useState(1);
  const [rows, setRows]         = useState(9);

  const handleCreate = item => setData(prev => [{
    ...item, id: Date.now(), downloads: 0, createdOn: new Date().toLocaleDateString("en-GB"),
  }, ...prev]);

  const handleDelete = id => setData(prev => prev.filter(d => d.id !== id));

  const filtered = useMemo(() => {
    let d = data;
    if (filter !== "All") d = d.filter(i => i.category === filter);
    if (search.trim()) {
      const q = search.toLowerCase();
      d = d.filter(i => `${i.name} ${i.description} ${i.category}`.toLowerCase().includes(q));
    }
    return d;
  }, [data, search, filter]);

  const paginated = filtered.slice((page - 1) * rows, page * rows);

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "28px 32px" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#1a1d2e" }}>Library</h1>
          <p style={{ fontSize: 13.5, color: "#6b7280", marginTop: 4 }}>Browse and manage reusable agent templates.</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <SearchInput value={search} onChange={v => { setSearch(v); setPage(1); }} placeholder="Search library..." />
          <Button variant="primary" icon="plus" onClick={() => setShowModal(true)}>Add Template</Button>
        </div>
      </div>

      {/* Category filter tabs */}
      <div style={{ display: "flex", gap: 6, marginBottom: 20 }}>
        {CATEGORIES.map(c => (
          <button
            key={c}
            onClick={() => { setFilter(c); setPage(1); }}
            style={{
              padding: "5px 14px", borderRadius: 20, fontSize: 13, fontWeight: 500,
              border: "1px solid", cursor: "pointer", transition: "all .15s",
              background: filter === c ? "#4f6ef7" : "#fff",
              color: filter === c ? "#fff" : "#6b7280",
              borderColor: filter === c ? "#4f6ef7" : "#e5e7eb",
            }}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Grid */}
      {paginated.length === 0 ? (
        <EmptyState title="No templates found" subtitle="Try a different search or category" />
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
          {paginated.map(item => (
            <LibraryCard
              key={item.id}
              item={item}
              onView={() => alert(`View: ${item.name}`)}
              onDelete={() => handleDelete(item.id)}
            />
          ))}
        </div>
      )}

      <Pagination
        total={filtered.length} page={page} rowsPerPage={rows}
        onPage={setPage} onRowsChange={n => { setRows(n); setPage(1); }}
      />

      {showModal && (
        <CreateLibraryModal onClose={() => setShowModal(false)} onCreate={handleCreate} />
      )}
    </div>
  );
};

export default LibraryPage;