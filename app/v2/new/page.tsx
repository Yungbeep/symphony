"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Rocket } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { StepIndicator } from "@/components/v2/onboarding/StepIndicator";
import { StepBasics } from "@/components/v2/onboarding/StepBasics";
import { StepType } from "@/components/v2/onboarding/StepType";
import { StepOrchestra } from "@/components/v2/onboarding/StepOrchestra";
import { StepReview } from "@/components/v2/onboarding/StepReview";
import { useOnboarding } from "@/lib/v2/store";

export default function NewProjectPage() {
  const router = useRouter();
  const {
    state,
    stepIndex,
    totalSteps,
    canGoNext,
    goNext,
    goBack,
    goToStep,
    setProjectName,
    setProjectDescription,
    setProjectType,
    toggleTool,
    blueprint,
  } = useOnboarding();

  const isLastStep = state.step === "review";

  const handleFinish = () => {
    // For now, navigate to a demo workspace with query params
    // In production this would create the project and redirect
    const params = new URLSearchParams({
      name: state.projectName,
      type: state.projectType ?? "",
      tools: state.selectedTools.map((t) => t.toolId).join(","),
    });
    router.push(`/v2/projects/demo?${params.toString()}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top bar */}
      <header className="border-b border-border px-6 h-14 flex items-center justify-between shrink-0">
        <button
          onClick={() => router.push("/v2")}
          className="flex items-center gap-2 text-muted hover:text-foreground transition-colors cursor-pointer"
        >
          <ArrowLeft size={16} />
          <Logo size="sm" />
        </button>

        <StepIndicator current={state.step} onGoToStep={goToStep} />

        <div className="w-24" /> {/* Spacer for centering */}
      </header>

      {/* Step content */}
      <main className="flex-1 overflow-y-auto py-12 px-6">
        {state.step === "basics" && (
          <StepBasics
            name={state.projectName}
            description={state.projectDescription}
            onNameChange={setProjectName}
            onDescriptionChange={setProjectDescription}
          />
        )}
        {state.step === "type" && (
          <StepType
            selected={state.projectType}
            onSelect={setProjectType}
          />
        )}
        {state.step === "orchestra" && (
          <StepOrchestra
            selectedTools={state.selectedTools}
            projectType={state.projectType}
            onToggleTool={toggleTool}
          />
        )}
        {state.step === "review" && <StepReview blueprint={blueprint} />}
      </main>

      {/* Footer navigation */}
      <footer className="border-t border-border px-6 py-4 flex items-center justify-between shrink-0">
        <div>
          {stepIndex > 0 && (
            <button
              onClick={goBack}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm text-muted hover:text-foreground hover:border-accent/20 transition-colors cursor-pointer"
            >
              <ArrowLeft size={14} />
              Back
            </button>
          )}
        </div>

        <span className="text-[11px] text-muted-2">
          Step {stepIndex + 1} of {totalSteps}
        </span>

        <div>
          {isLastStep ? (
            <button
              onClick={handleFinish}
              disabled={!canGoNext}
              className="flex items-center gap-2 px-5 py-2 rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent-hover transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <Rocket size={14} />
              Enter workspace
            </button>
          ) : (
            <button
              onClick={goNext}
              disabled={!canGoNext}
              className="flex items-center gap-2 px-5 py-2 rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent-hover transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              Continue
              <ArrowRight size={14} />
            </button>
          )}
        </div>
      </footer>
    </div>
  );
}