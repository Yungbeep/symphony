"use client";

import { Brain, Plus, Clock, Tag } from "lucide-react";

interface MemoryPanelProps {
  projectName: string;
}

const sampleMemory = [
  {
    id: "mem-1",
    content: "Target audience: developer tools teams at mid-stage startups",
    source: "user" as const,
    tags: ["audience"],
    age: "2h ago",
  },
  {
    id: "mem-2",
    content: "Prefer Tailwind + shadcn for UI components",
    source: "user" as const,
    tags: ["stack", "preference"],
    age: "1h ago",
  },
  {
    id: "mem-3",
    content: "Auth should support both email/password and OAuth (GitHub, Google)",
    source: "user" as const,
    tags: ["auth", "requirements"],
    age: "45m ago",
  },
];

export function MemoryPanel({ projectName }: MemoryPanelProps) {
  return (
    <div className="h-full flex flex-col bg-surface border-l border-border">
      {/* Header */}
      <div className="px-4 py-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Brain size={14} className="text-muted" />
          <span className="text-[12px] font-medium text-muted">
            Project memory
          </span>
        </div>
        <button className="w-6 h-6 rounded flex items-center justify-center text-muted-2 hover:text-foreground hover:bg-surface-2 transition-colors cursor-pointer">
          <Plus size={14} />
        </button>
      </div>

      {/* Memory entries */}
      <div className="flex-1 overflow-y-auto py-3 px-3 space-y-2">
        {sampleMemory.map((entry) => (
          <div
            key={entry.id}
            className="p-3 rounded-lg border border-border bg-background"
          >
            <p className="text-[12px] leading-relaxed mb-2">{entry.content}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                {entry.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-0.5 text-[9px] px-1.5 py-0.5 rounded bg-surface-2 text-muted-2"
                  >
                    <Tag size={8} />
                    {tag}
                  </span>
                ))}
              </div>
              <span className="text-[9px] text-muted-2 flex items-center gap-1">
                <Clock size={8} />
                {entry.age}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Agent hint */}
      <div className="px-3 py-3 border-t border-border">
        <p className="text-[10px] text-muted-2 text-center leading-relaxed">
          Memory helps the orchestration assistant understand your project
          context over time.
        </p>
      </div>
    </div>
  );
}