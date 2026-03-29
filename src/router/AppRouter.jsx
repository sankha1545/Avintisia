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

// New 404 Page
import NotFoundPage from "../pages/NotFoundPage";

// ✅ Centralized route config (scalable)
const ROUTES = {
  HOME: "/",
  KNOWLEDGE: "/knowledge",
  AGENTS: "/agents",
  MODELS: "/models",
  LIBRARY: "/library",
  PUBLISHED: "/published",
  MACHINES: "/machines",
  QUEUES: "/queues",
  TRIGGERS: "/triggers",
  JOBS: "/jobs",
  EXECUTIONS: "/executions",
  VAULT: "/vault",
  KEYSTORE: "/keystore",
  TENANT: "/tenant",
  INTEGRATIONS: "/integrations",
};

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Layout Route */}
        <Route path={ROUTES.HOME} element={<App />}>
          
          {/* Default Redirect */}
          <Route index element={<Navigate to={ROUTES.KNOWLEDGE} replace />} />

          {/* Core Pages */}
          <Route path="knowledge" element={<KnowledgeBasePage />} />
          <Route path="agents" element={<AgentsPage />} />
          <Route path="models" element={<ModelsPage />} />
          <Route path="library" element={<LibraryPage />} />

          {/* Pipelines */}
          <Route path="published" element={<PublishedPage />} />
          <Route path="machines" element={<MachinesPage />} />
          <Route path="queues" element={<QueuesPage />} />
          <Route path="triggers" element={<TriggersPage />} />
          <Route path="jobs" element={<JobsPage />} />
          <Route path="executions" element={<ExecutionsPage />} />

          {/* Security */}
          <Route path="vault" element={<VaultPage />} />
          <Route path="keystore" element={<KeyStorePage />} />

          {/* Org */}
          <Route path="tenant" element={<TenantPage />} />
          <Route path="integrations" element={<IntegrationsPage />} />

          {/* ✅ 404 inside layout (keeps sidebar + header visible) */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        {/* ✅ Fallback outside layout (edge safety) */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}