export type Provider = "openai" | "anthropic" | "google" | "mistral";

export interface Model {
  id: string;
  name: string;
  provider: Provider;
  tag?: string;
}

export type MessageStatus = "idle" | "streaming" | "done" | "error" | "cancelled";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  model?: string;
  status?: MessageStatus;
}

export interface Session {
  id: string;
  title: string;
  messages: Message[];
  model: Model;
  createdAt: Date;
  updatedAt: Date;
}

export interface Project {
  id: string;
  name: string;
  sessions: Session[];
  color: string;
}

export interface SavedPrompt {
  id: string;
  title: string;
  content: string;
  tags: string[];
}

export type HandoffMode = "new-session" | "split-view";

export interface HandoffRequest {
  sourceSession: Session;
  targetModel: Model;
  mode: HandoffMode;
  /** Messages to carry over — usually the last exchange or entire thread */
  context: Message[];
}

export type Theme = "dark" | "light";

export type ChatRole = "system" | "user" | "assistant";

export interface ChatMessageInput {
  role: ChatRole;
  content: string;
}
