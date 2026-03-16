"use client";

import { Waves, Sparkles, ChevronRight } from "lucide-react";
import type { ProjectToolState } from "@/lib/v2/types";
import { CATEGORY_ORDER, CATEGORY_META, getToolById } from "@/lib/v2/data/tools";
import { ToolIcon } from "@/components/v2/ToolIcon";

const SECTION_ACCENTS: Record<string, string> = {
  brain: "#a78bfa",
  build: "#60a5fa",
  ship: "#34d399",
  observe: "#fbbf24",
  sell: "#f87171",
};

interface OrchestraPanelProps {
  tools: ProjectToolState[];
  projectName: string;
  projectType: string;
}

export function OrchestraPanel({
  tools,
  projectName,
  projectType,
}: OrchestraPanelProps) {
  return (
    <div className="h-full flex flex-col bg-surface border-r border-border">
      {/* Project header */}
      <div className="px-4 py-4 border-b border-border">
        <div className="flex items-center gap-2.5 mb-1">
          <div className="w-6 h-6 rounded-md bg-accent-subtle flex items-center justify-center">
            <Waves size={13} className="text-accent" />
          </div>
          <span className="text-[13px] font-semibold truncate">
            {projectName}
          </span>
        </div>
        <div className="flex items-center gap-2 mt-1.5 pl-[34px]">
          <span className="text-[10px] text-muted-2 capitalize">
            {projectType.replace(/-/g, " ")}
          </span>
          <span className="text-[10px] text-muted-2">&middot;</span>
          <span className="text-[10px] text-accent font-medium">
            {tools.length} seated
          </span>
        </div>
      </div>

      {/* Orchestra sections */}
      <div className="flex-1 overflow-y-auto py-2 px-2">
        {CATEGORY_ORDER.map((cat) => {
          const meta = CATEGORY_META[cat];
          const accent = SECTION_ACCENTS[cat] ?? "#7c82f8";
          const catTools = tools.filter((t) => t.category === cat);
          if (catTools.length === 0) return null;

          return (
            <div key={cat} className="mb-3">
              {/* Section header */}
              <div className="flex items-center gap-2 px-2.5 py-1.5">
                <div
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: accent }}
                />
                <span
                  className="text-[9px] font-bold uppercase tracking-[0.1em]"
                  style={{ color: accent }}
                >
                  {meta.label}
                </span>
              </div>

              {/* Seated tools */}
              <div className="space-y-0.5">
                {catTools.map((pt) => {
                  const def = getToolById(pt.toolId);
                  if (!def) return null;
                  return (
                    <button
                      key={pt.toolId}
                      className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left hover:bg-surface-2 transition-colors cursor-pointer group"
                    >
                      <ToolIcon toolId={pt.toolId} size="sm" />
                      <div className="flex-1 min-w-0">
                        <div className="text-[11px] font-medium truncate">
                          {def.name}
                        </div>
                        <div className="text-[9px] text-muted-2 truncate">
                          {pt.role}
                        </div>
                      </div>
                      <ChevronRight
                        size={10}
                        className="text-muted-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Symphony Agent — agentic scaffolding */}
      <div className="px-2 py-2 border-t border-border">
        <div className="rounded-lg border border-accent/15 bg-accent-subtle p-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-md bg-accent/10 flex items-center justify-center">
              <Sparkles size={12} className="text-accent" />
            </div>
            <div>
              <div className="text-[11px] font-semibold text-accent">
                Symphony Agent
              </div>
            </div>
          </div>
          <p className="text-[10px] text-muted leading-relaxed">
            Orchestration assistant that understands your stack, recommends
            next actions, and coordinates handoffs between tools.
          </p>
          <div className="mt-2 flex items-center gap-1">
            <span className="text-[9px] text-muted-2 px-1.5 py-0.5 rounded bg-surface border border-border">
              Observing
            </span>
            <span className="text-[9px] text-muted-2 px-1.5 py-0.5 rounded bg-surface border border-border">
              Learning context
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}