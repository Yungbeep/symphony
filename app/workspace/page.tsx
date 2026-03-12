"use client";

import { useState, useCallback } from "react";
import { Sidebar } from "@/components/workspace/Sidebar";
import { TopBar } from "@/components/workspace/TopBar";
import { ChatPanel } from "@/components/workspace/ChatPanel";
import { PromptLibrary } from "@/components/workspace/PromptLibrary";
import { HandoffModal } from "@/components/workspace/HandoffModal";
import { sampleSessions, models, handoffResponses } from "@/lib/data";
import type { Model, Message, Session, HandoffMode } from "@/lib/types";

export default function WorkspacePage() {
  // Mutable sessions list — starts with sample data, grows with handoffs
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

  const activeSession = sessions.find((s) => s.id === activeSessionId) ?? sessions[0];

  // For split view, show handoff session if available, otherwise a different session
  const secondSession =
    handoffSession ??
    sessions.find((s) => s.id !== activeSessionId) ??
    sessions[1];

  const handleInsertPrompt = useCallback((content: string) => {
    setInsertedPrompt(content);
    setTimeout(() => setInsertedPrompt(undefined), 100);
  }, []);

  // Open the handoff modal with the selected context
  const handleRequestHandoff = useCallback((contextMessages: Message[]) => {
    setHandoffContext(contextMessages);
    setHandoffOpen(true);
  }, []);

  // Execute the handoff — generate a mock session with the target model's response
  const handleExecuteHandoff = useCallback(
    (targetModel: Model, mode: HandoffMode) => {
      // Build the context string from carried-over messages
      const contextStr = handoffContext
        .map((m) => m.content)
        .join("\n\n");

      // Get mock response for the target model
      const getResponse =
        handoffResponses[targetModel.id] ?? handoffResponses["gpt-4o"];
      const responseContent = getResponse(contextStr);

      // Build the handoff session with original context + new response
      const now = new Date();
      const newSession: Session = {
        id: `handoff-${Date.now()}`,
        title: `${activeSession.title} → ${targetModel.name}`,
        model: targetModel,
        createdAt: now,
        updatedAt: now,
        messages: [
          // Carry over the last user message as context
          ...handoffContext
            .filter((m) => m.role === "user")
            .slice(-1)
            .map((m) => ({
              ...m,
              id: `ho-ctx-${m.id}`,
              timestamp: new Date(now.getTime() - 5000),
            })),
          // Handoff indicator message
          {
            id: `ho-indicator-${Date.now()}`,
            role: "assistant" as const,
            content: `Context handed off from ${activeSession.model.name}. Continuing with ${targetModel.name}.`,
            timestamp: new Date(now.getTime() - 2000),
            model: "Symphony",
          },
          // New model's response
          {
            id: `ho-response-${Date.now()}`,
            role: "assistant" as const,
            content: responseContent,
            timestamp: now,
            model: targetModel.name,
          },
        ],
      };

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
        // New session mode — make it the active view
        setActiveSessionId(newSession.id);
        setHandoffSession(null);
        setSplitView(false);
      }
    },
    [handoffContext, activeSession]
  );

  return (
    <div className="h-screen flex overflow-hidden bg-background">
      {/* Sidebar */}
      {!focusMode && (
        <Sidebar
          activeSessionId={activeSessionId}
          onSelectSession={(id) => {
            setActiveSessionId(id);
            // Clear handoff session when switching sessions
            setHandoffSession(null);
          }}
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          sessions={sessions}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar
          sessionTitle={activeSession.title}
          activeModel={activeModel}
          onModelChange={setActiveModel}
          focusMode={focusMode}
          onToggleFocus={() => setFocusMode(!focusMode)}
          onTogglePromptLibrary={() => setPromptLibraryOpen(!promptLibraryOpen)}
          onToggleSplit={() => {
            setSplitView(!splitView);
            if (splitView) setHandoffSession(null);
          }}
          splitView={splitView}
        />

        <div className="flex-1 flex min-h-0">
          {/* Primary chat panel */}
          <div className={`flex-1 min-w-0 ${splitView ? "border-r border-border" : ""}`}>
            <ChatPanel
              session={activeSession}
              onInsertPrompt={insertedPrompt}
              onHandoff={handleRequestHandoff}
            />
          </div>

          {/* Split view - second panel */}
          {splitView && (
            <div className="flex-1 min-w-0">
              <ChatPanel session={secondSession} />
            </div>
          )}

          {/* Prompt library drawer */}
          {promptLibraryOpen && (
            <PromptLibrary
              onClose={() => setPromptLibraryOpen(false)}
              onInsert={handleInsertPrompt}
            />
          )}
        </div>
      </div>

      {/* Handoff modal */}
      {handoffOpen && (
        <HandoffModal
          sourceModel={activeSession.model}
          onClose={() => setHandoffOpen(false)}
          onHandoff={handleExecuteHandoff}
        />
      )}
    </div>
  );
}
