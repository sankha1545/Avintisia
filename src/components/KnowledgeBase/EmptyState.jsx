// src/components/KnowledgeBase/EmptyState.jsx
import Icons from "../common/Icons";

const EmptyState = ({ onCreateNew }) => (
  <div style={{
    display: "flex", flexDirection: "column", alignItems: "center",
    justifyContent: "center", padding: "80px 24px", gap: 12,
  }}>
    <div style={{
      width: 56, height: 56, background: "#f3f4f6", borderRadius: "50%",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <Icons name="knowledge" size={24} color="#9ca3af" />
    </div>
    <div style={{ textAlign: "center" }}>
      <p style={{ fontWeight: 600, fontSize: 15, color: "#374151" }}>No knowledge bases yet</p>
      <p style={{ fontSize: 13, color: "#9ca3af", marginTop: 4 }}>
        Create your first knowledge base to get started
      </p>
    </div>
    {onCreateNew && (
      <button
        onClick={onCreateNew}
        style={{
          background: "#4f6ef7", color: "#fff", border: "none",
          borderRadius: 8, padding: "8px 18px", fontSize: 13.5,
          fontWeight: 500, cursor: "pointer",
        }}
      >
        + Create New
      </button>
    )}
  </div>
);

export default EmptyState;