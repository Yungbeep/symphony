"use client";

import {
  Layers,
  Brain,
  Wrench,
  Layout,
  Store,
} from "lucide-react";
import type { ProjectTypeName } from "@/lib/v2/types";
import { projectTypes } from "@/lib/v2/data/project-types";

const ICONS: Record<string, React.ComponentType<{ size?: number }>> = {
  layers: Layers,
  brain: Brain,
  wrench: Wrench,
  layout: Layout,
  store: Store,
};

interface StepTypeProps {
  selected: ProjectTypeName | null;
  onSelect: (type: ProjectTypeName) => void;
}

export function StepType({ selected, onSelect }: StepTypeProps) {
  return (
    <div className="max-w-xl mx-auto">
      <h2 className="text-2xl font-semibold tracking-tight mb-2">
        What are you building?
      </h2>
      <p className="text-sm text-muted mb-10">
        This shapes the recommended tools and first actions in your blueprint.
      </p>

      <div className="grid grid-cols-1 gap-3">
        {projectTypes.map((pt) => {
          const Icon = ICONS[pt.icon] ?? Layers;
          const isSelected = selected === pt.id;

          return (
            <button
              key={pt.id}
              onClick={() => onSelect(pt.id)}
              className={`flex items-start gap-4 p-5 rounded-xl border text-left transition-all cursor-pointer ${
                isSelected
                  ? "border-accent/40 bg-accent-subtle"
                  : "border-border bg-surface hover:border-accent/20"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                  isSelected
                    ? "bg-accent text-white"
                    : "bg-surface-2 text-muted"
                }`}
              >
                <Icon size={20} />
              </div>
              <div className="min-w-0">
                <div className="text-[14px] font-medium mb-1">{pt.name}</div>
                <div className="text-[13px] text-muted leading-relaxed">
                  {pt.description}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}