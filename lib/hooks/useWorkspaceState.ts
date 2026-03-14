"use client";

import { useState, useCallback, useMemo, useRef } from "react";
import type { Model, Message, Session, HandoffMode } from "@/lib/types";
import type {
  WorkspaceState,
  WorkspaceActions,
} from "@/lib/store/workspace-store";
import { sampleSessions } from "@/lib/demo/seed-data";
import { models } from "@/lib/models/catalog";
import { buildHandoffSession } from "@/lib/orchestration/handoff";
import {
  appendMessages,
  createMessage,
  updateMessage,
} from "@/lib/utils/session";

// ---------------------------------------------------------------------------
// NDJSON stream reader
// ---------------------------------------------------------------------------

interface StreamChunkMsg {
  type: "chunk" | "done" | "error";
  content?: string;
  modelId?: string;
  isMock?: boolean;
  message?: string;
}

async function readNDJSONStream(
  reader: ReadableStreamDefaultReader<Uint8Array>,
  onChunk: (chunk: StreamChunkMsg) => void
) {
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });

    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      try {
        onChunk(JSON.parse(trimmed));
      } catch {
        // skip malformed lines
      }
    }
  }

  if (buffer.trim()) {
    try {
      onChunk(JSON.parse(buffer.trim()));
    } catch {
      // skip
    }
  }
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useWorkspaceState(): WorkspaceState & WorkspaceActions {
  const [sessions, setSessions] = useState<Session[]>(() => [...sampleSessions]);
  const [activeSessionId, setActiveSessionId] = useState(sampleSessions[0].id);
  const [activeModel, setActiveModel] = useState<Model>(models[2]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [promptLibraryOpen, setPromptLibraryOpen] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [splitView, setSplitView] = useState(false);
  const [insertedPrompt, setInsertedPrompt] = useState<string | undefined>();
  const [isStreaming, setIsStreaming] = useState(false);

  const [handoffOpen, setHandoffOpen] = useState(false);
  const [handoffContext, setHandoffContext] = useState<Message[]>([]);
  const [handoffSession, setHandoffSession] = useState<Session | null>(null);
  const [handoffLoading, setHandoffLoading] = useState(false);
  const [handoffError, setHandoffError] = useState<string | null>(null);

  const activeStreamRef = useRef<{
    sessionId: string;
    assistantMessageId: string;
    controller: AbortController;
  } | null>(null);

  const sessionsRef = useRef(sessions);
  sessionsRef.current = sessions;

  const activeSession = useMemo(
    () => sessions.find((s) => s.id === activeSessionId) ?? sessions[0],
    [sessions, activeSessionId]
  );

  const updateSessionById = useCallback(
    (sessionId: string, updater: (s: Session) => Session) => {
      setSessions((prev) =>
        prev.map((s) => (s.id === sessionId ? updater(s) : s))
      );
    },
    []
  );

  const updateSessionDirect = useCallback((updated: Session) => {
    setSessions((prev) =>
      prev.map((s) => (s.id === updated.id ? updated : s))
    );
  }, []);

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

  const stopGenerating = useCallback(() => {
    activeStreamRef.current?.controller.abort();
  }, []);

  const streamAssistantReply = useCallback(
    async (baseSession: Session) => {
      if (isStreaming) return;

      const assistantPlaceholder = createMessage("assistant", "", {
        model: baseSession.model.name,
        status: "streaming",
      });

      const sessionWithPlaceholder = appendMessages(baseSession, [
        assistantPlaceholder,
      ]);
      updateSessionDirect(sessionWithPlaceholder);

      const sessionId = baseSession.id;
      const msgId = assistantPlaceholder.id;

      const controller = new AbortController();
      activeStreamRef.current = {
        sessionId,
        assistantMessageId: msgId,
        controller,
      };
      setIsStreaming(true);

      try {
        const apiMessages = baseSession.messages.map((m) => ({
          role: m.role as "system" | "user" | "assistant",
          content: m.content,
        }));

        const res = await fetch("/api/execute-task?stream=1", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            modelId: baseSession.model.id,
            messages: apiMessages,
          }),
          signal: controller.signal,
        });

        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.detail || body.error || `HTTP ${res.status}`);
        }

        const reader = res.body?.getReader();
        if (!reader) throw new Error("No response stream");

        let accumulated = "";

        await readNDJSONStream(reader, (chunk) => {
          const activeStream = activeStreamRef.current;

          if (
            !activeStream ||
            activeStream.sessionId !== sessionId ||
            activeStream.assistantMessageId !== msgId
          ) {
            return;
          }

          if (chunk.type === "chunk" && chunk.content) {
            accumulated += chunk.content;
            const text = accumulated;
            updateSessionById(sessionId, (s) =>
              updateMessage(s, msgId, { content: text })
            );
          } else if (chunk.type === "done") {
            updateSessionById(sessionId, (s) =>
              updateMessage(s, msgId, { status: "done" })
            );
          } else if (chunk.type === "error") {
            updateSessionById(sessionId, (s) =>
              updateMessage(s, msgId, {
                content: `Error: ${chunk.message ?? "Unknown error"}`,
                status: "error",
              })
            );
          }
        });

        updateSessionById(sessionId, (s) => {
          const msg = s.messages.find((m) => m.id === msgId);
          if (msg && msg.status === "streaming") {
            return updateMessage(s, msgId, { status: "done" });
          }
          return s;
        });
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          updateSessionById(sessionId, (s) =>
            updateMessage(s, msgId, { status: "cancelled" })
          );
        } else {
          const errorText =
            err instanceof Error ? err.message : "Message send failed";

          updateSessionById(sessionId, (s) =>
            updateMessage(s, msgId, {
              content: `Request failed: ${errorText}`,
              status: "error",
            })
          );
        }
      } finally {
        const activeStream = activeStreamRef.current;
        if (
          activeStream &&
          activeStream.sessionId === sessionId &&
          activeStream.assistantMessageId === msgId
        ) {
          activeStreamRef.current = null;
          setIsStreaming(false);
        }
      }
    },
    [isStreaming, updateSessionById, updateSessionDirect]
  );

  const sendMessage = useCallback(
    async (content: string) => {
      const trimmed = content.trim();
      if (!trimmed || isStreaming) return;

      const userMessage = createMessage("user", trimmed);
      const sessionWithUser = appendMessages(activeSession, [userMessage]);

      updateSessionDirect(sessionWithUser);
      await streamAssistantReply(sessionWithUser);
    },
    [activeSession, isStreaming, streamAssistantReply, updateSessionDirect]
  );

  const retryMessage = useCallback(
    async (sessionId: string, assistantMessageId: string) => {
      const session = sessionsRef.current.find((s) => s.id === sessionId);
      if (!session || isStreaming) return;

      const assistantIndex = session.messages.findIndex(
        (m) => m.id === assistantMessageId && m.role === "assistant"
      );
      if (assistantIndex === -1) return;

      const priorMessages = session.messages.slice(0, assistantIndex);
      const lastUserIndex = [...priorMessages]
        .map((m, idx) => ({ message: m, idx }))
        .reverse()
        .find(({ message }) => message.role === "user" && message.content.trim())
        ?.idx;

      if (lastUserIndex === undefined) return;

      const baseSession: Session = {
        ...session,
        messages: session.messages.slice(0, lastUserIndex + 1),
      };

      updateSessionDirect(baseSession);
      await streamAssistantReply(baseSession);
    },
    [isStreaming, streamAssistantReply, updateSessionDirect]
  );

  const executeHandoff = useCallback(
    async (targetModel: Model, mode: HandoffMode) => {
      const { session: newSession } = buildHandoffSession(
        activeSession,
        targetModel,
        handoffContext
      );

      setHandoffOpen(false);
      setHandoffError(null);

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
            messages: newSession.messages.slice(0, -1),
          },
          [msg]
        );

        updateSessionDirect(updated);

        if (mode === "split-view") {
          setHandoffSession(updated);
        }
      } catch (err) {
        setHandoffError(
          err instanceof Error ? err.message : "Execution failed"
        );
      } finally {
        setHandoffLoading(false);
      }
    },
    [handoffContext, activeSession, updateSessionDirect]
  );

  return {
    sessions,
    activeSessionId,
    activeModel,
    sidebarCollapsed,
    promptLibraryOpen,
    focusMode,
    splitView,
    insertedPrompt,
    isStreaming,
    handoffOpen,
    handoffContext,
    handoffSession,
    handoffLoading,
    handoffError,

    setActiveSessionId,
    setActiveModel,
    toggleSidebar,
    togglePromptLibrary,
    toggleFocusMode,
    toggleSplitView,
    insertPrompt,
    requestHandoff,
    sendMessage,
    stopGenerating,
    retryMessage,
    executeHandoff,
    closeHandoff,
    clearHandoffSession,
    addSession,
  };
}