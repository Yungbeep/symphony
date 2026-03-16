// ---------------------------------------------------------------------------
// Symphony V2 — Core Types
// ---------------------------------------------------------------------------

// --- Tool System ---

export type ToolCategory = "brain" | "build" | "ship" | "observe" | "sell";

export type ToolStatus = "active" | "available" | "recommended" | "coming-soon";

export interface ToolDefinition {
  id: string;
  name: string;
  category: ToolCategory;
  description: string;
  /** What role this tool plays when seated in the orchestra */
  role: string;
  icon: string; // Identifier for rendering (mapped in component)
  url?: string;
  status: ToolStatus;
}

/** A tool that has been assigned to a project's orchestra */
export interface ProjectToolState {
  toolId: string;
  category: ToolCategory;
  /** User-facing role label for this tool in the project */
  role: string;
  addedAt: Date;
  config?: Record<string, unknown>;
}

// --- Project Types ---

export type ProjectTypeName =
  | "saas-mvp"
  | "ai-tool"
  | "internal-tool"
  | "landing-page"
  | "marketplace";

export interface ProjectType {
  id: ProjectTypeName;
  name: string;
  description: string;
  /** Tool IDs that are strongly recommended for this project type */
  recommendedTools: string[];
  icon: string;
}

// --- Project ---

export type ProjectStage =
  | "setup"
  | "building"
  | "shipping"
  | "live"
  | "paused";

export interface Project {
  id: string;
  name: string;
  description: string;
  type: ProjectTypeName;
  stage: ProjectStage;
  tools: ProjectToolState[];
  blueprint: Blueprint | null;
  createdAt: Date;
  updatedAt: Date;
}

// --- Blueprint ---

export interface BlueprintAction {
  title: string;
  description: string;
  toolId?: string;
  category: ToolCategory;
}

export interface Blueprint {
  projectName: string;
  projectType: ProjectTypeName;
  tools: ProjectToolState[];
  /** Role summary for each category in the orchestra */
  roleSummary: Record<ToolCategory, string>;
  /** First recommended actions to take */
  firstActions: BlueprintAction[];
  /** Tools that are recommended but not yet added */
  missingRecommendations: ToolDefinition[];
  generatedAt: Date;
}

// --- Onboarding Flow ---

export type OnboardingStep = "basics" | "type" | "orchestra" | "review";

export interface OnboardingState {
  step: OnboardingStep;
  projectName: string;
  projectDescription: string;
  projectType: ProjectTypeName | null;
  selectedTools: ProjectToolState[];
}

// --- Future: Threads, Memory, Orchestration ---

export interface Thread {
  id: string;
  projectId: string;
  title: string;
  messages: ThreadMessage[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ThreadMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  toolId?: string;
  timestamp: Date;
}

export interface MemoryEntry {
  id: string;
  projectId: string;
  content: string;
  source: "user" | "agent" | "tool";
  tags: string[];
  createdAt: Date;
}

export interface Handoff {
  id: string;
  fromToolId: string;
  toToolId: string;
  context: string;
  status: "pending" | "completed" | "failed";
  createdAt: Date;
}