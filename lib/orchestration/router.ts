import type { Model } from "@/lib/types";
import { models } from "@/lib/models/catalog";

/** Task categories Symphony can route */
export type TaskCategory =
  | "planning"
  | "coding"
  | "reasoning"
  | "general"
  | "review";

/** Simple keyword-based classifier — replace with something smarter later */
export function classifyTask(prompt: string): TaskCategory {
  const lower = prompt.toLowerCase();

  if (/\b(plan|architect|design|strategy|migrate|migration)\b/.test(lower))
    return "planning";
  if (/\b(implement|code|build|write.*function|refactor|debug)\b/.test(lower))
    return "coding";
  if (/\b(reason|think.*through|step.*by.*step|analyze|evaluate)\b/.test(lower))
    return "reasoning";
  if (/\b(review|audit|check|assess)\b/.test(lower)) return "review";

  return "general";
}

/** Suggested model per task category — opinionated defaults */
const categoryDefaults: Record<TaskCategory, string> = {
  planning: "claude-opus-4",
  coding: "claude-sonnet-4",
  reasoning: "o3",
  general: "gpt-4o",
  review: "claude-sonnet-4",
};

/** Given a prompt, suggest the best model from the catalog */
export function suggestModel(prompt: string): Model {
  const category = classifyTask(prompt);
  const modelId = categoryDefaults[category];
  return models.find((m) => m.id === modelId) ?? models[0];
}