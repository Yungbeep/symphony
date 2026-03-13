import type {
  ProviderAdapter,
  CompletionParams,
  CompletionResult,
} from "./index";

export const anthropicAdapter: ProviderAdapter = {
  id: "anthropic",
  name: "Anthropic",

  async complete(params: CompletionParams): Promise<CompletionResult> {
    // Stub — replace with real Anthropic SDK call
    return {
      content: `[Anthropic stub] Response for ${params.modelId}`,
      modelId: params.modelId,
      isMock: true,
    };
  },

  isConfigured() {
    return false;
  },
};