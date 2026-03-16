"use client";

import { ArrowLeftRight, FolderKanban, GitBranch, Boxes } from "lucide-react";

const problems = [
  "Twelve tabs open. Three providers. Zero continuity.",
  "Copy-pasting context between tools that don't talk to each other.",
  "Rebuilding the same project setup every time you start something new.",
  "No single view of what's deployed, what's broken, and what's next.",
];

const pillars = [
  {
    icon: Boxes,
    title: "Coordinated tools, not bookmarks",
    description:
      "Each tool in your orchestra has a defined role. Your AI thinks. Your database stores. Your deployment ships. They share the project context.",
  },
  {
    icon: FolderKanban,
    title: "Project-first, not chat-first",
    description:
      "Everything lives inside a project. Sessions, tools, memory, and progress. Switch projects, not tabs.",
  },
  {
    icon: ArrowLeftRight,
    title: "Built for handoffs",
    description:
      "Move context between models, between tools, between tasks. The work flows forward — you never start from scratch.",
  },
  {
    icon: GitBranch,
    title: "Ready for orchestration",
    description:
      "The tools you choose, the roles you assign, the context you build — everything is structured for a future where an agent coordinates the work.",
  },
];

export function V2Value() {
  return (
    <section className="relative py-28 px-6 section-glow">
      <div className="max-w-4xl mx-auto">
        {/* Problem */}
        <div className="max-w-xl mx-auto text-center mb-20">
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight mb-8">
            The workflow is the problem
          </h2>
          <div className="space-y-2">
            {problems.map((p) => (
              <div
                key={p}
                className="flex items-start gap-3 px-5 py-3 rounded-lg border border-border bg-surface text-sm text-muted leading-relaxed text-left"
              >
                <span className="text-muted-2 mt-0.5 shrink-0">&mdash;</span>
                {p}
              </div>
            ))}
          </div>
        </div>

        {/* Transition */}
        <div className="max-w-lg mx-auto text-center mb-20">
          <div className="inline-block w-px h-10 bg-gradient-to-b from-transparent via-border to-transparent mb-6" />
          <p className="text-[17px] leading-[1.8] text-muted">
            A carpenter doesn&apos;t walk back to the truck for every tool.
          </p>
          <p className="text-[17px] leading-[1.8] text-foreground mt-3 font-medium">
            Symphony is the toolbox — with a conductor.
          </p>
          <div className="inline-block w-px h-10 bg-gradient-to-b from-transparent via-border to-transparent mt-6" />
        </div>

        {/* Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {pillars.map((p) => (
            <div
              key={p.title}
              className="group rounded-xl border border-border bg-surface p-7 transition-all duration-300 hover:border-accent/20"
            >
              <div className="mb-4 inline-flex items-center justify-center w-10 h-10 rounded-lg bg-surface-2 text-muted group-hover:text-accent transition-colors">
                <p.icon size={20} />
              </div>
              <h3 className="text-[15px] font-medium mb-2">{p.title}</h3>
              <p className="text-muted text-sm leading-relaxed">
                {p.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}