"use client";

import { X, Search, Tag, ArrowRight } from "lucide-react";
import { savedPrompts } from "@/lib/demo/seed-data";
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
    <div className="w-72 border-l border-border bg-surface flex flex-col shrink-0 animate-slide-in-right">
      {/* Header */}
      <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-border">
        <span className="text-[13px] font-medium">Prompts</span>
        <button
          onClick={onClose}
          className="w-6 h-6 rounded-md flex items-center justify-center text-muted-2 hover:text-foreground hover:bg-surface-2 transition-colors cursor-pointer"
        >
          <X size={14} />
        </button>
      </div>

      {/* Search */}
      <div className="px-3 py-2">
        <div className="flex items-center gap-2 px-2.5 py-[7px] rounded-md bg-surface-2 text-muted-2">
          <Search size={13} />
          <input
            type="text"
            placeholder="Search prompts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent outline-none text-[13px] flex-1 text-foreground placeholder:text-muted-2"
          />
        </div>
      </div>

      {/* Tags */}
      <div className="px-3 pb-2 flex items-center gap-1 flex-wrap">
        <button
          onClick={() => setActiveTag(null)}
          className={`px-2 py-0.5 rounded text-[11px] transition-colors cursor-pointer ${
            !activeTag
              ? "bg-accent-subtle text-accent"
              : "text-muted-2 hover:text-foreground hover:bg-surface-2"
          }`}
        >
          All
        </button>
        {allTags.map((tag) => (
          <button
            key={tag}
            onClick={() => setActiveTag(activeTag === tag ? null : tag)}
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] transition-colors cursor-pointer ${
              activeTag === tag
                ? "bg-accent-subtle text-accent"
                : "text-muted-2 hover:text-foreground hover:bg-surface-2"
            }`}
          >
            <Tag size={9} />
            {tag}
          </button>
        ))}
      </div>

      {/* Prompts */}
      <div className="flex-1 overflow-y-auto px-2.5 pb-3 space-y-1.5">
        {filtered.map((prompt) => (
          <button
            key={prompt.id}
            onClick={() => onInsert(prompt.content)}
            className="w-full text-left p-3 rounded-lg border border-border hover:border-accent/20 bg-background transition-all duration-200 group cursor-pointer"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[13px] font-medium group-hover:text-accent transition-colors">
                {prompt.title}
              </span>
              <ArrowRight
                size={12}
                className="text-muted-2 opacity-0 group-hover:opacity-100 group-hover:text-accent transition-all"
              />
            </div>
            <p className="text-[11px] text-muted line-clamp-2 leading-[1.6]">
              {prompt.content}
            </p>
            <div className="flex items-center gap-1 mt-2">
              {prompt.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[9px] px-1.5 py-px rounded bg-surface-2 text-muted-2 uppercase tracking-[0.05em]"
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
