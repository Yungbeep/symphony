"use client";

import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
  FolderOpen,
  MessageSquare,
  Clock,
} from "lucide-react";
import { sampleProjects, sampleSessions } from "@/lib/data";

interface SidebarProps {
  activeSessionId: string;
  onSelectSession: (id: string) => void;
  collapsed: boolean;
  onToggle: () => void;
}

function timeAgo(date: Date): string {
  const mins = Math.floor((Date.now() - date.getTime()) / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
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
      <aside className="w-12 border-r border-border bg-surface flex flex-col items-center py-3 gap-2 shrink-0">
        <button
          onClick={onToggle}
          className="w-8 h-8 rounded-md flex items-center justify-center text-muted-2 hover:text-foreground hover:bg-surface-2 transition-colors cursor-pointer"
        >
          <ChevronRight size={16} />
        </button>
        <div className="w-6 h-px bg-border my-0.5" />
        {sampleProjects.map((project) => (
          <button
            key={project.id}
            className="w-8 h-8 rounded-md flex items-center justify-center hover:bg-surface-2 transition-colors cursor-pointer"
            title={project.name}
          >
            <div
              className="w-2.5 h-2.5 rounded-full"
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
    <aside className="w-60 border-r border-border bg-surface flex flex-col shrink-0 animate-slide-in-left">
      {/* Header */}
      <div className="flex items-center justify-between px-3.5 py-3 border-b border-border">
        <span className="text-[13px] font-semibold tracking-[-0.01em]">Symphony</span>
        <div className="flex items-center gap-0.5">
          <button className="w-7 h-7 rounded-md flex items-center justify-center text-muted-2 hover:text-foreground hover:bg-surface-2 transition-colors cursor-pointer">
            <Plus size={15} />
          </button>
          <button
            onClick={onToggle}
            className="w-7 h-7 rounded-md flex items-center justify-center text-muted-2 hover:text-foreground hover:bg-surface-2 transition-colors cursor-pointer"
          >
            <ChevronLeft size={15} />
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="px-3 py-2">
        <div className="flex items-center gap-2 px-2.5 py-[7px] rounded-md bg-surface-2 text-muted-2">
          <Search size={13} />
          <input
            type="text"
            placeholder="Search sessions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent outline-none text-[13px] flex-1 text-foreground placeholder:text-muted-2"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-2.5 pb-3">
        {/* Projects */}
        <div className="text-[10px] text-muted-2 uppercase tracking-[0.1em] px-2 pt-2 pb-1.5">
          Projects
        </div>
        <div className="space-y-px">
          {sampleProjects.map((project) => (
            <div
              key={project.id}
              className="flex items-center gap-2 px-2.5 py-[7px] rounded-md text-[13px] text-muted hover:text-foreground hover:bg-surface-2 transition-colors cursor-pointer group"
            >
              <FolderOpen size={14} style={{ color: project.color }} className="shrink-0" />
              <span className="truncate flex-1">{project.name}</span>
              <span className="text-[10px] text-muted-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {project.sessions.length}
              </span>
            </div>
          ))}
        </div>

        {/* Sessions */}
        <div className="text-[10px] text-muted-2 uppercase tracking-[0.1em] px-2 pt-5 pb-1.5">
          Sessions
        </div>
        <div className="space-y-px">
          {filteredSessions.map((session) => (
            <button
              key={session.id}
              onClick={() => onSelectSession(session.id)}
              className={`w-full text-left px-2.5 py-2 rounded-md transition-colors cursor-pointer group ${
                activeSessionId === session.id
                  ? "bg-accent-subtle"
                  : "hover:bg-surface-2"
              }`}
            >
              <div className="flex items-center gap-2 mb-0.5">
                <MessageSquare
                  size={13}
                  className={`shrink-0 ${
                    activeSessionId === session.id ? "text-accent" : "text-muted-2"
                  }`}
                />
                <span
                  className={`text-[13px] truncate ${
                    activeSessionId === session.id
                      ? "text-accent font-medium"
                      : "text-foreground/80"
                  }`}
                >
                  {session.title}
                </span>
              </div>
              <div className="flex items-center gap-1.5 pl-[21px]">
                <Clock size={10} className="text-muted-2" />
                <span className="text-[10px] text-muted-2">
                  {timeAgo(session.updatedAt)}
                </span>
                <span className="text-[10px] text-muted-2">·</span>
                <span className="text-[10px] text-muted-2">
                  {session.messages.length} messages
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="px-2.5 py-2.5 border-t border-border">
        <button className="w-full flex items-center gap-2 px-2.5 py-[7px] rounded-md text-[13px] text-muted hover:text-foreground hover:bg-surface-2 transition-colors cursor-pointer">
          <Plus size={14} />
          New session
        </button>
      </div>
    </aside>
  );
}
