import type { Model, Message } from "@/lib/types";
import { getProvider } from "@/lib/providers";
import { handoffResponses } from "@/lib/demo/seed-data";
import { uid } from "@/lib/utils/session";

/**
 * Execute a task against a model.
 * Tries the real provider first; falls back to mock responses.
 */
export async function executeTask(
  model: Model,
  messages: { role: "system" | "user" | "assistant"; content: string }[]
): Promise<Message> {
  const provider = getProvider(model.provider);

  if (provider?.isConfigured()) {
    const result = await provider.complete({ modelId: model.id, messages });
    return {
      id: uid("msg"),
      role: "assistant",
      content: result.content,
      timestamp: new Date(),
      model: model.name,
    };
  }

  // Fall back to mock
  const contextStr = messages.map((m) => m.content).join("\n\n");
  const getMock = handoffResponses[model.id] ?? handoffResponses["gpt-4o"];

  return {
    id: uid("msg"),
    role: "assistant",
    content: getMock(contextStr),
    timestamp: new Date(),
    model: model.name,
  };
}