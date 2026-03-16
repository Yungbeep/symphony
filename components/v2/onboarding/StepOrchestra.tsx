"use client";

import { useState } from "react";
import { Plus, X, Check } from "lucide-react";
import type { ProjectToolState, ProjectTypeName, ToolDefinition } from "@/lib/v2/types";
import { tools, CATEGORY_META, getToolsByCategory } from "@/lib/v2/data/tools";
import { getProjectType } from "@/lib/v2/data/project-types";
import { ToolIcon } from "@/components/v2/ToolIcon";

const SECTION_ACCENTS: Record<string, string> = {
  brain: "#a78bfa",
  build: "#60a5fa",
  ship: "#34d399",
  observe: "#fbbf24",
  sell: "#f87171",
};

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
    <div className="max-w-[1100px] mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold tracking-tight mb-2">
          Seat your orchestra
        </h2>
        <p className="text-sm text-muted">
          Each section needs tools. Each tool gets a seat and a role.
        </p>
      </div>

      <div className="grid grid-cols-[220px_1fr_260px] gap-5 min-h-[520px]">
        {/* Left: Available tools */}
        <div className="rounded-xl border border-border bg-surface overflow-hidden">
          <div className="px-4 py-3 border-b border-border">
            <span className="text-[11px] font-medium text-muted uppercase tracking-[0.08em]">
              Available
            </span>
          </div>
          <div className="p-2 space-y-0.5 overflow-y-auto max-h-[470px]">
            {tools.map((tool) => {
              const isSelected = selectedIds.has(tool.id);
              const isRecommended = recommendedIds.has(tool.id);
              const accent = SECTION_ACCENTS[tool.category] ?? "#7c82f8";

              return (
                <button
                  key={tool.id}
                  onClick={() => {
                    setSelectedDetail(tool);
                    if (!isSelected) onToggleTool(tool.id);
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left text-[13px] transition-all cursor-pointer ${
                    selectedDetail?.id === tool.id
                      ? "bg-surface-2"
                      : "hover:bg-surface-2"
                  } ${isSelected ? "opacity-50" : ""}`}
                >
                  <ToolIcon toolId={tool.id} size="sm" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-medium truncate">{tool.name}</span>
                      {isRecommended && !isSelected && (
                        <span
                          className="text-[8px] px-1 py-0.5 rounded font-semibold"
                          style={{
                            background: `color-mix(in srgb, ${accent} 12%, transparent)`,
                            color: accent,
                          }}
                        >
                          REC
                        </span>
                      )}
                    </div>
                  </div>
                  {isSelected && (
                    <Check size={13} className="text-accent shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Center: The Stage */}
        <div className="rounded-xl border border-border bg-surface/40 backdrop-blur-sm overflow-hidden relative">
          {/* Ambient spotlight */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />

          <div className="px-5 py-3 border-b border-border/60 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-2 h-2 rounded-full bg-accent/60" />
              <span className="text-[11px] uppercase tracking-[0.12em] text-muted-2 font-medium">
                The Stage
              </span>
            </div>
            <span className="text-[10px] text-muted-2 tabular-nums">
              {selectedTools.length} seated
            </span>
          </div>

          <div className="p-5 overflow-y-auto max-h-[470px]">
            {/* Arc layout: back to front */}
            {/* Row 1: Brain (back/center) */}
            <div className="flex justify-center mb-4">
              <SectionSeats
                section="brain"
                selectedTools={selectedTools}
                recommendedIds={recommendedIds}
                onToggle={onToggleTool}
                onSelect={setSelectedDetail}
              />
            </div>

            {/* Row 2: Build + Ship */}
            <div className="flex justify-center gap-4 mb-4">
              <SectionSeats
                section="build"
                selectedTools={selectedTools}
                recommendedIds={recommendedIds}
                onToggle={onToggleTool}
                onSelect={setSelectedDetail}
              />
              <SectionSeats
                section="ship"
                selectedTools={selectedTools}
                recommendedIds={recommendedIds}
                onToggle={onToggleTool}
                onSelect={setSelectedDetail}
              />
            </div>

            {/* Row 3: Observe + Sell */}
            <div className="flex justify-center gap-4">
              <SectionSeats
                section="observe"
                selectedTools={selectedTools}
                recommendedIds={recommendedIds}
                onToggle={onToggleTool}
                onSelect={setSelectedDetail}
              />
              <SectionSeats
                section="sell"
                selectedTools={selectedTools}
                recommendedIds={recommendedIds}
                onToggle={onToggleTool}
                onSelect={setSelectedDetail}
              />
            </div>

            {/* Conductor position */}
            <div className="flex flex-col items-center mt-6">
              <div className="w-px h-5 bg-gradient-to-b from-border to-transparent" />
              <div className="w-7 h-7 rounded-full border border-border bg-surface flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-accent/50" />
              </div>
              <span className="text-[8px] text-muted-2 mt-1 tracking-[0.1em] uppercase">
                Conductor
              </span>
            </div>
          </div>
        </div>

        {/* Right: Tool details */}
        <div className="rounded-xl border border-border bg-surface overflow-hidden">
          <div className="px-4 py-3 border-b border-border">
            <span className="text-[11px] font-medium text-muted uppercase tracking-[0.08em]">
              Seat details
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
                  <div
                    className="text-[10px] font-semibold uppercase tracking-wider mt-0.5"
                    style={{ color: SECTION_ACCENTS[selectedDetail.category] }}
                  >
                    {selectedDetail.category} section
                  </div>
                </div>
              </div>

              <p className="text-[13px] text-muted leading-relaxed mb-5">
                {selectedDetail.description}
              </p>

              <div className="mb-5 p-3 rounded-lg bg-background border border-border">
                <div className="text-[9px] font-semibold text-muted-2 uppercase tracking-[0.08em] mb-1">
                  Role when seated
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
                    Remove from stage
                  </>
                ) : (
                  <>
                    <Plus size={14} />
                    Seat in orchestra
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="p-4 flex items-center justify-center h-52">
              <p className="text-[12px] text-muted-2 text-center leading-relaxed">
                Select a tool to see
                <br />
                its seat and role
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/** A section of the stage with its seated tools and empty seat slots */
function SectionSeats({
  section,
  selectedTools,
  recommendedIds,
  onToggle,
  onSelect,
}: {
  section: string;
  selectedTools: ProjectToolState[];
  recommendedIds: Set<string>;
  onToggle: (id: string) => void;
  onSelect: (tool: ToolDefinition) => void;
}) {
  const meta = CATEGORY_META[section as keyof typeof CATEGORY_META];
  const accent = SECTION_ACCENTS[section] ?? "#7c82f8";
  const seated = selectedTools.filter((t) => t.category === section);
  const available = getToolsByCategory(section as any).filter(
    (t) => !selectedTools.some((s) => s.toolId === t.id)
  );

  return (
    <div
      className="rounded-xl border bg-background/60 p-4 min-w-[200px] max-w-[280px] flex-1"
      style={{
        borderColor: seated.length > 0
          ? `color-mix(in srgb, ${accent} 25%, var(--border-color))`
          : undefined,
        boxShadow: seated.length > 0
          ? `inset 0 1px 0 0 color-mix(in srgb, ${accent} 8%, transparent)`
          : undefined,
      }}
    >
      {/* Section label */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div
            className="w-2 h-2 rounded-full"
            style={{ background: seated.length > 0 ? accent : `color-mix(in srgb, ${accent} 30%, transparent)` }}
          />
          <span
            className="text-[10px] font-bold uppercase tracking-[0.1em]"
            style={{ color: accent }}
          >
            {meta?.label}
          </span>
        </div>
        <span className="text-[9px] text-muted-2 tabular-nums">
          {seated.length}/{seated.length + available.length}
        </span>
      </div>

      {/* Seated tools */}
      {seated.length > 0 && (
        <div className="space-y-1.5 mb-2">
          {seated.map((pt) => {
            const def = tools.find((t) => t.id === pt.toolId);
            if (!def) return null;
            return (
              <div
                key={pt.toolId}
                className="flex items-center gap-2 px-2.5 py-2 rounded-lg bg-surface border border-border group cursor-pointer hover:border-accent/20 transition-colors"
                onClick={() => onSelect(def)}
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
                <button
                  onClick={(e) => { e.stopPropagation(); onToggle(pt.toolId); }}
                  className="opacity-0 group-hover:opacity-100 w-4 h-4 rounded flex items-center justify-center text-muted-2 hover:text-foreground transition-all cursor-pointer"
                >
                  <X size={10} />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Empty seat slots for remaining tools */}
      {available.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {available.map((t) => {
            const isRec = recommendedIds.has(t.id);
            return (
              <button
                key={t.id}
                onClick={() => { onToggle(t.id); onSelect(t); }}
                className="inline-flex items-center gap-1 px-2 py-1 rounded border border-dashed text-[9px] font-medium transition-all cursor-pointer hover:border-accent/30"
                style={{
                  borderColor: isRec
                    ? `color-mix(in srgb, ${accent} 30%, transparent)`
                    : undefined,
                  color: isRec ? accent : undefined,
                }}
                title={isRec ? "Recommended for this project type" : undefined}
              >
                <Plus size={8} />
                {t.name}
              </button>
            );
          })}
        </div>
      )}

      {seated.length === 0 && available.length === 0 && (
        <div className="text-[10px] text-muted-2 text-center py-2">
          No tools available
        </div>
      )}
    </div>
  );
}