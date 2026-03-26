import {
  Bot,
  Cpu,
  LayoutGrid,
  Globe,
  Server,
  ListOrdered,
  Zap,
  Briefcase,
  Play,
  Lock,
  BookOpen,
  BarChart3,
  Building2,
  Puzzle,
} from 'lucide-react';

export const sidebarSections = [
  {
    title: 'MY PROJECTS',
    items: [
      { id: 'agents', label: 'Agents', icon: Bot },
      { id: 'ai-models', label: 'AI Models', icon: Cpu },
      { id: 'library', label: 'Library', icon: LayoutGrid },
    ],
  },
  {
    title: 'ORCHESTRATOR',
    items: [
      { id: 'published', label: 'Published', icon: Globe },
      { id: 'machines', label: 'Machines', icon: Server },
      { id: 'queues', label: 'Queues', icon: ListOrdered },
      { id: 'triggers', label: 'Triggers', icon: Zap },
      { id: 'jobs', label: 'Jobs', icon: Briefcase },
      { id: 'executions', label: 'Executions', icon: Play },
      { id: 'vault', label: 'Vault', icon: Lock },
    ],
  },
  {
    title: null, // No section header - standalone items
    items: [
      { id: 'knowledge-base', label: 'Knowledge Base', icon: BookOpen },
      { id: 'key-store', label: 'Key Store', icon: BarChart3 },
    ],
  },
  {
    title: 'ADMIN',
    items: [
      { id: 'tenant', label: 'Tenant', icon: Building2 },
      { id: 'integrations', label: 'Integrations', icon: Puzzle },
    ],
  },
];

export const knowledgeBaseCards = [
  {
    id: 1,
    title: 'Test',
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy",
    createdOn: '14/07/2025',
  },
  {
    id: 2,
    title: 'Test',
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy",
    createdOn: '14/07/2025',
  },
  {
    id: 3,
    title: 'Test',
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy",
    createdOn: '14/07/2025',
  },
  {
    id: 4,
    title: 'Test',
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy",
    createdOn: '14/07/2025',
  },
  {
    id: 5,
    title: 'Test',
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy",
    createdOn: '14/07/2025',
  },
  {
    id: 6,
    title: 'Test',
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy",
    createdOn: '14/07/2025',
  },
];
