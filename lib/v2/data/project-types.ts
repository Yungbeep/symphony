import type { ProjectType } from "../types";

export const projectTypes: ProjectType[] = [
  {
    id: "saas-mvp",
    name: "SaaS MVP",
    description:
      "Full-stack web application with auth, database, payments, and deployment. Built to validate fast and iterate.",
    recommendedTools: [
      "claude",
      "chatgpt",
      "github",
      "supabase",
      "clerk",
      "vercel",
      "resend",
      "posthog",
      "sentry",
      "whop",
    ],
    icon: "layers",
  },
  {
    id: "ai-tool",
    name: "AI Tool",
    description:
      "AI-powered product with model integrations, prompt pipelines, and a polished interface. Reasoning at the core.",
    recommendedTools: [
      "claude",
      "chatgpt",
      "github",
      "supabase",
      "vercel",
      "posthog",
      "sentry",
    ],
    icon: "brain",
  },
  {
    id: "internal-tool",
    name: "Internal Tool",
    description:
      "Private dashboards, admin panels, or workflow tools. Optimized for team productivity over public distribution.",
    recommendedTools: [
      "chatgpt",
      "github",
      "supabase",
      "clerk",
      "vercel",
      "sentry",
    ],
    icon: "wrench",
  },
  {
    id: "landing-page",
    name: "Landing Page",
    description:
      "High-converting marketing page with strong copy, analytics, and domain setup. Ship in a day.",
    recommendedTools: [
      "claude",
      "github",
      "vercel",
      "cloudflare",
      "namecheap",
      "posthog",
    ],
    icon: "layout",
  },
  {
    id: "marketplace",
    name: "Marketplace",
    description:
      "Multi-sided platform with listings, transactions, and user management. Built for commerce at scale.",
    recommendedTools: [
      "chatgpt",
      "claude",
      "github",
      "supabase",
      "clerk",
      "vercel",
      "cloudflare",
      "posthog",
      "sentry",
      "whop",
    ],
    icon: "store",
  },
];

export function getProjectType(id: string) {
  return projectTypes.find((pt) => pt.id === id);
}