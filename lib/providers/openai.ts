import OpenAI from "openai";
import type {
  ProviderAdapter,
  CompletionParams,
  CompletionResult,
} from "./index";

function getClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured");
  }
  return new OpenAI({ apiKey });
}

export const openaiAdapter: ProviderAdapter = {
  id: "openai",
  name: "OpenAI",

  async complete(params: CompletionParams): Promise<CompletionResult> {
    const client = getClient();
    const t0 = Date.now();

    const response = await client.responses.create({
      model: params.modelId,
      input: params.messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
      ...(params.temperature != null && { temperature: params.temperature }),
      ...(params.maxTokens != null && { max_output_tokens: params.maxTokens }),
    });

    const latencyMs = Date.now() - t0;

    const text = response.output
      .filter((item): item is OpenAI.Responses.ResponseOutputMessage => item.type === "message")
      .flatMap((item) => item.content)
      .filter((c): c is OpenAI.Responses.ResponseOutputText => c.type === "output_text")
      .map((c) => c.text)
      .join("");

    return {
      content: text || "[No response content]",
      modelId: params.modelId,
      isMock: false,
      latencyMs,
    };
  },

  isConfigured() {
    return Boolean(process.env.OPENAI_API_KEY);
  },
};