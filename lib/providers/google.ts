import type {
  ProviderAdapter,
  CompletionParams,
  CompletionResult,
} from "./index";

export const googleAdapter: ProviderAdapter = {
  id: "google",
  name: "Google",

  async complete(params: CompletionParams): Promise<CompletionResult> {
    // Stub — replace with real Gemini SDK call
    return {
      content: `[Google stub] Response for ${params.modelId}`,
      modelId: params.modelId,
      isMock: true,
    };
  },

  isConfigured() {
    return false;
  },
};