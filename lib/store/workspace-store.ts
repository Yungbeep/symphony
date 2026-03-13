import type { Message, Model, Session } from "@/lib/types";

/**
 * Plain object representing the workspace's full UI state.
 * Not a global store yet — just a shape that useWorkspaceState manages.
 * When we add persistence (Supabase, localStorage, etc.) this becomes
 * the serialization boundary.
 */
export interface WorkspaceState {
  sessions: Session[];
  activeSessionId: string;
  activeModel: Model;

  sidebarCollapsed: boolean;
  promptLibraryOpen: boolean;
  focusMode: boolean;
  splitView: boolean;

  insertedPrompt: string | undefined;

  handoffOpen: boolean;
  handoffContext: Message[];
  handoffSession: Session | null;

  /** True while an async handoff execution is in flight */
  handoffLoading: boolean;
  /** Last handoff execution error, if any */
  handoffError: string | null;
}

export interface WorkspaceActions {
  setActiveSessionId: (id: string) => void;
  setActiveModel: (model: Model) => void;
  sendMessage: (content: string) => Promise<void>;

  toggleSidebar: () => void;
  togglePromptLibrary: () => void;
  toggleFocusMode: () => void;
  toggleSplitView: () => void;

  insertPrompt: (content: string) => void;
  requestHandoff: (contextMessages: Message[]) => void;
  executeHandoff: (targetModel: Model, mode: "new-session" | "split-view") => void;
  closeHandoff: () => void;
  clearHandoffSession: () => void;
  addSession: (session: Session) => void;
}