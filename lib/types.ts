export type Provider = "openai" | "anthropic" | "google" | "mistral";

export interface Model {
  id: string;
  name: string;
  provider: Provider;
  tag?: string;
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  model?: string;
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

export type Theme = "dark" | "light";
