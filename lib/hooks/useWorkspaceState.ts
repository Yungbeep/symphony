"use client";

import { useState, useCallback, useMemo } from "react";
import type { Model, Message, Session, HandoffMode } from "@/lib/types";
import type { WorkspaceState, WorkspaceActions } from "@/lib/store/workspace-store";
import { sampleSessions } from "@/lib/demo/seed-data";
import { models } from "@/lib/models/catalog";
import { buildHandoffSession } from "@/lib/orchestration/handoff";

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

  // Derived
  const activeSession = useMemo(
    () => sessions.find((s) => s.id === activeSessionId) ?? sessions[0],
    [sessions, activeSessionId]
  );

  // --- Actions ---

  const toggleSidebar = useCallback(() => setSidebarCollapsed((v) => !v), []);
  const togglePromptLibrary = useCallback(() => setPromptLibraryOpen((v) => !v), []);
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
    (targetModel: Model, mode: HandoffMode) => {
      const { session: newSession } = buildHandoffSession(
        activeSession,
        targetModel,
        handoffContext
      );

      setHandoffOpen(false);

      // Always persist the handoff session so it appears in the sidebar
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
    },
    [handoffContext, activeSession]
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