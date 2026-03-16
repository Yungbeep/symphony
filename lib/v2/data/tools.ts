import type { ToolDefinition, ToolCategory } from "../types";

export const CATEGORY_META: Record<
  ToolCategory,
  { label: string; description: string }
> = {
  brain: {
    label: "Brain",
    description: "Reasoning, planning, and generation",
  },
  build: {
    label: "Build",
    description: "Code, data, and authentication",
  },
  ship: {
    label: "Ship",
    description: "Deployment, delivery, and infrastructure",
  },
  observe: {
    label: "Observe",
    description: "Analytics, monitoring, and error tracking",
  },
  sell: {
    label: "Sell",
    description: "Monetization and distribution",
  },
};

export const CATEGORY_ORDER: ToolCategory[] = [
  "brain",
  "build",
  "ship",
  "observe",
  "sell",
];

export const tools: ToolDefinition[] = [
  // Brain
  {
    id: "chatgpt",
    name: "ChatGPT",
    category: "brain",
    description:
      "OpenAI's conversational model. Fast iteration, broad knowledge, strong at code generation and general reasoning.",
    role: "Primary reasoning and generation engine",
    icon: "chatgpt",
    status: "active",
  },
  {
    id: "claude",
    name: "Claude",
    category: "brain",
    description:
      "Anthropic's model. Deep reasoning, long-context understanding, careful analysis, and nuanced writing.",
    role: "Deep analysis and long-context reasoning",
    icon: "claude",
    status: "active",
  },

  // Build
  {
    id: "github",
    name: "GitHub",
    category: "build",
    description:
      "Version control, code hosting, CI/CD pipelines, and collaboration. The center of your development workflow.",
    role: "Source control and CI/CD",
    icon: "github",
    status: "active",
  },
  {
    id: "supabase",
    name: "Supabase",
    category: "build",
    description:
      "Postgres database, auth, storage, and realtime subscriptions. Backend infrastructure in minutes.",
    role: "Database, auth, and backend services",
    icon: "supabase",
    status: "active",
  },
  {
    id: "clerk",
    name: "Clerk",
    category: "build",
    description:
      "Drop-in authentication and user management. Handles sign-up, sign-in, sessions, and multi-factor.",
    role: "Authentication and user management",
    icon: "clerk",
    status: "active",
  },

  // Ship
  {
    id: "vercel",
    name: "Vercel",
    category: "ship",
    description:
      "Frontend deployment platform. Push-to-deploy, edge functions, preview environments, and global CDN.",
    role: "Frontend deployment and edge compute",
    icon: "vercel",
    status: "active",
  },
  {
    id: "resend",
    name: "Resend",
    category: "ship",
    description:
      "Transactional email API. Clean developer experience for sending emails at scale.",
    role: "Transactional email delivery",
    icon: "resend",
    status: "active",
  },
  {
    id: "cloudflare",
    name: "Cloudflare",
    category: "ship",
    description:
      "DNS, CDN, DDoS protection, and edge workers. Global infrastructure layer for performance and security.",
    role: "DNS, CDN, and edge security",
    icon: "cloudflare",
    status: "active",
  },
  {
    id: "namecheap",
    name: "Namecheap",
    category: "ship",
    description:
      "Domain registration and management. Get your project a name and point it at the right infrastructure.",
    role: "Domain registration",
    icon: "namecheap",
    status: "active",
  },

  // Observe
  {
    id: "posthog",
    name: "PostHog",
    category: "observe",
    description:
      "Product analytics, feature flags, session recording, and A/B testing. Understand how users actually use your product.",
    role: "Product analytics and feature flags",
    icon: "posthog",
    status: "active",
  },
  {
    id: "sentry",
    name: "Sentry",
    category: "observe",
    description:
      "Error tracking, performance monitoring, and session replay. Know when things break before your users tell you.",
    role: "Error tracking and performance monitoring",
    icon: "sentry",
    status: "active",
  },

  // Sell
  {
    id: "whop",
    name: "Whop",
    category: "sell",
    description:
      "Commerce platform for digital products. Payments, access control, community, and storefronts.",
    role: "Payments and digital commerce",
    icon: "whop",
    status: "active",
  },
];

export function getToolById(id: string): ToolDefinition | undefined {
  return tools.find((t) => t.id === id);
}

export function getToolsByCategory(category: ToolCategory): ToolDefinition[] {
  return tools.filter((t) => t.category === category);
}