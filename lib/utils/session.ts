import type { Message, Model, Session } from "@/lib/types";

let _counter = 0;

/** Generate a unique ID with an optional prefix */
export function uid(prefix = "id"): string {
  _counter += 1;
  return `${prefix}-${Date.now()}-${_counter}`;
}

/** Create a message object with sensible defaults */
export function createMessage(
  role: "user" | "assistant",
  content: string,
  opts?: { model?: string; timestamp?: Date }
): Message {
  return {
    id: uid("msg"),
    role,
    content,
    timestamp: opts?.timestamp ?? new Date(),
    model: opts?.model,
  };
}

/** Create a new empty session */
export function createSession(model: Model, title?: string): Session {
  const now = new Date();
  return {
    id: uid("session"),
    title: title ?? "New session",
    model,
    messages: [],
    createdAt: now,
    updatedAt: now,
  };
}

/** Append messages to a session (immutable) */
export function appendMessages(
  session: Session,
  messages: Message[]
): Session {
  return {
    ...session,
    messages: [...session.messages, ...messages],
    updatedAt: new Date(),
  };
}
