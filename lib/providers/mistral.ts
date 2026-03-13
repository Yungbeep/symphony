import type {
  ProviderAdapter,
  CompletionParams,
  CompletionResult,
} from "./index";

export const mistralAdapter: ProviderAdapter = {
  id: "mistral",
  name: "Mistral",

  async complete(params: CompletionParams): Promise<CompletionResult> {
    // Stub — replace with real Mistral SDK call
    return {
      content: `[Mistral stub] Response for ${params.modelId}`,
      modelId: params.modelId,
      isMock: true,
    };
  },

  isConfigured() {
    return false;
  },
};