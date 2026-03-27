import {
  Bot,
  FileBox,
  Columns3,
  Monitor,
  Zap,
  MonitorPlay,
  Shield,
  BookOpenCheck,
  Library,
  IdCard,
  Rows4,
} from "lucide-react";

/* 🔹 SIDEBAR DATA */
export const sidebarSections = [
  {
    title: "MY PROJECTS",
    items: [
      { id: "agents", label: "Agents", icon: Bot, path: "/agents" },
      { id: "models", label: "AI Models", icon: FileBox, path: "/models" },
      { id: "library", label: "Library", icon: Columns3, path: "/library" },
    ],
  },
  {
    title: "ORCHESTRATOR",
    items: [
      { id: "published", label: "Published", icon: Bot, path: "/published" },
      { id: "machines", label: "Machines", icon: Monitor, path: "/machines" },
      { id: "queues", label: "Queues", icon: Rows4, path: "/queues" },
      { id: "triggers", label: "Triggers", icon: Zap, path: "/triggers" },
      { id: "jobs", label: "Jobs", icon: MonitorPlay, path: "/jobs" },
      { id: "executions", label: "Executions", icon: MonitorPlay, path: "/executions" },
      { id: "vault", label: "Vault", icon: Shield, path: "/vault" },
      { id: "knowledge", label: "Knowledge Base", icon: BookOpenCheck, path: "/knowledge" },
      { id: "keystore", label: "Key Store", icon: Library, path: "/keystore" },
    ],
  },
  {
    title: "ADMIN",
    items: [
      { id: "tenant", label: "Tenant", icon: IdCard, path: "/tenant" },
      {
        id: "integrations",
        label: "Integrations",
        icon: "/icons/target.png",
        isImage: true,
        path: "/integrations",
      },
     
    ],
  },
];

// ─── Mock Data ────────────────────────────────────────────────────────────────
const loremShort = "Lorem Ipsum is simply dummy text of the printing and typesetting industry.";

export const knowledgeBaseCards = Array.from({ length: 6 }, (_, i) => ({
  id: i + 1,
  title: "Test",
  description: loremShort,
  createdOn: "14/07/2025",
}));

export const agentsData = Array.from({ length: 6 }, (_, i) => ({
  id: i + 1,
  name: `Agent ${i + 1}`,
  description: loremShort,
  status: i % 3 === 0 ? "active" : i % 3 === 1 ? "idle" : "stopped",
  createdOn: "14/07/2025",
  type: i % 2 === 0 ? "LLM" : "Rule-Based",
}));

export const publishedData = Array.from({ length: 6 }, (_, i) => ({
  id: i + 1,
  name: `Pipeline ${i + 1}`,
  description: loremShort,
  status: i % 2 === 0 ? "live" : "draft",
  createdOn: "14/07/2025",
  version: `v1.${i}`,
}));

export const machinesData = Array.from({ length: 6 }, (_, i) => ({
  id: i + 1,
  name: `Machine-${String(i + 1).padStart(3, "0")}`,
  description: loremShort,
  status: i % 3 === 0 ? "running" : i % 3 === 1 ? "stopped" : "pending",
  cpu: `${Math.floor(Math.random() * 60 + 20)}%`,
  memory: `${Math.floor(Math.random() * 4 + 2)} GB`,
  createdOn: "14/07/2025",
}));

export const queuesData = Array.from({ length: 6 }, (_, i) => ({
  id: i + 1,
  name: `Queue-${i + 1}`,
  description: loremShort,
  pending: Math.floor(Math.random() * 50),
  processed: Math.floor(Math.random() * 500),
  failed: Math.floor(Math.random() * 10),
  createdOn: "14/07/2025",
}));

export const triggersData = Array.from({ length: 6 }, (_, i) => ({
  id: i + 1,
  name: `Trigger ${i + 1}`,
  description: loremShort,
  type: i % 3 === 0 ? "Schedule" : i % 3 === 1 ? "Webhook" : "Event",
  status: i % 2 === 0 ? "enabled" : "disabled",
  lastRun: "14/07/2025 09:30",
  createdOn: "14/07/2025",
}));

export const jobsData = Array.from({ length: 6 }, (_, i) => ({
  id: i + 1,
  name: `Job-${String(i + 1).padStart(4, "0")}`,
  description: loremShort,
  status: i % 4 === 0 ? "completed" : i % 4 === 1 ? "running" : i % 4 === 2 ? "failed" : "queued",
  duration: `${Math.floor(Math.random() * 120)}s`,
  startedAt: "14/07/2025 08:00",
  createdOn: "14/07/2025",
}));

export const executionsData = Array.from({ length: 6 }, (_, i) => ({
  id: i + 1,
  name: `Execution #${1000 + i}`,
  description: loremShort,
  agent: `Agent ${i + 1}`,
  status: i % 3 === 0 ? "success" : i % 3 === 1 ? "running" : "failed",
  duration: `${Math.floor(Math.random() * 60 + 5)}s`,
  createdOn: "14/07/2025",
}));

export const vaultData = Array.from({ length: 6 }, (_, i) => ({
  id: i + 1,
  name: `Secret-${i + 1}`,
  description: loremShort,
  type: i % 3 === 0 ? "API Key" : i % 3 === 1 ? "Password" : "Token",
  lastAccessed: "14/07/2025",
  createdOn: "14/07/2025",
}));

export const keyStoreData = Array.from({ length: 6 }, (_, i) => ({
  id: i + 1,
  name: `key_${["openai", "anthropic", "stripe", "aws", "github", "sendgrid"][i]}`,
  description: loremShort,
  provider: ["OpenAI", "Anthropic", "Stripe", "AWS", "GitHub", "SendGrid"][i],
  status: i % 4 === 0 ? "expired" : "active",
  createdOn: "14/07/2025",
}));

export const libraryData = Array.from({ length: 6 }, (_, i) => ({
  id: i + 1,
  name: `Template ${i + 1}`,
  description: loremShort,
  category: i % 3 === 0 ? "NLP" : i % 3 === 1 ? "Vision" : "Automation",
  downloads: Math.floor(Math.random() * 500 + 100),
  createdOn: "14/07/2025",
}));

export const modelsData = [
  { id: 1, name: "GPT-4o",          provider: "OpenAI",    type: "LLM",     status: "active",   tokens: "128k", description: loremShort, createdOn: "14/07/2025" },
  { id: 2, name: "Claude 3 Sonnet", provider: "Anthropic", type: "LLM",     status: "active",   tokens: "200k", description: loremShort, createdOn: "14/07/2025" },
  { id: 3, name: "Gemini 1.5 Pro",  provider: "Google",    type: "LLM",     status: "active",   tokens: "1M",   description: loremShort, createdOn: "14/07/2025" },
  { id: 4, name: "Mistral 7B",      provider: "Mistral",   type: "LLM",     status: "idle",     tokens: "32k",  description: loremShort, createdOn: "14/07/2025" },
  { id: 5, name: "DALL-E 3",        provider: "OpenAI",    type: "Vision",   status: "active",   tokens: "N/A",  description: loremShort, createdOn: "14/07/2025" },
  { id: 6, name: "Whisper v3",      provider: "OpenAI",    type: "Audio",    status: "active",   tokens: "N/A",  description: loremShort, createdOn: "14/07/2025" },
];

export const tenantData = {
  name: "Workspace 1",
  plan: "Pro",
  seats: 10,
  usedSeats: 4,
  region: "us-east-1",
  createdOn: "01/01/2025",
  billing: "Monthly",
  nextBilling: "01/08/2025",
};

export const integrationsData = [
  { id: 1, name: "Slack",      category: "Communication", status: "connected",    icon: "💬", description: "Send notifications and messages to Slack channels.", connectedOn: "10/06/2025" },
  { id: 2, name: "GitHub",     category: "DevOps",        status: "connected",    icon: "🐙", description: "Trigger workflows from GitHub events and actions.",   connectedOn: "12/06/2025" },
  { id: 3, name: "Stripe",     category: "Payments",      status: "disconnected", icon: "💳", description: "Process payments and manage billing workflows.",      connectedOn: null },
  { id: 4, name: "SendGrid",   category: "Email",         status: "connected",    icon: "📧", description: "Send transactional emails via SendGrid.",            connectedOn: "15/06/2025" },
  { id: 5, name: "Jira",       category: "Project Mgmt",  status: "disconnected", icon: "📋", description: "Create and update Jira tickets from your agents.",    connectedOn: null },
  { id: 6, name: "AWS S3",     category: "Storage",       status: "connected",    icon: "☁️", description: "Read and write files from AWS S3 buckets.",          connectedOn: "20/06/2025" },
];