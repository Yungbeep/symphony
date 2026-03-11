"use client";

import { X, Search, Tag } from "lucide-react";
import { savedPrompts } from "@/lib/data";
import { useState } from "react";

interface PromptLibraryProps {
  onClose: () => void;
  onInsert: (content: string) => void;
}

export function PromptLibrary({ onClose, onInsert }: PromptLibraryProps) {
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const allTags = Array.from(new Set(savedPrompts.flatMap((p) => p.tags)));

  const filtered = savedPrompts.filter((prompt) => {
    const matchesSearch =
      !search ||
      prompt.title.toLowerCase().includes(search.toLowerCase()) ||
      prompt.content.toLowerCase().includes(search.toLowerCase());
    const matchesTag = !activeTag || prompt.tags.includes(activeTag);
    return matchesSearch && matchesTag;
  });

  return (
    <div className="w-80 border-l border-border bg-surface flex flex-col shrink-0 animate-slide-in-left">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-border">
        <span className="text-sm font-semibold">Prompt Library</span>
        <button
          onClick={onClose}
          className="w-7 h-7 rounded-md flex items-center justify-center text-muted hover:text-foreground hover:bg-surface-2 transition-colors cursor-pointer"
        >
          <X size={16} />
        </button>
      </div>

      {/* Search */}
      <div className="px-3 py-2.5">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-surface-2 text-muted">
          <Search size={14} />
          <input
            type="text"
            placeholder="Search prompts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent outline-none text-sm flex-1 text-foreground placeholder:text-muted"
          />
        </div>
      </div>

      {/* Tags */}
      <div className="px-3 pb-2 flex items-center gap-1.5 flex-wrap">
        <button
          onClick={() => setActiveTag(null)}
          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs transition-colors cursor-pointer ${
            !activeTag
              ? "bg-accent/10 text-accent"
              : "text-muted hover:text-foreground hover:bg-surface-2"
          }`}
        >
          All
        </button>
        {allTags.map((tag) => (
          <button
            key={tag}
            onClick={() => setActiveTag(activeTag === tag ? null : tag)}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs transition-colors cursor-pointer ${
              activeTag === tag
                ? "bg-accent/10 text-accent"
                : "text-muted hover:text-foreground hover:bg-surface-2"
            }`}
          >
            <Tag size={10} />
            {tag}
          </button>
        ))}
      </div>

      {/* Prompts */}
      <div className="flex-1 overflow-y-auto px-3 pb-4 space-y-2">
        {filtered.map((prompt) => (
          <button
            key={prompt.id}
            onClick={() => onInsert(prompt.content)}
            className="w-full text-left p-3 rounded-lg border border-border hover:border-accent/30 bg-background hover:bg-surface-2/50 transition-all duration-200 space-y-2 group cursor-pointer"
          >
            <div className="text-sm font-medium group-hover:text-accent transition-colors">
              {prompt.title}
            </div>
            <div className="text-xs text-muted line-clamp-2 leading-relaxed">
              {prompt.content}
            </div>
            <div className="flex items-center gap-1.5">
              {prompt.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] px-1.5 py-0.5 rounded bg-surface-2 text-muted"
                >
                  {tag}
                </span>
              ))}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
