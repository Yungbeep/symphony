"use client";

import { useState } from "react";
import { Plus, X, Check, ChevronRight } from "lucide-react";
import type { ProjectToolState, ProjectTypeName, ToolDefinition, ToolCategory } from "@/lib/v2/types";
import { tools, CATEGORY_ORDER, CATEGORY_META, getToolsByCategory } from "@/lib/v2/data/tools";
import { getProjectType } from "@/lib/v2/data/project-types";
import { ToolIcon } from "@/components/v2/ToolIcon";

interface StepOrchestraProps {
  selectedTools: ProjectToolState[];
  projectType: ProjectTypeName | null;
  onToggleTool: (toolId: string) => void;
}

export function StepOrchestra({
  selectedTools,
  projectType,
  onToggleTool,
}: StepOrchestraProps) {
  const [selectedDetail, setSelectedDetail] = useState<ToolDefinition | null>(null);

  const selectedIds = new Set(selectedTools.map((t) => t.toolId));
  const typeInfo = projectType ? getProjectType(projectType) : null;
  const recommendedIds = new Set(typeInfo?.recommendedTools ?? []);

  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-2xl font-semibold tracking-tight mb-2">
          Build your orchestra
        </h2>
        <p className="text-sm text-muted">
          Choose the tools that will power this project. Each seat is a role in
          your build system.
        </p>
      </div>

      <div className="grid grid-cols-[240px_1fr_260px] gap-5 min-h-[480px]">
        {/* Left: Available tools */}
        <div className="rounded-xl border border-border bg-surface overflow-hidden">
          <div className="px-4 py-3 border-b border-border">
            <span className="text-[11px] font-medium text-muted uppercase tracking-[0.08em]">
              Available tools
            </span>
          </div>
          <div className="p-2 space-y-0.5 overflow-y-auto max-h-[440px]">
            {tools.map((tool) => {
              const isSelected = selectedIds.has(tool.id);
              const isRecommended = recommendedIds.has(tool.id);

              return (
                <button
                  key={tool.id}
                  onClick={() => setSelectedDetail(tool)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left text-[13px] transition-colors cursor-pointer ${
                    selectedDetail?.id === tool.id
                      ? "bg-surface-2"
                      : "hover:bg-surface-2"
                  }`}
                >
                  <ToolIcon toolId={tool.id} size="sm" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-medium truncate">{tool.name}</span>
                      {isRecommended && !isSelected && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-accent-subtle text-accent font-medium">
                          rec
                        </span>
                      )}
                    </div>
                  </div>
                  {isSelected && (
                    <Check size={14} className="text-accent shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Center: Orchestra stage */}
        <div className="rounded-xl border border-border bg-surface overflow-hidden">
          <div className="px-4 py-3 border-b border-border flex items-center justify-between">
            <span className="text-[11px] font-medium text-muted uppercase tracking-[0.08em]">
              Orchestra — {selectedTools.length} seated
            </span>
          </div>
          <div className="p-4 space-y-4 overflow-y-auto max-h-[440px]">
            {CATEGORY_ORDER.map((cat) => {
              const meta = CATEGORY_META[cat];
              const catTools = selectedTools.filter((t) => t.category === cat);
              const availableForCat = getToolsByCategory(cat).filter(
                (t) => !selectedIds.has(t.id)
              );

              return (
                <div key={cat} className="rounded-lg border border-border bg-background p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="text-[12px] font-semibold tracking-wide uppercase">
                        {meta.label}
                      </div>
                      <div className="text-[11px] text-muted-2 mt-0.5">
                        {meta.description}
                      </div>
                    </div>
                    <span className="text-[10px] text-muted-2 tabular-nums">
                      {catTools.length} tool{catTools.length !== 1 ? "s" : ""}
                    </span>
                  </div>

                  {catTools.length > 0 ? (
                    <div className="space-y-1.5">
                      {catTools.map((pt) => {
                        const def = tools.find((t) => t.id === pt.toolId);
                        if (!def) return null;
                        return (
                          <div
                            key={pt.toolId}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-md bg-surface group"
                          >
                            <ToolIcon toolId={pt.toolId} size="sm" />
                            <div className="flex-1 min-w-0">
                              <div className="text-[12px] font-medium">
                                {def.name}
                              </div>
                              <div className="text-[10px] text-muted-2 truncate">
                                {pt.role}
                              </div>
                            </div>
                            <button
                              onClick={() => onToggleTool(pt.toolId)}
                              className="opacity-0 group-hover:opacity-100 w-5 h-5 rounded flex items-center justify-center text-muted-2 hover:text-foreground hover:bg-surface-2 transition-all cursor-pointer"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center py-4 border border-dashed border-border rounded-md">
                      <span className="text-[11px] text-muted-2">
                        No tools in {meta.label.toLowerCase()} yet
                      </span>
                    </div>
                  )}

                  {availableForCat.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {availableForCat.map((t) => (
                        <button
                          key={t.id}
                          onClick={() => onToggleTool(t.id)}
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] border transition-colors cursor-pointer ${
                            recommendedIds.has(t.id)
                              ? "border-accent/20 text-accent bg-accent-subtle hover:bg-accent/10"
                              : "border-border text-muted-2 hover:text-muted hover:border-accent/20"
                          }`}
                        >
                          <Plus size={10} />
                          {t.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Tool details */}
        <div className="rounded-xl border border-border bg-surface overflow-hidden">
          <div className="px-4 py-3 border-b border-border">
            <span className="text-[11px] font-medium text-muted uppercase tracking-[0.08em]">
              Tool details
            </span>
          </div>
          {selectedDetail ? (
            <div className="p-4">
              <div className="flex items-center gap-3 mb-4">
                <ToolIcon toolId={selectedDetail.id} size="lg" />
                <div>
                  <div className="text-[14px] font-medium">
                    {selectedDetail.name}
                  </div>
                  <div className="text-[11px] text-muted-2 capitalize">
                    {selectedDetail.category}
                  </div>
                </div>
              </div>

              <p className="text-[13px] text-muted leading-relaxed mb-5">
                {selectedDetail.description}
              </p>

              <div className="mb-5">
                <div className="text-[10px] font-medium text-muted-2 uppercase tracking-[0.08em] mb-1.5">
                  Role in project
                </div>
                <div className="text-[13px] leading-relaxed">
                  {selectedDetail.role}
                </div>
              </div>

              <button
                onClick={() => onToggleTool(selectedDetail.id)}
                className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-[13px] font-medium transition-colors cursor-pointer ${
                  selectedIds.has(selectedDetail.id)
                    ? "border border-border bg-surface-2 text-muted hover:text-foreground"
                    : "bg-accent text-white hover:bg-accent-hover"
                }`}
              >
                {selectedIds.has(selectedDetail.id) ? (
                  <>
                    <X size={14} />
                    Remove from orchestra
                  </>
                ) : (
                  <>
                    <Plus size={14} />
                    Add to orchestra
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="p-4 flex items-center justify-center h-48">
              <p className="text-[12px] text-muted-2 text-center">
                Select a tool to see its details
                <br />
                and role in your project
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}