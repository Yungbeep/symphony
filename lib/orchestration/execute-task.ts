import type { Model, Message } from "@/lib/types";
import { getProvider, type StreamChunk } from "@/lib/providers";
import { handoffResponses } from "@/lib/demo/seed-data";
import { uid } from "@/lib/utils/session";

type ChatMessages = { role: "system" | "user" | "assistant"; content: string }[];

/**
 * Execute a task against a model (non-streaming).
 * Tries the real provider first; falls back to mock responses.
 */
export async function executeTask(
  model: Model,
  messages: ChatMessages
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

/**
 * Stream a task against a model.
 * If the provider supports streaming and is configured, uses real streaming.
 * Otherwise, simulates streaming by yielding the mock response word-by-word.
 */
export async function* streamTask(
  model: Model,
  messages: ChatMessages
): AsyncIterable<StreamChunk> {
  const provider = getProvider(model.provider);

  // Real streaming path
  if (provider?.isConfigured() && provider.stream) {
    yield* provider.stream({ modelId: model.id, messages });
    return;
  }

  // Mock streaming — yield the mock response word-by-word
  const contextStr = messages.map((m) => m.content).join("\n\n");
  const getMock = handoffResponses[model.id] ?? handoffResponses["gpt-4o"];
  const mockText = getMock(contextStr);

  // Split into small chunks to simulate realistic streaming
  const words = mockText.split(/( )/);
  for (const word of words) {
    yield { type: "chunk", content: word };
    // Small delay is handled on the route side via sleep if needed,
    // but for NDJSON the client renders as chunks arrive
  }

  yield { type: "done", modelId: model.id, isMock: true };
}