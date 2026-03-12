"use client";

import { useState } from "react";
import {
  ArrowRight,
  Columns2,
  Plus,
  X,
  Check,
} from "lucide-react";
import { models, providerColors, providerNames } from "@/lib/data";
import type { Model, HandoffMode } from "@/lib/types";

interface HandoffModalProps {
  /** Model of the source session */
  sourceModel: Model;
  /** Close without action */
  onClose: () => void;
  /** Execute handoff */
  onHandoff: (targetModel: Model, mode: HandoffMode) => void;
}

export function HandoffModal({
  sourceModel,
  onClose,
  onHandoff,
}: HandoffModalProps) {
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);
  const [mode, setMode] = useState<HandoffMode>("split-view");

  // Exclude the current model — handoff to the same model isn't useful
  const availableModels = models.filter((m) => m.id !== sourceModel.id);
  const providers = Array.from(
    new Set(availableModels.map((m) => m.provider))
  );
  const modelsByProvider = providers.reduce(
    (acc, provider) => {
      acc[provider] = availableModels.filter((m) => m.provider === provider);
      return acc;
    },
    {} as Record<string, Model[]>
  );

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="pointer-events-auto w-full max-w-sm rounded-xl border border-border bg-surface shadow-2xl shadow-black/30 animate-fade-in"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 pt-5 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-accent-subtle flex items-center justify-center">
                <ArrowRight size={14} className="text-accent" />
              </div>
              <div>
                <h3 className="text-[14px] font-semibold">Hand off</h3>
                <p className="text-[11px] text-muted-2">
                  Send context to another model
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-6 h-6 rounded-md flex items-center justify-center text-muted-2 hover:text-foreground hover:bg-surface-2 transition-colors cursor-pointer"
            >
              <X size={14} />
            </button>
          </div>

          {/* Source indicator */}
          <div className="mx-5 mb-3 flex items-center gap-2 px-3 py-2 rounded-lg bg-surface-2 text-[12px]">
            <div
              className="w-2 h-2 rounded-full shrink-0"
              style={{ background: providerColors[sourceModel.provider] }}
            />
            <span className="text-muted">From</span>
            <span className="font-medium">{sourceModel.name}</span>
          </div>

          {/* Model selection */}
          <div className="px-5 pb-3">
            <div className="text-[11px] text-muted-2 uppercase tracking-[0.08em] mb-2">
              Send to
            </div>
            <div className="max-h-48 overflow-y-auto -mx-1">
              {providers.map((provider) => (
                <div key={provider}>
                  <div className="px-1 pt-2 pb-1 text-[10px] text-muted-2 uppercase tracking-[0.1em]">
                    {providerNames[provider]}
                  </div>
                  {modelsByProvider[provider].map((model) => {
                    const isSelected = selectedModel?.id === model.id;
                    return (
                      <button
                        key={model.id}
                        onClick={() => setSelectedModel(model)}
                        className={`w-full flex items-center gap-2.5 px-3 py-[7px] rounded-md text-[13px] text-left transition-colors cursor-pointer ${
                          isSelected
                            ? "bg-accent-subtle text-accent"
                            : "text-foreground hover:bg-surface-2"
                        }`}
                      >
                        <div
                          className="w-1.5 h-1.5 rounded-full shrink-0"
                          style={{ background: providerColors[model.provider] }}
                        />
                        <span className="flex-1">{model.name}</span>
                        {model.tag && (
                          <span className="text-[10px] px-1.5 py-px rounded bg-surface-2 text-muted-2">
                            {model.tag}
                          </span>
                        )}
                        {isSelected && (
                          <Check size={13} className="text-accent shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Mode selection */}
          <div className="px-5 pb-4">
            <div className="text-[11px] text-muted-2 uppercase tracking-[0.08em] mb-2">
              Open as
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setMode("split-view")}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-[12px] font-medium transition-colors cursor-pointer ${
                  mode === "split-view"
                    ? "border-accent/30 bg-accent-subtle text-accent"
                    : "border-border bg-surface-2 text-muted hover:text-foreground hover:border-border"
                }`}
              >
                <Columns2 size={14} />
                Side by side
              </button>
              <button
                onClick={() => setMode("new-session")}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-[12px] font-medium transition-colors cursor-pointer ${
                  mode === "new-session"
                    ? "border-accent/30 bg-accent-subtle text-accent"
                    : "border-border bg-surface-2 text-muted hover:text-foreground hover:border-border"
                }`}
              >
                <Plus size={14} />
                New session
              </button>
            </div>
          </div>

          {/* Action */}
          <div className="px-5 pb-5">
            <button
              disabled={!selectedModel}
              onClick={() => {
                if (selectedModel) onHandoff(selectedModel, mode);
              }}
              className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-[13px] font-medium transition-all cursor-pointer ${
                selectedModel
                  ? "bg-accent text-white hover:bg-accent-hover shadow-md shadow-accent/20"
                  : "bg-surface-2 text-muted-2 cursor-not-allowed"
              }`}
            >
              <ArrowRight size={14} />
              {selectedModel
                ? `Hand off to ${selectedModel.name}`
                : "Select a model"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
