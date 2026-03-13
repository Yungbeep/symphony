import type {
  ProviderAdapter,
  CompletionParams,
  CompletionResult,
} from "./index";

export const openaiAdapter: ProviderAdapter = {
  id: "openai",
  name: "OpenAI",

  async complete(params: CompletionParams): Promise<CompletionResult> {
    // Stub — replace with real OpenAI SDK call
    return {
      content: `[OpenAI stub] Response for ${params.modelId}`,
      modelId: params.modelId,
      isMock: true,
    };
  },

  isConfigured() {
    return false;
  },
};