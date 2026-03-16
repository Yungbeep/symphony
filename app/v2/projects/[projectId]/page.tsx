"use client";

import { useSearchParams } from "next/navigation";
import { useMemo, Suspense } from "react";
import type { ProjectToolState } from "@/lib/v2/types";
import { getToolById } from "@/lib/v2/data/tools";
import { OrchestraPanel } from "@/components/v2/workspace/OrchestraPanel";
import { WorkArea } from "@/components/v2/workspace/WorkArea";
import { MemoryPanel } from "@/components/v2/workspace/MemoryPanel";

function WorkspaceContent() {
  const searchParams = useSearchParams();

  const projectName = searchParams.get("name") || "Untitled Project";
  const projectType = searchParams.get("type") || "saas-mvp";
  const toolIds = searchParams.get("tools")?.split(",").filter(Boolean) ?? [];

  const tools: ProjectToolState[] = useMemo(
    () =>
      toolIds
        .map((id) => {
          const def = getToolById(id);
          if (!def) return null;
          return {
            toolId: id,
            category: def.category,
            role: def.role,
            addedAt: new Date(),
          };
        })
        .filter((t): t is ProjectToolState => t !== null),
    [toolIds.join(",")]
  );

  return (
    <div className="h-screen flex">
      {/* Left: Orchestra panel */}
      <div className="w-[220px] shrink-0">
        <OrchestraPanel
          tools={tools}
          projectName={projectName}
          projectType={projectType}
        />
      </div>

      {/* Center: Work area */}
      <div className="flex-1 min-w-0">
        <WorkArea projectName={projectName} />
      </div>

      {/* Right: Memory panel */}
      <div className="w-[260px] shrink-0">
        <MemoryPanel projectName={projectName} />
      </div>
    </div>
  );
}

export default function ProjectWorkspacePage() {
  return (
    <Suspense
      fallback={
        <div className="h-screen flex items-center justify-center text-muted">
          Loading workspace…
        </div>
      }
    >
      <WorkspaceContent />
    </Suspense>
  );
}