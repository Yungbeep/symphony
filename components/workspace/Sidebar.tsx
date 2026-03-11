"use client";

import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
  FolderOpen,
  MessageSquare,
} from "lucide-react";
import { sampleProjects, sampleSessions } from "@/lib/data";

interface SidebarProps {
  activeSessionId: string;
  onSelectSession: (id: string) => void;
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({
  activeSessionId,
  onSelectSession,
  collapsed,
  onToggle,
}: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");

  if (collapsed) {
    return (
      <aside className="w-14 border-r border-border bg-surface flex flex-col items-center py-4 gap-3 shrink-0">
        <button
          onClick={onToggle}
          className="w-9 h-9 rounded-lg flex items-center justify-center text-muted hover:text-foreground hover:bg-surface-2 transition-colors cursor-pointer"
        >
          <ChevronRight size={18} />
        </button>
        <div className="w-8 h-px bg-border my-1" />
        {sampleProjects.map((project) => (
          <button
            key={project.id}
            className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-surface-2 transition-colors cursor-pointer"
            title={project.name}
          >
            <div
              className="w-3 h-3 rounded-full"
              style={{ background: project.color }}
            />
          </button>
        ))}
      </aside>
    );
  }

  const filteredSessions = sampleSessions.filter((s) =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <aside className="w-64 border-r border-border bg-surface flex flex-col shrink-0 animate-slide-in-left">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-border">
        <span className="text-sm font-semibold">Symphony</span>
        <div className="flex items-center gap-1">
          <button className="w-7 h-7 rounded-md flex items-center justify-center text-muted hover:text-foreground hover:bg-surface-2 transition-colors cursor-pointer">
            <Plus size={16} />
          </button>
          <button
            onClick={onToggle}
            className="w-7 h-7 rounded-md flex items-center justify-center text-muted hover:text-foreground hover:bg-surface-2 transition-colors cursor-pointer"
          >
            <ChevronLeft size={16} />
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="px-3 py-2.5">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-surface-2 text-muted">
          <Search size={14} />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent outline-none text-sm flex-1 text-foreground placeholder:text-muted"
          />
        </div>
      </div>

      {/* Projects */}
      <div className="flex-1 overflow-y-auto px-3 pb-4">
        <div className="text-[11px] text-muted uppercase tracking-wider px-2 py-2 mt-1">
          Projects
        </div>
        <div className="space-y-0.5">
          {sampleProjects.map((project) => (
            <div key={project.id} className="space-y-0.5">
              <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm text-muted/80 hover:text-foreground hover:bg-surface-2 transition-colors cursor-pointer">
                <FolderOpen size={14} style={{ color: project.color }} />
                <span className="truncate">{project.name}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="text-[11px] text-muted uppercase tracking-wider px-2 py-2 mt-5">
          Sessions
        </div>
        <div className="space-y-0.5">
          {filteredSessions.map((session) => (
            <button
              key={session.id}
              onClick={() => onSelectSession(session.id)}
              className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm text-left transition-colors cursor-pointer ${
                activeSessionId === session.id
                  ? "bg-accent/10 text-accent"
                  : "text-muted/80 hover:text-foreground hover:bg-surface-2"
              }`}
            >
              <MessageSquare size={14} className="shrink-0" />
              <span className="truncate">{session.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="px-3 py-3 border-t border-border">
        <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-muted hover:text-foreground hover:bg-surface-2 transition-colors cursor-pointer">
          <Plus size={14} />
          New session
        </button>
      </div>
    </aside>
  );
}
