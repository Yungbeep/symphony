"use client";

import { useMemo } from "react";
import { Sidebar } from "@/components/workspace/Sidebar";
import { TopBar } from "@/components/workspace/TopBar";
import { ChatPanel } from "@/components/workspace/ChatPanel";
import { PromptLibrary } from "@/components/workspace/PromptLibrary";
import { HandoffModal } from "@/components/workspace/HandoffModal";
import { useWorkspaceState } from "@/lib/hooks/useWorkspaceState";

export default function WorkspacePage() {
  const ws = useWorkspaceState();

  const activeSession = useMemo(
    () => ws.sessions.find((s) => s.id === ws.activeSessionId) ?? ws.sessions[0],
    [ws.sessions, ws.activeSessionId]
  );

  const secondSession =
    ws.handoffSession ??
    ws.sessions.find((s) => s.id !== ws.activeSessionId) ??
    ws.sessions[1];

  return (
    <div className="h-screen flex overflow-hidden bg-background">
      {!ws.focusMode && (
        <Sidebar
          activeSessionId={ws.activeSessionId}
          onSelectSession={(id) => {
            ws.setActiveSessionId(id);
            ws.clearHandoffSession();
          }}
          collapsed={ws.sidebarCollapsed}
          onToggle={ws.toggleSidebar}
          sessions={ws.sessions}
        />
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <TopBar
          sessionTitle={activeSession.title}
          activeModel={ws.activeModel}
          onModelChange={ws.setActiveModel}
          focusMode={ws.focusMode}
          onToggleFocus={ws.toggleFocusMode}
          onTogglePromptLibrary={ws.togglePromptLibrary}
          onToggleSplit={ws.toggleSplitView}
          splitView={ws.splitView}
        />

        <div className="flex-1 flex min-h-0">
          <div className={`flex-1 min-w-0 ${ws.splitView ? "border-r border-border" : ""}`}>
            <ChatPanel
              session={activeSession}
              onInsertPrompt={ws.insertedPrompt}
              onHandoff={ws.requestHandoff}
            />
          </div>

          {ws.splitView && (
            <div className="flex-1 min-w-0">
              <ChatPanel session={secondSession} />
            </div>
          )}

          {ws.promptLibraryOpen && (
            <PromptLibrary
              onClose={ws.togglePromptLibrary}
              onInsert={ws.insertPrompt}
            />
          )}
        </div>
      </div>

      {ws.handoffOpen && (
        <HandoffModal
          sourceModel={activeSession.model}
          onClose={ws.closeHandoff}
          onHandoff={ws.executeHandoff}
        />
      )}
    </div>
  );
}