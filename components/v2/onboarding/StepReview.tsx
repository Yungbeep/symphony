"use client";

import { CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";
import type { Blueprint, ToolCategory } from "@/lib/v2/types";
import { CATEGORY_ORDER, CATEGORY_META, getToolById } from "@/lib/v2/data/tools";
import { getProjectType } from "@/lib/v2/data/project-types";
import { ToolIcon } from "@/components/v2/ToolIcon";

interface StepReviewProps {
  blueprint: Blueprint | null;
}

export function StepReview({ blueprint }: StepReviewProps) {
  if (!blueprint) {
    return (
      <div className="max-w-md mx-auto text-center py-20">
        <p className="text-muted">
          Complete the previous steps to generate your blueprint.
        </p>
      </div>
    );
  }

  const typeInfo = getProjectType(blueprint.projectType);

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold tracking-tight mb-2">
        Your blueprint
      </h2>
      <p className="text-sm text-muted mb-10">
        Review the orchestration plan before entering your workspace.
      </p>

      {/* Project header */}
      <div className="rounded-xl border border-border bg-surface p-6 mb-5">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-[11px] font-medium text-muted-2 uppercase tracking-[0.08em] mb-1">
              Project
            </div>
            <div className="text-xl font-semibold">{blueprint.projectName}</div>
          </div>
          {typeInfo && (
            <span className="text-[11px] px-2.5 py-1 rounded-md bg-surface-2 text-muted font-medium">
              {typeInfo.name}
            </span>
          )}
        </div>
      </div>

      {/* Orchestra summary */}
      <div className="rounded-xl border border-border bg-surface p-6 mb-5">
        <div className="text-[11px] font-medium text-muted-2 uppercase tracking-[0.08em] mb-4">
          Orchestra — {blueprint.tools.length} tools seated
        </div>
        <div className="space-y-3">
          {CATEGORY_ORDER.map((cat) => {
            const catTools = blueprint.tools.filter((t) => t.category === cat);
            if (catTools.length === 0) return null;
            const meta = CATEGORY_META[cat];

            return (
              <div key={cat}>
                <div className="text-[10px] font-semibold text-muted-2 uppercase tracking-wider mb-1.5">
                  {meta.label}
                </div>
                <div className="flex flex-wrap gap-2">
                  {catTools.map((pt) => {
                    const def = getToolById(pt.toolId);
                    if (!def) return null;
                    return (
                      <div
                        key={pt.toolId}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-background border border-border"
                      >
                        <ToolIcon toolId={pt.toolId} size="sm" />
                        <div>
                          <div className="text-[12px] font-medium">
                            {def.name}
                          </div>
                          <div className="text-[10px] text-muted-2">
                            {pt.role}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* First actions */}
      <div className="rounded-xl border border-border bg-surface p-6 mb-5">
        <div className="text-[11px] font-medium text-muted-2 uppercase tracking-[0.08em] mb-4">
          First actions
        </div>
        <div className="space-y-3">
          {blueprint.firstActions.map((action, i) => (
            <div
              key={i}
              className="flex items-start gap-3 p-3 rounded-lg bg-background border border-border"
            >
              <div className="w-6 h-6 rounded-full bg-accent-subtle flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-[10px] font-semibold text-accent">
                  {i + 1}
                </span>
              </div>
              <div>
                <div className="text-[13px] font-medium mb-0.5">
                  {action.title}
                </div>
                <div className="text-[12px] text-muted leading-relaxed">
                  {action.description}
                </div>
                {action.toolId && (
                  <div className="flex items-center gap-1.5 mt-2">
                    <ToolIcon toolId={action.toolId} size="sm" />
                    <span className="text-[10px] text-muted-2">
                      {getToolById(action.toolId)?.name}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Missing recommendations */}
      {blueprint.missingRecommendations.length > 0 && (
        <div className="rounded-xl border border-border bg-surface p-6 mb-5">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle size={14} className="text-muted" />
            <span className="text-[11px] font-medium text-muted-2 uppercase tracking-[0.08em]">
              Recommended but not added
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {blueprint.missingRecommendations.map((tool) => (
              <div
                key={tool.id}
                className="flex items-center gap-2 px-3 py-2 rounded-lg border border-dashed border-border text-muted-2"
              >
                <ToolIcon toolId={tool.id} size="sm" />
                <span className="text-[12px]">{tool.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}