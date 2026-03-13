import type { Model, Provider } from "@/lib/types";

/** All models available in Symphony */
export const models: Model[] = [
  { id: "gpt-4o", name: "GPT-4o", provider: "openai", tag: "Fast" },
  { id: "o3", name: "o3", provider: "openai", tag: "Reasoning" },
  { id: "claude-sonnet-4", name: "Claude Sonnet 4", provider: "anthropic", tag: "Balanced" },
  { id: "claude-opus-4", name: "Claude Opus 4", provider: "anthropic", tag: "Deep" },
  { id: "gemini-2.5-pro", name: "Gemini 2.5 Pro", provider: "google" },
  { id: "mistral-large", name: "Mistral Large", provider: "mistral" },
];

/** Look up a model by ID — falls back to first model */
export function getModel(id: string): Model {
  return models.find((m) => m.id === id) ?? models[0];
}

/** Provider display colors */
export const providerColors: Record<Provider, string> = {
  openai: "#10a37f",
  anthropic: "#d4a574",
  google: "#4285f4",
  mistral: "#ff7000",
};

/** Provider display names */
export const providerNames: Record<Provider, string> = {
  openai: "OpenAI",
  anthropic: "Anthropic",
  google: "Google",
  mistral: "Mistral",
};