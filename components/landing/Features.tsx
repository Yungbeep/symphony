"use client";

import {
  ArrowLeftRight,
  FolderOpen,
  BookMarked,
  Columns2,
  Command,
  Layers,
} from "lucide-react";

const painPoints = [
  "12 tabs open across 3 providers",
  "Copy-pasting context between conversations",
  "Losing the prompt that worked perfectly last week",
  "Starting from scratch every time you switch models",
];

const capabilities = [
  {
    icon: ArrowLeftRight,
    title: "Switch models mid-thought",
    description:
      "Start reasoning with one model, switch to another for implementation. The context stays. The session stays. You don't.",
  },
  {
    icon: FolderOpen,
    title: "Organize by project, not by chat",
    description:
      "Group sessions into the projects they belong to. Architecture discussions next to the code review, not lost in a chronological feed.",
  },
  {
    icon: BookMarked,
    title: "Prompts you've built, ready to use",
    description:
      "Save the prompts that work. Tag them. Insert them in one click. Stop rewriting the same instructions across every new conversation.",
  },
  {
    icon: Columns2,
    title: "Compare outputs side by side",
    description:
      "Split view lets you run the same question through two models simultaneously. See where they agree, and more importantly, where they don't.",
  },
  {
    icon: Command,
    title: "Keyboard-native workflow",
    description:
      "Switch models, insert prompts, toggle focus mode — without reaching for the mouse. Built for the speed of thought.",
  },
  {
    icon: Layers,
    title: "Focus mode for deep work",
    description:
      "Collapse everything except the conversation. Full-width, zero distraction. For the sessions where you need to think, not navigate.",
  },
];

export function Features() {
  return (
    <section className="relative py-32 px-6 section-glow">
      <div className="max-w-5xl mx-auto">
        {/* Pain-point callout */}
        <div className="max-w-2xl mx-auto text-center mb-24">
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight mb-10">
            You already know the problem
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {painPoints.map((point) => (
              <div
                key={point}
                className="flex items-start gap-3 px-5 py-4 rounded-lg border border-border bg-surface text-sm text-muted leading-relaxed text-left"
              >
                <span className="text-muted-2 mt-0.5 shrink-0">&mdash;</span>
                {point}
              </div>
            ))}
          </div>
        </div>

        {/* Capabilities */}
        <div className="text-center mb-16">
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight mb-4">
            One environment. No tab switching.
          </h2>
          <p className="text-muted max-w-lg mx-auto">
            Symphony is not another chatbot skin. It&apos;s a workspace
            built around the way serious AI users actually work.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {capabilities.map((cap) => (
            <div
              key={cap.title}
              className="group relative rounded-xl border border-border bg-surface p-7 transition-all duration-300 hover:border-accent/20"
            >
              <div className="mb-4 inline-flex items-center justify-center w-10 h-10 rounded-lg bg-surface-2 text-muted group-hover:text-accent transition-colors">
                <cap.icon size={20} />
              </div>
              <h3 className="text-[15px] font-medium mb-2">{cap.title}</h3>
              <p className="text-muted text-sm leading-relaxed">
                {cap.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
