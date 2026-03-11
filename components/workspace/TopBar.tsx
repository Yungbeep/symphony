"use client";

import { useState } from "react";
import {
  ChevronDown,
  Maximize2,
  Minimize2,
  BookMarked,
  Columns2,
} from "lucide-react";
import { models, providerColors } from "@/lib/data";
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

  return (
    <div className="flex items-center justify-between px-5 py-2.5 border-b border-border bg-surface/50 shrink-0">
      {/* Left: session title */}
      <div className="flex items-center gap-3 min-w-0">
        <h2 className="text-sm font-medium truncate">{sessionTitle}</h2>
      </div>

      {/* Right: controls */}
      <div className="flex items-center gap-1.5">
        {/* Model selector */}
        <div className="relative">
          <button
            onClick={() => setModelDropdown(!modelDropdown)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm hover:bg-surface-2 transition-colors cursor-pointer"
          >
            <div
              className="w-2 h-2 rounded-full"
              style={{ background: providerColors[activeModel.provider] }}
            />
            <span className="font-medium">{activeModel.name}</span>
            {activeModel.tag && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-accent/10 text-accent">
                {activeModel.tag}
              </span>
            )}
            <ChevronDown size={14} className="text-muted" />
          </button>

          {modelDropdown && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setModelDropdown(false)}
              />
              <div className="absolute right-0 top-full mt-1 z-50 w-64 rounded-xl border border-border bg-surface shadow-xl shadow-black/20 py-2 animate-fade-in">
                <div className="px-3 py-1.5 text-[11px] text-muted uppercase tracking-wider">
                  Models
                </div>
                {models.map((model) => (
                  <button
                    key={model.id}
                    onClick={() => {
                      onModelChange(model);
                      setModelDropdown(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2 text-sm text-left hover:bg-surface-2 transition-colors cursor-pointer ${
                      model.id === activeModel.id ? "text-accent" : "text-foreground"
                    }`}
                  >
                    <div
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ background: providerColors[model.provider] }}
                    />
                    <span className="flex-1">{model.name}</span>
                    {model.tag && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-surface-2 text-muted">
                        {model.tag}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="w-px h-5 bg-border mx-1" />

        {/* Split view */}
        <button
          onClick={onToggleSplit}
          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
            splitView
              ? "text-accent bg-accent/10"
              : "text-muted hover:text-foreground hover:bg-surface-2"
          }`}
          title="Split view"
        >
          <Columns2 size={16} />
        </button>

        {/* Prompt library */}
        <button
          onClick={onTogglePromptLibrary}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-muted hover:text-foreground hover:bg-surface-2 transition-colors cursor-pointer"
          title="Prompt library"
        >
          <BookMarked size={16} />
        </button>

        {/* Focus mode */}
        <button
          onClick={onToggleFocus}
          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
            focusMode
              ? "text-accent bg-accent/10"
              : "text-muted hover:text-foreground hover:bg-surface-2"
          }`}
          title={`Focus mode (${focusMode ? "on" : "off"})`}
        >
          {focusMode ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
        </button>

        <ThemeToggle />

        {/* Keyboard hint */}
        <div className="hidden lg:flex items-center gap-1.5 ml-2 text-muted">
          <Kbd>⌘</Kbd>
          <Kbd>K</Kbd>
        </div>
      </div>
    </div>
  );
}
