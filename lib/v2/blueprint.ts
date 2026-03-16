import type {
  Blueprint,
  BlueprintAction,
  ProjectToolState,
  ProjectTypeName,
  ToolCategory,
  ToolDefinition,
} from "./types";
import { tools, getToolById, CATEGORY_ORDER } from "./data/tools";
import { getProjectType } from "./data/project-types";

/** Generate a blueprint from the current project configuration */
export function generateBlueprint(
  projectName: string,
  projectType: ProjectTypeName,
  selectedTools: ProjectToolState[]
): Blueprint {
  const typeInfo = getProjectType(projectType);
  const selectedIds = new Set(selectedTools.map((t) => t.toolId));

  // Build role summary per category
  const roleSummary = {} as Record<ToolCategory, string>;
  for (const cat of CATEGORY_ORDER) {
    const catTools = selectedTools.filter((t) => t.category === cat);
    if (catTools.length === 0) {
      roleSummary[cat] = "No tools assigned";
    } else {
      roleSummary[cat] = catTools.map((t) => {
        const def = getToolById(t.toolId);
        return def ? `${def.name} — ${t.role}` : t.role;
      }).join("; ");
    }
  }

  // Find missing recommended tools
  const missingRecommendations: ToolDefinition[] = [];
  if (typeInfo) {
    for (const recId of typeInfo.recommendedTools) {
      if (!selectedIds.has(recId)) {
        const tool = getToolById(recId);
        if (tool) missingRecommendations.push(tool);
      }
    }
  }

  // Generate first actions based on selected tools
  const firstActions = deriveFirstActions(selectedTools, projectType);

  return {
    projectName,
    projectType,
    tools: selectedTools,
    roleSummary,
    firstActions,
    missingRecommendations,
    generatedAt: new Date(),
  };
}

function deriveFirstActions(
  selectedTools: ProjectToolState[],
  projectType: ProjectTypeName
): BlueprintAction[] {
  const actions: BlueprintAction[] = [];
  const ids = new Set(selectedTools.map((t) => t.toolId));

  // Always start with repo setup if GitHub is selected
  if (ids.has("github")) {
    actions.push({
      title: "Initialize repository",
      description:
        "Create the project repo, set up branch protection, and configure CI pipeline.",
      toolId: "github",
      category: "build",
    });
  }

  // Database setup
  if (ids.has("supabase")) {
    actions.push({
      title: "Set up database schema",
      description:
        "Design initial tables, configure row-level security, and seed development data.",
      toolId: "supabase",
      category: "build",
    });
  }

  // Auth setup
  if (ids.has("clerk")) {
    actions.push({
      title: "Configure authentication",
      description:
        "Set up sign-in providers, configure session management, and add auth middleware.",
      toolId: "clerk",
      category: "build",
    });
  }

  // Deployment
  if (ids.has("vercel")) {
    actions.push({
      title: "Connect deployment pipeline",
      description:
        "Link the repository to Vercel, configure environment variables, and verify preview deploys.",
      toolId: "vercel",
      category: "ship",
    });
  }

  // Domain
  if (ids.has("namecheap") || ids.has("cloudflare")) {
    actions.push({
      title: "Set up domain and DNS",
      description:
        "Register or connect the project domain, configure DNS records, and enable SSL.",
      toolId: ids.has("cloudflare") ? "cloudflare" : "namecheap",
      category: "ship",
    });
  }

  // Analytics
  if (ids.has("posthog")) {
    actions.push({
      title: "Add product analytics",
      description:
        "Install PostHog SDK, define key events, and set up the first dashboard.",
      toolId: "posthog",
      category: "observe",
    });
  }

  // Monitoring
  if (ids.has("sentry")) {
    actions.push({
      title: "Configure error tracking",
      description:
        "Install Sentry SDK, set up source maps, and configure alert rules.",
      toolId: "sentry",
      category: "observe",
    });
  }

  // AI-specific action
  if (
    (projectType === "ai-tool" || projectType === "saas-mvp") &&
    (ids.has("chatgpt") || ids.has("claude"))
  ) {
    actions.push({
      title: "Design prompt architecture",
      description:
        "Define the core prompt templates, model routing strategy, and context management approach.",
      toolId: ids.has("claude") ? "claude" : "chatgpt",
      category: "brain",
    });
  }

  // Payments
  if (ids.has("whop")) {
    actions.push({
      title: "Set up payment flow",
      description:
        "Configure product tiers, connect payment processing, and test the checkout experience.",
      toolId: "whop",
      category: "sell",
    });
  }

  // Return top 3
  return actions.slice(0, 3);
}