"use client";

import { useState, useCallback, useMemo } from "react";
import type { Model, Message, Session, HandoffMode } from "@/lib/types";
import type {
  WorkspaceState,
  WorkspaceActions,
} from "@/lib/store/workspace-store";
import { sampleSessions } from "@/lib/demo/seed-data";
import { models } from "@/lib/models/catalog";
import { buildHandoffSession } from "@/lib/orchestration/handoff";
import { appendMessages } from "@/lib/utils/session";

/**
 * All workspace state + actions extracted from page.tsx.
 * The page component becomes a thin layout shell.
 */
export function useWorkspaceState(): WorkspaceState & WorkspaceActions {
  const [sessions, setSessions] = useState<Session[]>(() => [...sampleSessions]);
  const [activeSessionId, setActiveSessionId] = useState(sampleSessions[0].id);
  const [activeModel, setActiveModel] = useState<Model>(models[2]); // Claude Sonnet 4
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [promptLibraryOpen, setPromptLibraryOpen] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [splitView, setSplitView] = useState(false);
  const [insertedPrompt, setInsertedPrompt] = useState<string | undefined>();

  // Handoff state
  const [handoffOpen, setHandoffOpen] = useState(false);
  const [handoffContext, setHandoffContext] = useState<Message[]>([]);
  const [handoffSession, setHandoffSession] = useState<Session | null>(null);
  const [handoffLoading, setHandoffLoading] = useState(false);
  const [handoffError, setHandoffError] = useState<string | null>(null);

  // Derived
  const activeSession = useMemo(
    () => sessions.find((s) => s.id === activeSessionId) ?? sessions[0],
    [sessions, activeSessionId]
  );

  // --- Helpers ---

  /** Replace a session in state by ID (immutable) */
  const updateSession = useCallback((updated: Session) => {
    setSessions((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
  }, []);

  // --- Actions ---

  const toggleSidebar = useCallback(() => setSidebarCollapsed((v) => !v), []);
  const togglePromptLibrary = useCallback(
    () => setPromptLibraryOpen((v) => !v),
    []
  );
  const toggleFocusMode = useCallback(() => setFocusMode((v) => !v), []);

  const toggleSplitView = useCallback(() => {
    setSplitView((v) => {
      if (v) setHandoffSession(null);
      return !v;
    });
  }, []);

  const insertPrompt = useCallback((content: string) => {
    setInsertedPrompt(content);
    setTimeout(() => setInsertedPrompt(undefined), 100);
  }, []);

  const requestHandoff = useCallback((contextMessages: Message[]) => {
    setHandoffContext(contextMessages);
    setHandoffOpen(true);
  }, []);

  const closeHandoff = useCallback(() => setHandoffOpen(false), []);

  const clearHandoffSession = useCallback(() => setHandoffSession(null), []);

  const addSession = useCallback((session: Session) => {
    setSessions((prev) => {
      if (prev.some((s) => s.id === session.id)) return prev;
      return [session, ...prev];
    });
  }, []);

  const executeHandoff = useCallback(
    async (targetModel: Model, mode: HandoffMode) => {
      const { session: newSession } = buildHandoffSession(
        activeSession,
        targetModel,
        handoffContext
      );

      setHandoffOpen(false);
      setHandoffError(null);

      // Persist the handoff session immediately
      setSessions((prev) => {
        if (prev.some((s) => s.id === newSession.id)) return prev;
        return [newSession, ...prev];
      });

      if (mode === "split-view") {
        setHandoffSession(newSession);
        setSplitView(true);
      } else {
        setActiveSessionId(newSession.id);
        setHandoffSession(null);
        setSplitView(false);
      }

      setHandoffLoading(true);

      try {
        const messages = handoffContext.map((m) => ({
          role: m.role as "system" | "user" | "assistant",
          content: m.content,
        }));

        const res = await fetch("/api/execute-task", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ modelId: targetModel.id, messages }),
        });

        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.detail || body.error || `HTTP ${res.status}`);
        }

        const data = await res.json();

        const msg: Message = {
          ...data.message,
          timestamp: new Date(data.message.timestamp),
        };

        const updated = appendMessages(
          {
            ...newSession,
            // Remove the mock assistant response and replace it with the API response
            messages: newSession.messages.slice(0, -1),
          },
          [msg]
        );

        updateSession(updated);

        if (mode === "split-view") {
          setHandoffSession(updated);
        }
      } catch (err) {
        // Mock fallback is already visible in the session, so just surface the error
        setHandoffError(err instanceof Error ? err.message : "Execution failed");
      } finally {
        setHandoffLoading(false);
      }
    },
    [handoffContext, activeSession, updateSession]
  );

  return {
    // State
    sessions,
    activeSessionId,
    activeModel,
    sidebarCollapsed,
    promptLibraryOpen,
    focusMode,
    splitView,
    insertedPrompt,
    handoffOpen,
    handoffContext,
    handoffSession,
    handoffLoading,
    handoffError,

    // Actions
    setActiveSessionId,
    setActiveModel,
    toggleSidebar,
    togglePromptLibrary,
    toggleFocusMode,
    toggleSplitView,
    insertPrompt,
    requestHandoff,
    executeHandoff,
    closeHandoff,
    clearHandoffSession,
    addSession,
  };
}