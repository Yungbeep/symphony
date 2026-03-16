"use client";

import Link from "next/link";
import { ArrowLeft, Plus, Clock, Layers } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { ToolIcon } from "@/components/v2/ToolIcon";

// Sample projects for the projects list
const demoProjects = [
  {
    id: "demo-1",
    name: "Acme Dashboard",
    type: "SaaS MVP",
    tools: ["claude", "github", "supabase", "vercel", "posthog"],
    stage: "Building",
    updatedAt: "2 hours ago",
  },
  {
    id: "demo-2",
    name: "Prompt Studio",
    type: "AI Tool",
    tools: ["chatgpt", "claude", "github", "vercel", "sentry"],
    stage: "Setup",
    updatedAt: "1 day ago",
  },
  {
    id: "demo-3",
    name: "Team Wiki",
    type: "Internal Tool",
    tools: ["chatgpt", "github", "supabase", "clerk"],
    stage: "Shipping",
    updatedAt: "3 days ago",
  },
];

export default function ProjectsPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-border px-6 h-14 flex items-center justify-between">
        <Link
          href="/v2"
          className="flex items-center gap-2 text-muted hover:text-foreground transition-colors"
        >
          <ArrowLeft size={16} />
          <Logo size="sm" />
        </Link>

        <Link
          href="/v2/new"
          className="flex items-center gap-2 px-4 py-1.5 rounded-md bg-accent text-white text-[13px] font-medium hover:bg-accent-hover transition-colors"
        >
          <Plus size={14} />
          New project
        </Link>
      </header>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-semibold tracking-tight mb-2">
          Projects
        </h1>
        <p className="text-sm text-muted mb-10">
          Each project is a Symphony — a coordinated workspace with its own
          orchestra, memory, and work history.
        </p>

        <div className="space-y-3">
          {demoProjects.map((project) => (
            <Link
              key={project.id}
              href={`/v2/projects/${project.id}?name=${encodeURIComponent(project.name)}&type=${project.type.toLowerCase().replace(" ", "-")}&tools=${project.tools.join(",")}`}
              className="block group"
            >
              <div className="flex items-center gap-5 p-5 rounded-xl border border-border bg-surface hover:border-accent/20 transition-all">
                {/* Project icon */}
                <div className="w-10 h-10 rounded-lg bg-surface-2 flex items-center justify-center shrink-0 group-hover:bg-accent-subtle transition-colors">
                  <Layers
                    size={18}
                    className="text-muted group-hover:text-accent transition-colors"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[14px] font-medium">
                      {project.name}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-surface-2 text-muted-2 font-medium">
                      {project.type}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-accent-subtle text-accent font-medium">
                      {project.stage}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {project.tools.slice(0, 5).map((toolId) => (
                      <ToolIcon key={toolId} toolId={toolId} size="sm" />
                    ))}
                    {project.tools.length > 5 && (
                      <span className="text-[10px] text-muted-2 ml-1">
                        +{project.tools.length - 5}
                      </span>
                    )}
                  </div>
                </div>

                {/* Meta */}
                <div className="text-[11px] text-muted-2 flex items-center gap-1.5 shrink-0">
                  <Clock size={12} />
                  {project.updatedAt}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Empty state hint */}
        <div className="mt-8 text-center">
          <p className="text-[12px] text-muted-2">
            These are demo projects. Create a new Symphony to start building.
          </p>
        </div>
      </main>
    </div>
  );
}