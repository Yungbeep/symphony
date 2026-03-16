"use client";

import { MessageSquare, FileCode, GitBranch, Sparkles, ArrowRight } from "lucide-react";

interface WorkAreaProps {
  projectName: string;
}

export function WorkArea({ projectName }: WorkAreaProps) {
  return (
    <div className="h-full flex flex-col bg-background">
      {/* Top bar */}
      <div className="h-12 border-b border-border flex items-center justify-between px-5">
        <span className="text-[13px] font-medium text-muted">
          Active work
        </span>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-muted-2 px-2 py-0.5 rounded bg-surface border border-border">
            Stage: Setup
          </span>
        </div>
      </div>

      {/* Main area */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-lg">
          {/* Welcome header */}
          <div className="text-center mb-10">
            <h3 className="text-xl font-semibold mb-2">
              {projectName}
            </h3>
            <p className="text-sm text-muted leading-relaxed">
              Your orchestra is seated. The workspace is ready.
              Start a thread, plan architecture, or let the
              conductor suggest your first move.
            </p>
          </div>

          {/* Agent suggestion card — agentic scaffolding */}
          <div className="rounded-xl border border-accent/15 bg-accent-subtle p-5 mb-6">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0 mt-0.5">
                <Sparkles size={16} className="text-accent" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[12px] font-semibold text-accent mb-1">
                  Next recommended action
                </div>
                <p className="text-[13px] leading-relaxed mb-3">
                  Initialize your repository and connect it to your deployment
                  pipeline. This unlocks CI/CD for every future change.
                </p>
                <button className="inline-flex items-center gap-1.5 text-[11px] font-medium text-accent hover:text-accent-hover transition-colors cursor-pointer">
                  Begin
                  <ArrowRight size={11} />
                </button>
              </div>
            </div>
          </div>

          {/* Quick actions */}
          <div className="grid grid-cols-3 gap-3">
            {[
              {
                icon: MessageSquare,
                label: "New thread",
                desc: "Talk to your Brain section",
              },
              {
                icon: FileCode,
                label: "Architecture",
                desc: "Plan system design",
              },
              {
                icon: GitBranch,
                label: "First commit",
                desc: "Initialize the repo",
              },
            ].map((item) => (
              <button
                key={item.label}
                className="flex flex-col items-center gap-2.5 p-4 rounded-xl border border-border bg-surface hover:border-accent/20 transition-colors cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-lg bg-surface-2 flex items-center justify-center text-muted group-hover:text-accent transition-colors">
                  <item.icon size={16} />
                </div>
                <div className="text-center">
                  <div className="text-[12px] font-medium">{item.label}</div>
                  <div className="text-[10px] text-muted-2 mt-0.5">{item.desc}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}