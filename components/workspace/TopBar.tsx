"use client";

import { useState } from "react";
import {
  ChevronDown,
  Maximize2,
  Minimize2,
  BookMarked,
  Columns2,
  Check,
} from "lucide-react";
import { models, providerColors, providerNames } from "@/lib/data";
import type { Model } from "@/lib/types";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Kbd } from "@/components/ui/Kbd";

interface TopBarProps {
  sessionTitle: string;
  activeModel: Model;
  onModelChange: (model: Model) => void;
  focusMode: boolean;
  onToggleFocus: () => void;
  onTogglePromptLibrary: () => void;
  onToggleSplit: () => void;
  splitView: boolean;
}

export function TopBar({
  sessionTitle,
  activeModel,
  onModelChange,
  focusMode,
  onToggleFocus,
  onTogglePromptLibrary,
  onToggleSplit,
  splitView,
}: TopBarProps) {
  const [modelDropdown, setModelDropdown] = useState(false);

  // Group models by provider
  const providers = Array.from(new Set(models.map((m) => m.provider)));
  const modelsByProvider = providers.reduce(
    (acc, provider) => {
      acc[provider] = models.filter((m) => m.provider === provider);
      return acc;
    },
    {} as Record<string, Model[]>
  );

  return (
    <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-surface/50 shrink-0">
      {/* Left: session title */}
      <div className="flex items-center gap-2.5 min-w-0">
        <h2 className="text-[13px] font-medium truncate">{sessionTitle}</h2>
        <span className="text-[11px] text-muted-2 hidden sm:block">·</span>
        <span className="text-[11px] text-muted-2 hidden sm:block">
          {activeModel.provider === "anthropic" ? "Anthropic" : activeModel.provider === "openai" ? "OpenAI" : activeModel.provider === "google" ? "Google" : "Mistral"}
        </span>
      </div>

      {/* Right: controls */}
      <div className="flex items-center gap-1">
        {/* Model selector */}
        <div className="relative">
          <button
            onClick={() => setModelDropdown(!modelDropdown)}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-md text-[13px] hover:bg-surface-2 transition-colors cursor-pointer"
          >
            <div
              className="w-2 h-2 rounded-full"
              style={{ background: providerColors[activeModel.provider] }}
            />
            <span className="font-medium">{activeModel.name}</span>
            {activeModel.tag && (
              <span className="text-[10px] px-1.5 py-px rounded bg-surface-2 text-muted-2 font-medium">
                {activeModel.tag}
              </span>
            )}
            <ChevronDown size={13} className="text-muted-2" />
          </button>

          {modelDropdown && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setModelDropdown(false)}
              />
              <div className="absolute right-0 top-full mt-1 z-50 w-60 rounded-lg border border-border bg-surface shadow-xl shadow-black/25 py-1.5 animate-fade-in">
                {providers.map((provider) => (
                  <div key={provider}>
                    <div className="px-3 py-1.5 text-[10px] text-muted-2 uppercase tracking-[0.1em]">
                      {providerNames[provider]}
                    </div>
                    {modelsByProvider[provider].map((model) => (
                      <button
                        key={model.id}
                        onClick={() => {
                          onModelChange(model);
                          setModelDropdown(false);
                        }}
                        className={`w-full flex items-center gap-2.5 px-3 py-[7px] text-[13px] text-left hover:bg-surface-2 transition-colors cursor-pointer ${
                          model.id === activeModel.id
                            ? "text-accent"
                            : "text-foreground"
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
                        {model.id === activeModel.id && (
                          <Check size={13} className="text-accent shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="w-px h-4 bg-border mx-1" />

        {/* Split view */}
        <button
          onClick={onToggleSplit}
          className={`w-7 h-7 rounded-md flex items-center justify-center transition-colors cursor-pointer ${
            splitView
              ? "text-accent bg-accent-subtle"
              : "text-muted-2 hover:text-foreground hover:bg-surface-2"
          }`}
          title="Split view"
        >
          <Columns2 size={15} />
        </button>

        {/* Prompt library */}
        <button
          onClick={onTogglePromptLibrary}
          className="w-7 h-7 rounded-md flex items-center justify-center text-muted-2 hover:text-foreground hover:bg-surface-2 transition-colors cursor-pointer"
          title="Prompt library"
        >
          <BookMarked size={15} />
        </button>

        {/* Focus mode */}
        <button
          onClick={onToggleFocus}
          className={`w-7 h-7 rounded-md flex items-center justify-center transition-colors cursor-pointer ${
            focusMode
              ? "text-accent bg-accent-subtle"
              : "text-muted-2 hover:text-foreground hover:bg-surface-2"
          }`}
          title={`Focus mode (${focusMode ? "on" : "off"})`}
        >
          {focusMode ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
        </button>

        <ThemeToggle />

        {/* Keyboard hint */}
        <div className="hidden lg:flex items-center gap-1 ml-1.5">
          <Kbd>⌘</Kbd>
          <Kbd>K</Kbd>
        </div>
      </div>
    </div>
  );
}
