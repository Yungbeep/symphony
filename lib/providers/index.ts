import type { Provider } from "@/lib/types";

/** Shape every provider adapter must implement */
export interface ProviderAdapter {
  readonly id: Provider;
  readonly name: string;

  /** Send a prompt and return the response text. */
  complete(params: CompletionParams): Promise<CompletionResult>;

  /** Whether this adapter has real credentials configured */
  isConfigured(): boolean;
}

export interface CompletionParams {
  modelId: string;
  messages: { role: "system" | "user" | "assistant"; content: string }[];
  temperature?: number;
  maxTokens?: number;
}

export interface CompletionResult {
  content: string;
  modelId: string;
  /** True when the result came from a mock, not a real API */
  isMock: boolean;
  latencyMs?: number;
}

/** Registry of all provider adapters */
const adapters = new Map<Provider, ProviderAdapter>();

export function registerProvider(adapter: ProviderAdapter) {
  adapters.set(adapter.id, adapter);
}

export function getProvider(id: Provider): ProviderAdapter | undefined {
  return adapters.get(id);
}

export function allProviders(): ProviderAdapter[] {
  return Array.from(adapters.values());
}

let initialized = false;

/** Register all provider adapters once. Safe to call multiple times. */
export async function initializeProviders() {
  if (initialized) return;
  initialized = true;

  // Dynamic imports so each adapter resolves its own deps
  const { openaiAdapter } = await import("./openai");
  const { anthropicAdapter } = await import("./anthropic");
  const { googleAdapter } = await import("./google");
  const { mistralAdapter } = await import("./mistral");

  registerProvider(openaiAdapter);
  registerProvider(anthropicAdapter);
  registerProvider(googleAdapter);
  registerProvider(mistralAdapter);
}