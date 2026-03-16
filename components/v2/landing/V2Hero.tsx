"use client";

import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";
import { CATEGORY_META } from "@/lib/v2/data/tools";

/**
 * Section color accents — each section gets a subtle signature hue
 * that carries through the stage, the builder, and the workspace.
 */
const SECTION_ACCENTS: Record<string, string> = {
  brain: "#a78bfa",
  build: "#60a5fa",
  ship: "#34d399",
  observe: "#fbbf24",
  sell: "#f87171",
};

export function V2Hero() {
  return (
    <section className="relative min-h-[92vh] flex flex-col items-center justify-center px-6 overflow-hidden">
      {/* Concert-hall ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-accent/[0.04] blur-[100px]" />
        <div className="absolute bottom-[10%] left-1/2 -translate-x-1/2 w-[900px] h-[200px] rounded-full bg-accent/[0.02] blur-[80px]" />
        {/* Spotlight lines */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-[40%] bg-gradient-to-b from-accent/10 to-transparent" />
      </div>

      {/* Copy */}
      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-surface text-[11px] text-muted mb-8 animate-fade-in">
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          Every project is a Symphony
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-semibold tracking-[-0.035em] leading-[1.1] mb-6 animate-fade-in-up">
          Assemble your orchestra.
          <br />
          <span className="text-muted">Conduct your build.</span>
        </h1>

        <p className="text-[17px] sm:text-lg text-muted leading-relaxed max-w-xl mx-auto mb-10 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
          Give every tool a seat. Give every seat a role.
          AI models, infrastructure, deployment, analytics — coordinated
          in one workspace instead of scattered across twelve tabs.
        </p>

        <div className="flex items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: "200ms" }}>
          <Link
            href="/v2/new"
            className="inline-flex items-center gap-2.5 px-6 py-3 rounded-lg bg-accent text-white font-medium text-sm hover:bg-accent-hover transition-colors"
          >
            <Plus size={16} />
            Compose a new Symphony
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

      {/* The Stage — empty orchestra with section seats */}
      <div className="relative z-10 mt-20 w-full max-w-3xl mx-auto animate-fade-in-up" style={{ animationDelay: "350ms" }}>
        {/* Stage floor gradient */}
        <div className="absolute -inset-x-4 -bottom-4 h-[60%] bg-gradient-to-t from-accent/[0.02] to-transparent rounded-b-3xl pointer-events-none" />

        <div className="relative rounded-2xl border border-border bg-surface/40 backdrop-blur-sm overflow-hidden">
          {/* Stage header */}
          <div className="px-6 py-4 border-b border-border/60 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-accent/60" />
              <span className="text-[11px] uppercase tracking-[0.12em] text-muted-2 font-medium">
                The Stage
              </span>
            </div>
            <span className="text-[10px] text-muted-2">
              5 sections &middot; 0 seated
            </span>
          </div>

          {/* Orchestra sections — arc layout */}
          <div className="px-6 py-8">
            {/* Back row: Brain */}
            <div className="flex justify-center mb-4">
              <StageSeat section="brain" />
            </div>
            {/* Middle row: Build + Ship */}
            <div className="flex justify-center gap-4 mb-4">
              <StageSeat section="build" />
              <StageSeat section="ship" />
            </div>
            {/* Front row: Observe + Sell */}
            <div className="flex justify-center gap-4">
              <StageSeat section="observe" />
              <StageSeat section="sell" />
            </div>

            {/* Conductor line */}
            <div className="flex flex-col items-center mt-6">
              <div className="w-px h-6 bg-gradient-to-b from-border to-transparent" />
              <div className="w-6 h-6 rounded-full border border-border bg-surface flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-accent/40" />
              </div>
              <span className="text-[9px] text-muted-2 mt-1.5 tracking-wide uppercase">
                Conductor
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StageSeat({ section }: { section: string }) {
  const meta = CATEGORY_META[section as keyof typeof CATEGORY_META];
  const accent = SECTION_ACCENTS[section] ?? "#7c82f8";

  return (
    <div className="group relative w-[140px]">
      <div
        className="flex flex-col items-center gap-2.5 py-5 px-4 rounded-xl border border-dashed border-border bg-background/40 hover:border-accent/20 transition-all"
        style={{
          boxShadow: `inset 0 1px 0 0 color-mix(in srgb, ${accent} 6%, transparent)`,
        }}
      >
        {/* Empty seat indicator */}
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors"
          style={{
            background: `color-mix(in srgb, ${accent} 8%, transparent)`,
            border: `1px dashed color-mix(in srgb, ${accent} 20%, transparent)`,
          }}
        >
          <Plus size={14} style={{ color: `color-mix(in srgb, ${accent} 50%, transparent)` }} />
        </div>
        <div className="text-center">
          <div className="text-[11px] font-semibold" style={{ color: accent }}>
            {meta?.label}
          </div>
          <div className="text-[9px] text-muted-2 mt-0.5">
            {meta?.description}
          </div>
        </div>
      </div>
    </div>
  );
}