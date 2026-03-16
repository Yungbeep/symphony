"use client";

import { AlertCircle, Waves } from "lucide-react";
import type { Blueprint } from "@/lib/v2/types";
import { CATEGORY_ORDER, CATEGORY_META, getToolById } from "@/lib/v2/data/tools";
import { getProjectType } from "@/lib/v2/data/project-types";
import { ToolIcon } from "@/components/v2/ToolIcon";

const SECTION_ACCENTS: Record<string, string> = {
  brain: "#a78bfa",
  build: "#60a5fa",
  ship: "#34d399",
  observe: "#fbbf24",
  sell: "#f87171",
};

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
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-2xl font-semibold tracking-tight mb-2">
          Your orchestra is assembled
        </h2>
        <p className="text-sm text-muted">
          {blueprint.tools.length} tools seated across{" "}
          {new Set(blueprint.tools.map((t) => t.category)).size} sections.
          Ready to begin.
        </p>
      </div>

      {/* Project identity card */}
      <div className="rounded-xl border border-border bg-surface/60 backdrop-blur-sm p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-accent-subtle flex items-center justify-center">
            <Waves size={20} className="text-accent" />
          </div>
          <div>
            <div className="text-lg font-semibold">{blueprint.projectName}</div>
            {typeInfo && (
              <div className="text-[11px] text-muted-2">{typeInfo.name}</div>
            )}
          </div>
        </div>
      </div>

      {/* Assembled orchestra — visual stage recap */}
      <div className="rounded-xl border border-border bg-surface/40 backdrop-blur-sm overflow-hidden mb-6">
        <div className="px-5 py-3 border-b border-border/60 flex items-center gap-2.5">
          <div className="w-2 h-2 rounded-full bg-accent/60" />
          <span className="text-[11px] uppercase tracking-[0.12em] text-muted-2 font-medium">
            Seated Orchestra
          </span>
        </div>

        <div className="p-6">
          <div className="space-y-3">
            {CATEGORY_ORDER.map((cat) => {
              const catTools = blueprint.tools.filter((t) => t.category === cat);
              if (catTools.length === 0) return null;
              const meta = CATEGORY_META[cat];
              const accent = SECTION_ACCENTS[cat] ?? "#7c82f8";

              return (
                <div
                  key={cat}
                  className="flex items-start gap-4 p-4 rounded-xl bg-background border border-border"
                  style={{
                    borderColor: `color-mix(in srgb, ${accent} 20%, var(--border-color))`,
                  }}
                >
                  {/* Section indicator */}
                  <div className="flex flex-col items-center gap-1 pt-0.5 w-16 shrink-0">
                    <div
                      className="w-3 h-3 rounded-full"
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
                  <div className="flex flex-wrap gap-2 flex-1">
                    {catTools.map((pt) => {
                      const def = getToolById(pt.toolId);
                      if (!def) return null;
                      return (
                        <div
                          key={pt.toolId}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-surface border border-border"
                        >
                          <ToolIcon toolId={pt.toolId} size="sm" />
                          <div>
                            <div className="text-[11px] font-medium">
                              {def.name}
                            </div>
                            <div className="text-[9px] text-muted-2">
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
      </div>

      {/* First actions — from the blueprint */}
      <div className="rounded-xl border border-border bg-surface p-6 mb-6">
        <div className="text-[11px] font-medium text-muted-2 uppercase tracking-[0.08em] mb-4">
          First movements
        </div>
        <div className="space-y-2.5">
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
              <div className="flex-1">
                <div className="text-[13px] font-medium mb-0.5">
                  {action.title}
                </div>
                <div className="text-[12px] text-muted leading-relaxed">
                  {action.description}
                </div>
              </div>
              {action.toolId && (
                <ToolIcon toolId={action.toolId} size="sm" className="mt-0.5" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Missing sections */}
      {blueprint.missingRecommendations.length > 0 && (
        <div className="rounded-xl border border-dashed border-border bg-surface/40 p-5">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle size={13} className="text-muted-2" />
            <span className="text-[11px] font-medium text-muted-2 uppercase tracking-[0.08em]">
              Empty seats — recommended
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {blueprint.missingRecommendations.map((tool) => {
              const accent = SECTION_ACCENTS[tool.category] ?? "#7c82f8";
              return (
                <div
                  key={tool.id}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg border border-dashed border-border"
                >
                  <ToolIcon toolId={tool.id} size="sm" />
                  <div>
                    <span className="text-[11px] text-muted-2">{tool.name}</span>
                    <span
                      className="text-[8px] ml-1.5 uppercase font-bold tracking-wider"
                      style={{ color: accent }}
                    >
                      {tool.category}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}