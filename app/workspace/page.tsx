"use client";

import { useState, useCallback } from "react";
import { Sidebar } from "@/components/workspace/Sidebar";
import { TopBar } from "@/components/workspace/TopBar";
import { ChatPanel } from "@/components/workspace/ChatPanel";
import { PromptLibrary } from "@/components/workspace/PromptLibrary";
import { sampleSessions, models } from "@/lib/data";
import type { Model } from "@/lib/types";

export default function WorkspacePage() {
  const [activeSessionId, setActiveSessionId] = useState(sampleSessions[0].id);
  const [activeModel, setActiveModel] = useState<Model>(models[2]); // Claude Sonnet 4
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [promptLibraryOpen, setPromptLibraryOpen] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [splitView, setSplitView] = useState(false);
  const [insertedPrompt, setInsertedPrompt] = useState<string | undefined>();

  const activeSession = sampleSessions.find((s) => s.id === activeSessionId) ?? sampleSessions[0];

  // For split view, show a second session
  const secondSession = sampleSessions.find((s) => s.id !== activeSessionId) ?? sampleSessions[1];

  const handleInsertPrompt = useCallback((content: string) => {
    setInsertedPrompt(content);
    // Reset after a tick so re-inserting the same prompt works
    setTimeout(() => setInsertedPrompt(undefined), 100);
  }, []);

  return (
    <div className="h-screen flex overflow-hidden bg-background">
      {/* Sidebar */}
      {!focusMode && (
        <Sidebar
          activeSessionId={activeSessionId}
          onSelectSession={setActiveSessionId}
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
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
          onToggleSplit={() => setSplitView(!splitView)}
          splitView={splitView}
        />

        <div className="flex-1 flex min-h-0">
          {/* Primary chat panel */}
          <div className={`flex-1 min-w-0 ${splitView ? "border-r border-border" : ""}`}>
            <ChatPanel session={activeSession} onInsertPrompt={insertedPrompt} />
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
    </div>
  );
}
