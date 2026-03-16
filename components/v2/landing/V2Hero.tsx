"use client";

import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";
import { CATEGORY_ORDER, CATEGORY_META } from "@/lib/v2/data/tools";

export function V2Hero() {
  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-6 overflow-hidden">
      {/* Subtle background radial */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-accent/[0.03] blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-surface text-[11px] text-muted mb-8 animate-fade-in">
          <span className="w-1.5 h-1.5 rounded-full bg-accent" />
          V2 — Orchestrated AI workspace
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-[-0.035em] leading-[1.1] mb-6 animate-fade-in-up">
          Stop switching tabs.
          <br />
          <span className="text-muted">Start building.</span>
        </h1>

        <p className="text-[17px] sm:text-lg text-muted leading-relaxed max-w-xl mx-auto mb-10 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
          Symphony puts your AI models, dev tools, and project context in one coordinated workspace. Pick your tools, assign their roles, and start working.
        </p>

        <div className="flex items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: "200ms" }}>
          <Link
            href="/v2/new"
            className="inline-flex items-center gap-2.5 px-6 py-3 rounded-lg bg-accent text-white font-medium text-sm hover:bg-accent-hover transition-colors"
          >
            <Plus size={16} />
            New Symphony
          </Link>
          <Link
            href="/v2/projects"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-lg border border-border bg-surface text-sm text-muted hover:text-foreground hover:border-accent/20 transition-colors"
          >
            View projects
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* Orchestra stage preview */}
      <div className="relative z-10 mt-20 w-full max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: "350ms" }}>
        <div className="rounded-xl border border-border bg-surface/60 p-6 backdrop-blur-sm">
          <div className="text-[11px] uppercase tracking-[0.1em] text-muted-2 mb-5">
            Your orchestra
          </div>
          <div className="grid grid-cols-5 gap-3">
            {CATEGORY_ORDER.map((cat) => {
              const meta = CATEGORY_META[cat];
              return (
                <div
                  key={cat}
                  className="flex flex-col items-center gap-2 py-4 rounded-lg border border-dashed border-border hover:border-accent/20 transition-colors group"
                >
                  <div className="w-8 h-8 rounded-lg bg-surface-2 flex items-center justify-center text-muted-2 group-hover:text-accent transition-colors">
                    <Plus size={14} />
                  </div>
                  <span className="text-[10px] font-medium text-muted-2 group-hover:text-muted transition-colors">
                    {meta.label}
                  </span>
                </div>
              );
            })}
          </div>
          <p className="text-center text-[11px] text-muted-2 mt-5">
            Each seat is a tool with a role in your build system
          </p>
        </div>
      </div>
    </section>
  );
}