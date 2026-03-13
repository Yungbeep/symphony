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
  messages: { role: "user" | "assistant"; content: string }[];
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