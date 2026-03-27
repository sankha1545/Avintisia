import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import App from "../App";

// Pages
import KnowledgeBasePage from "../pages/KnowledgeBasePage";
import AgentsPage from "../pages/AgentsPage";
import ModelsPage from "../pages/ModelsPage";
import LibraryPage from "../pages/LibraryPage";
import PublishedPage from "../pages/PublishedPage";
import MachinesPage from "../pages/MachinesPage";
import QueuesPage from "../pages/QueuesPage";
import TriggersPage from "../pages/TriggersPage";
import JobsPage from "../pages/JobsPage";
import ExecutionsPage from "../pages/ExecutionsPage";
import VaultPage from "../pages/VaultPage";
import KeyStorePage from "../pages/KeyStorePage";
import TenantPage from "../pages/TenantPage";
import IntegrationsPage from "../pages/IntegrationsPage";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Navigate to="/knowledge" />} />

          <Route path="knowledge" element={<KnowledgeBasePage />} />
          <Route path="agents" element={<AgentsPage />} />
          <Route path="models" element={<ModelsPage />} />
          <Route path="library" element={<LibraryPage />} />

          <Route path="published" element={<PublishedPage />} />
          <Route path="machines" element={<MachinesPage />} />
          <Route path="queues" element={<QueuesPage />} />
          <Route path="triggers" element={<TriggersPage />} />
          <Route path="jobs" element={<JobsPage />} />
          <Route path="executions" element={<ExecutionsPage />} />
          <Route path="vault" element={<VaultPage />} />

          <Route path="keystore" element={<KeyStorePage />} />

          <Route path="tenant" element={<TenantPage />} />
          <Route path="integrations" element={<IntegrationsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}