"use client";

import { useState, useCallback, useMemo } from "react";
import type {
  Project,
  ProjectToolState,
  ProjectTypeName,
  OnboardingStep,
  OnboardingState,
  ToolCategory,
  Blueprint,
} from "./types";
import { getToolById } from "./data/tools";
import { generateBlueprint } from "./blueprint";

// ---------------------------------------------------------------------------
// ID generator
// ---------------------------------------------------------------------------

let _counter = 0;
function uid(prefix = "id"): string {
  _counter += 1;
  return `${prefix}-${Date.now()}-${_counter}`;
}

// ---------------------------------------------------------------------------
// Onboarding step order
// ---------------------------------------------------------------------------

const STEP_ORDER: OnboardingStep[] = ["basics", "type", "orchestra", "review"];

// ---------------------------------------------------------------------------
// Onboarding hook
// ---------------------------------------------------------------------------

export function useOnboarding() {
  const [state, setState] = useState<OnboardingState>({
    step: "basics",
    projectName: "",
    projectDescription: "",
    projectType: null,
    selectedTools: [],
  });

  const stepIndex = STEP_ORDER.indexOf(state.step);

  const canGoNext = useMemo(() => {
    switch (state.step) {
      case "basics":
        return state.projectName.trim().length > 0;
      case "type":
        return state.projectType !== null;
      case "orchestra":
        return state.selectedTools.length > 0;
      case "review":
        return true;
      default:
        return false;
    }
  }, [state]);

  const goNext = useCallback(() => {
    const idx = STEP_ORDER.indexOf(state.step);
    if (idx < STEP_ORDER.length - 1) {
      setState((s) => ({ ...s, step: STEP_ORDER[idx + 1] }));
    }
  }, [state.step]);

  const goBack = useCallback(() => {
    const idx = STEP_ORDER.indexOf(state.step);
    if (idx > 0) {
      setState((s) => ({ ...s, step: STEP_ORDER[idx - 1] }));
    }
  }, [state.step]);

  const goToStep = useCallback((step: OnboardingStep) => {
    setState((s) => ({ ...s, step }));
  }, []);

  const setProjectName = useCallback((name: string) => {
    setState((s) => ({ ...s, projectName: name }));
  }, []);

  const setProjectDescription = useCallback((desc: string) => {
    setState((s) => ({ ...s, projectDescription: desc }));
  }, []);

  const setProjectType = useCallback((type: ProjectTypeName) => {
    setState((s) => ({ ...s, projectType: type }));
  }, []);

  const addTool = useCallback((toolId: string) => {
    setState((s) => {
      if (s.selectedTools.some((t) => t.toolId === toolId)) return s;
      const def = getToolById(toolId);
      if (!def) return s;
      const tool: ProjectToolState = {
        toolId,
        category: def.category,
        role: def.role,
        addedAt: new Date(),
      };
      return { ...s, selectedTools: [...s.selectedTools, tool] };
    });
  }, []);

  const removeTool = useCallback((toolId: string) => {
    setState((s) => ({
      ...s,
      selectedTools: s.selectedTools.filter((t) => t.toolId !== toolId),
    }));
  }, []);

  const toggleTool = useCallback((toolId: string) => {
    setState((s) => {
      const exists = s.selectedTools.some((t) => t.toolId === toolId);
      if (exists) {
        return {
          ...s,
          selectedTools: s.selectedTools.filter((t) => t.toolId !== toolId),
        };
      }
      const def = getToolById(toolId);
      if (!def) return s;
      return {
        ...s,
        selectedTools: [
          ...s.selectedTools,
          {
            toolId,
            category: def.category,
            role: def.role,
            addedAt: new Date(),
          },
        ],
      };
    });
  }, []);

  const blueprint = useMemo<Blueprint | null>(() => {
    if (!state.projectName || !state.projectType || state.selectedTools.length === 0)
      return null;
    return generateBlueprint(
      state.projectName,
      state.projectType,
      state.selectedTools
    );
  }, [state.projectName, state.projectType, state.selectedTools]);

  return {
    state,
    stepIndex,
    totalSteps: STEP_ORDER.length,
    canGoNext,
    goNext,
    goBack,
    goToStep,
    setProjectName,
    setProjectDescription,
    setProjectType,
    addTool,
    removeTool,
    toggleTool,
    blueprint,
  };
}

// ---------------------------------------------------------------------------
// Projects store hook
// ---------------------------------------------------------------------------

export function useProjectsStore() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);

  const activeProject = useMemo(
    () => projects.find((p) => p.id === activeProjectId) ?? null,
    [projects, activeProjectId]
  );

  const createProject = useCallback(
    (
      name: string,
      description: string,
      type: ProjectTypeName,
      tools: ProjectToolState[],
      blueprint: Blueprint | null
    ): Project => {
      const now = new Date();
      const project: Project = {
        id: uid("proj"),
        name,
        description,
        type,
        stage: "setup",
        tools,
        blueprint,
        createdAt: now,
        updatedAt: now,
      };
      setProjects((prev) => [project, ...prev]);
      setActiveProjectId(project.id);
      return project;
    },
    []
  );

  const addToolToProject = useCallback(
    (projectId: string, toolId: string) => {
      const def = getToolById(toolId);
      if (!def) return;
      setProjects((prev) =>
        prev.map((p) => {
          if (p.id !== projectId) return p;
          if (p.tools.some((t) => t.toolId === toolId)) return p;
          return {
            ...p,
            tools: [
              ...p.tools,
              {
                toolId,
                category: def.category,
                role: def.role,
                addedAt: new Date(),
              },
            ],
            updatedAt: new Date(),
          };
        })
      );
    },
    []
  );

  const removeToolFromProject = useCallback(
    (projectId: string, toolId: string) => {
      setProjects((prev) =>
        prev.map((p) => {
          if (p.id !== projectId) return p;
          return {
            ...p,
            tools: p.tools.filter((t) => t.toolId !== toolId),
            updatedAt: new Date(),
          };
        })
      );
    },
    []
  );

  return {
    projects,
    activeProject,
    activeProjectId,
    setActiveProjectId,
    createProject,
    addToolToProject,
    removeToolFromProject,
  };
}