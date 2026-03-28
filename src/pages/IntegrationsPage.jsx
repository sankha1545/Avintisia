"use client";

import { useState, useMemo } from "react";
import { integrationsData } from "../data/sidebarData";

import IntegrationHeader from "../components/features/Integrations/IntegrationHeader";
import IntegrationFilters from "../components/features/Integrations/IntegrationFilters";
import IntegrationGrid from "../components/features/Integrations/IntegrationGrid";
import ConfigModal from "../components/features/Integrations/ConfigModal";

import DeleteConfirmModal from "../components/common/modal/DeleteConfirmModal";

const IntegrationsPage = () => {
  // DATA (safe initialization)
  const [data, setData] = useState(
    Array.isArray(integrationsData) ? integrationsData : []
  );

  // MODALS
  const [configTarget, setConfigTarget] = useState(null);
  const [disconnectTarget, setDisconnectTarget] = useState(null);

  // FILTERS
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // FILTERED DATA
  const filtered = useMemo(() => {
    let d = data;

    const normalized = statusFilter.toLowerCase();

    if (normalized === "connected") {
      d = d.filter((i) => i.status === "connected");
    } else if (normalized === "not connected") {
      d = d.filter((i) => i.status === "disconnected");
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      d = d.filter((i) =>
        `${i.name} ${i.category}`.toLowerCase().includes(q)
      );
    }

    return d;
  }, [data, search, statusFilter]);

  // CONNECT HANDLER
  const handleConnect = (id) => {
    if (!id) return;

    setData((prev) =>
      prev.map((d) =>
        d.id === id ? { ...d, status: "connected" } : d
      )
    );
  };

  // DISCONNECT HANDLER
  const handleDisconnect = () => {
    if (!disconnectTarget?.id) return;

    setData((prev) =>
      prev.map((d) =>
        d.id === disconnectTarget.id
          ? { ...d, status: "disconnected" }
          : d
      )
    );

    setDisconnectTarget(null);
  };

  return (
    <div className="flex flex-col w-full gap-4">
      
      {/* HEADER */}
      <IntegrationHeader
        search={search}
        setSearch={setSearch}
      />

      {/* FILTERS */}
      <IntegrationFilters
        value={statusFilter}
        onChange={setStatusFilter}
      />

      {/* GRID */}
      <IntegrationGrid
        data={filtered}
        onConfigure={setConfigTarget}
        onDisconnect={setDisconnectTarget}
      />

      {/* CONFIG MODAL */}
      <ConfigModal
        integration={configTarget}
        onClose={() => setConfigTarget(null)}
        onSave={handleConnect}
      />

      {/* DISCONNECT MODAL */}
      <DeleteConfirmModal
        isOpen={!!disconnectTarget}
        onClose={() => setDisconnectTarget(null)}
        title="Disconnect Integration"
        message={`Are you sure you want to disconnect "${disconnectTarget?.name}"?`}
        onConfirm={handleDisconnect}
      />
    </div>
  );
};

export default IntegrationsPage;