"use client";

import { Waves } from "lucide-react";
import type { ProjectToolState, ToolCategory } from "@/lib/v2/types";
import { CATEGORY_ORDER, CATEGORY_META, getToolById } from "@/lib/v2/data/tools";
import { ToolIcon } from "@/components/v2/ToolIcon";

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
        <div className="flex items-center gap-2 mb-1">
          <Waves size={14} className="text-accent" />
          <span className="text-[13px] font-semibold truncate">
            {projectName}
          </span>
        </div>
        <span className="text-[10px] text-muted-2 capitalize">
          {projectType.replace("-", " ")}
        </span>
      </div>

      {/* Tool list by category */}
      <div className="flex-1 overflow-y-auto py-3 px-3 space-y-4">
        {CATEGORY_ORDER.map((cat) => {
          const meta = CATEGORY_META[cat];
          const catTools = tools.filter((t) => t.category === cat);
          if (catTools.length === 0) return null;

          return (
            <div key={cat}>
              <div className="text-[9px] font-semibold text-muted-2 uppercase tracking-[0.1em] px-1 mb-2">
                {meta.label}
              </div>
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
                        <div className="text-[12px] font-medium truncate">
                          {def.name}
                        </div>
                        <div className="text-[10px] text-muted-2 truncate">
                          {pt.role}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Agent placeholder */}
      <div className="px-3 py-3 border-t border-border">
        <div className="flex items-center gap-2 px-2.5 py-2 rounded-lg border border-dashed border-border text-muted-2">
          <div className="w-6 h-6 rounded-md bg-surface-2 flex items-center justify-center">
            <Waves size={12} />
          </div>
          <div className="text-[11px]">
            <div className="font-medium">Symphony Agent</div>
            <div className="text-[10px] text-muted-2">Coming soon</div>
          </div>
        </div>
      </div>
    </div>
  );
}