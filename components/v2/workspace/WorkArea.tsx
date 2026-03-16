"use client";

import { MessageSquare, FileCode, GitBranch, ArrowRight } from "lucide-react";

interface WorkAreaProps {
  projectName: string;
}

export function WorkArea({ projectName }: WorkAreaProps) {
  return (
    <div className="h-full flex flex-col bg-background">
      {/* Top bar */}
      <div className="h-12 border-b border-border flex items-center px-5">
        <span className="text-[13px] font-medium text-muted">
          Active work
        </span>
      </div>

      {/* Empty state / welcome */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-md text-center">
          <div className="w-12 h-12 rounded-xl bg-surface-2 flex items-center justify-center mx-auto mb-5">
            <MessageSquare size={22} className="text-muted" />
          </div>
          <h3 className="text-lg font-semibold mb-2">
            {projectName} is ready
          </h3>
          <p className="text-sm text-muted leading-relaxed mb-8">
            Your orchestra is assembled. This is where sessions, threads, and
            active work will live. Start a conversation with one of your
            AI models or begin wiring your stack.
          </p>

          <div className="grid grid-cols-3 gap-3">
            {[
              {
                icon: MessageSquare,
                label: "New thread",
                desc: "Start a conversation",
              },
              {
                icon: FileCode,
                label: "Architecture",
                desc: "Plan the system",
              },
              {
                icon: GitBranch,
                label: "First commit",
                desc: "Set up the repo",
              },
            ].map((item) => (
              <button
                key={item.label}
                className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border bg-surface hover:border-accent/20 transition-colors cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-lg bg-surface-2 flex items-center justify-center text-muted group-hover:text-accent transition-colors">
                  <item.icon size={16} />
                </div>
                <div className="text-[12px] font-medium">{item.label}</div>
                <div className="text-[10px] text-muted-2">{item.desc}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}