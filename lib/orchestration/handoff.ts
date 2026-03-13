import type { Message, Model, Session } from "@/lib/types";
import { handoffResponses } from "@/lib/demo/seed-data";
import { uid } from "@/lib/utils/session";

export interface HandoffResult {
  session: Session;
}

/**
 * Build a handoff session: carries context from the source session
 * into a new session targeting a different model.
 *
 * Currently uses mock responses. When real providers are wired,
 * replace the response lookup with a provider.complete() call.
 */
export function buildHandoffSession(
  sourceSession: Session,
  targetModel: Model,
  contextMessages: Message[]
): HandoffResult {
  const contextStr = contextMessages.map((m) => m.content).join("\n\n");

  const getResponse =
    handoffResponses[targetModel.id] ?? handoffResponses["gpt-4o"];
  const responseContent = getResponse(contextStr);

  const now = new Date();

  const session: Session = {
    id: uid("handoff"),
    title: `${sourceSession.title} → ${targetModel.name}`,
    model: targetModel,
    createdAt: now,
    updatedAt: now,
    messages: [
      // Carry over the last user message as context
      ...contextMessages
        .filter((m) => m.role === "user")
        .slice(-1)
        .map((m) => ({
          ...m,
          id: `ho-ctx-${m.id}`,
          timestamp: new Date(now.getTime() - 5000),
        })),
      // Handoff indicator
      {
        id: uid("ho-indicator"),
        role: "assistant" as const,
        content: `Context handed off from ${sourceSession.model.name}. Continuing with ${targetModel.name}.`,
        timestamp: new Date(now.getTime() - 2000),
        model: "Symphony",
      },
      // Target model's response
      {
        id: uid("ho-response"),
        role: "assistant" as const,
        content: responseContent,
        timestamp: now,
        model: targetModel.name,
      },
    ],
  };

  return { session };
}