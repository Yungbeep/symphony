"use client";

import type { OnboardingStep } from "@/lib/v2/types";

const STEPS: { key: OnboardingStep; label: string }[] = [
  { key: "basics", label: "Project" },
  { key: "type", label: "Type" },
  { key: "orchestra", label: "Orchestra" },
  { key: "review", label: "Review" },
];

interface StepIndicatorProps {
  current: OnboardingStep;
  onGoToStep?: (step: OnboardingStep) => void;
  completedSteps?: number; // index up to which steps are done
}

export function StepIndicator({ current, onGoToStep, completedSteps = 0 }: StepIndicatorProps) {
  const currentIndex = STEPS.findIndex((s) => s.key === current);

  return (
    <div className="flex items-center gap-2">
      {STEPS.map((step, i) => {
        const isActive = step.key === current;
        const isDone = i < currentIndex;
        const isClickable = isDone && onGoToStep;

        return (
          <div key={step.key} className="flex items-center gap-2">
            {i > 0 && (
              <div
                className={`w-8 h-px ${
                  i <= currentIndex ? "bg-accent/40" : "bg-border"
                }`}
              />
            )}
            <button
              onClick={() => isClickable && onGoToStep(step.key)}
              disabled={!isClickable}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-[12px] font-medium transition-colors ${
                isActive
                  ? "bg-accent-subtle text-accent"
                  : isDone
                  ? "text-muted hover:text-foreground cursor-pointer"
                  : "text-muted-2"
              } ${!isClickable && !isActive ? "cursor-default" : ""}`}
            >
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-semibold ${
                  isActive
                    ? "bg-accent text-white"
                    : isDone
                    ? "bg-surface-2 text-muted"
                    : "bg-surface-2 text-muted-2"
                }`}
              >
                {i + 1}
              </span>
              {step.label}
            </button>
          </div>
        );
      })}
    </div>
  );
}